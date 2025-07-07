
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ExpenseReceiptUploadProps {
  onClose: () => void;
  onExpenseAdded: () => void;
}

const ExpenseReceiptUpload: React.FC<ExpenseReceiptUploadProps> = ({ onClose, onExpenseAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processReceipt = async () => {
    if (!selectedFile || !user) return;

    setIsProcessing(true);
    try {
      // Upload to Supabase Storage
      const fileName = `receipt-${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(`${user.id}/${fileName}`, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(uploadData.path);

      // Call OCR edge function with Mindee API
      const { data: ocrResult, error: ocrError } = await supabase.functions.invoke('process-receipt', {
        body: { imageUrl: publicUrl }
      });

      if (ocrError) throw ocrError;

      // Create receipt record
      const { error: receiptError } = await supabase
        .from('receipts')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          original_filename: selectedFile.name,
          file_size: selectedFile.size,
          ocr_data: ocrResult,
          ocr_status: 'completed',
          extracted_amount: ocrResult?.amount || null,
          extracted_merchant: ocrResult?.merchant || null,
          extracted_date: ocrResult?.date || null,
          confidence_score: ocrResult?.confidence || null
        });

      if (receiptError) throw receiptError;

      // Create expense if OCR was successful
      if (ocrResult?.amount && ocrResult?.merchant) {
        const { error: expenseError } = await supabase
          .from('expenses')
          .insert({
            user_id: user.id,
            amount: ocrResult.amount,
            description: ocrResult.merchant,
            date: ocrResult.date || new Date().toISOString().split('T')[0],
            merchant_name: ocrResult.merchant,
            receipt_url: publicUrl,
            receipt_data: ocrResult
          });

        if (expenseError) throw expenseError;

        // Create notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Receipt Processed',
          message: `Successfully processed receipt from ${ocrResult.merchant} - $${ocrResult.amount}`,
          type: 'success'
        });
      }

      toast({
        title: "Receipt processed successfully!",
        description: ocrResult?.amount ? "Expense has been automatically added." : "Receipt saved, please add expense details manually.",
      });

      onExpenseAdded();
      onClose();
    } catch (error: any) {
      console.error('Error processing receipt:', error);
      toast({
        title: "Processing failed",
        description: "Could not extract information from the receipt. Please try again or use manual entry.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
            />
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">{selectedFile?.name}</p>
              <p className="text-xs text-gray-500">
                {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <FileImage className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Upload Receipt Image
              </p>
              <p className="text-sm text-gray-500">
                Click to select an image or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports JPG, PNG • Max 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        
        {selectedFile && (
          <>
            <Button variant="outline" onClick={clearSelection} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Change File
            </Button>
            <Button 
              onClick={processReceipt} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Process Receipt
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseReceiptUpload;
