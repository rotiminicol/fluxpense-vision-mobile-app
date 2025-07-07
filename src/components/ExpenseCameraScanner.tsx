
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Check, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ExpenseCameraScannerProps {
  onClose: () => void;
  onExpenseAdded: () => void;
}

const ExpenseCameraScanner: React.FC<ExpenseCameraScannerProps> = ({ onClose, onExpenseAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan receipts.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    stopCamera();
  }, [stopCamera]);

  const processReceipt = async () => {
    if (!capturedImage || !user) return;

    setIsProcessing(true);
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const fileName = `receipt-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(`${user.id}/${fileName}`, blob);

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
          title: 'Receipt Scanned',
          message: `Successfully scanned receipt from ${ocrResult.merchant} - $${ocrResult.amount}`,
          type: 'success'
        });
      }

      toast({
        title: "Receipt scanned successfully!",
        description: "Expense has been automatically added from your receipt.",
      });

      onExpenseAdded();
      onClose();
    } catch (error: any) {
      console.error('Error processing receipt:', error);
      toast({
        title: "Failed to process receipt",
        description: "Could not extract information from the receipt. Please try manual entry.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {isStreaming && (
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black"
                >
                  <Camera className="w-8 h-8" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured receipt"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <p className="text-white text-sm font-medium">Receipt captured</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={retakePhoto} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
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
                  Process
                </>
              )}
            </Button>
          </>
        ) : (
          <Button disabled className="flex-1">
            <Camera className="w-4 h-4 mr-2" />
            Position receipt and tap capture
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpenseCameraScanner;
