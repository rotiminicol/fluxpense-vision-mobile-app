import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  X, DollarSign, Calendar, FileText, 
  Camera, Upload, Mail, PenTool
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type ExpenseMethod = 'manual' | 'scan' | 'upload' | 'email';

interface ExpenseEntryModalProps {
  method: ExpenseMethod;
  onClose: () => void;
  onExpenseAdded: (expense: any) => void;
}

const ExpenseEntryModal: React.FC<ExpenseEntryModalProps> = ({ 
  method, 
  onClose, 
  onExpenseAdded 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    email: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const categories = [
    '🍔 Food & Dining', '⛽ Transportation', '🛍️ Shopping', '🏠 Bills & Utilities',
    '🎬 Entertainment', '💊 Healthcare', '✈️ Travel', '📚 Education'
  ];

  const getMethodIcon = () => {
    switch (method) {
      case 'scan': return <Camera className="w-5 h-5" />;
      case 'upload': return <Upload className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      default: return <PenTool className="w-5 h-5" />;
    }
  };

  const getMethodTitle = () => {
    switch (method) {
      case 'scan': return 'Scan Receipt';
      case 'upload': return 'Upload Receipt';
      case 'email': return 'Email Receipt';
      default: return 'Manual Entry';
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (method === 'scan' || method === 'upload') {
      processReceipt(file);
    }
  };

  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result?.toString();
        
        const { data, error } = await supabase.functions.invoke('process-receipt', {
          body: { image: base64 }
        });

        if (error) throw error;

        setFormData(prev => ({
          ...prev,
          amount: data.amount?.toString() || '',
          description: data.merchant || '',
          merchant: data.merchant || '',
          date: data.date || prev.date,
          category: data.category || ''
        }));

        toast({
          title: "Receipt processed! 🎉",
          description: `Extracted $${data.amount} from ${data.merchant}`,
        });
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: error.message || "Unable to extract data from receipt.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processEmailReceipt = async () => {
    if (!formData.email.trim()) {
      toast({
        title: "Email required",
        description: "Please paste the email content to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-email-receipt', {
        body: { emailContent: formData.email }
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        amount: data.amount?.toString() || '',
        description: data.merchant || '',
        merchant: data.merchant || '',
        date: data.date || prev.date,
        category: data.category || ''
      }));

      toast({
        title: "Email processed! 📧",
        description: `Extracted expense data from email`,
      });
    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: error.message || "Unable to extract data from email.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in amount and description.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user?.id,
          amount: parseFloat(formData.amount),
          description: formData.description,
          merchant_name: formData.merchant,
          date: formData.date,
          category_id: null // We'll implement category lookup later
        })
        .select()
        .single();

      if (error) throw error;

      onExpenseAdded(data);
      toast({
        title: "Expense added! 💰",
        description: `$${formData.amount} expense recorded`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to save expense",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Here you would implement camera interface
      // For now, we'll use file input as fallback
      fileInputRef.current?.click();
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera permissions or use upload instead.",
        variant: "destructive",
      });
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-background shadow-strong">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                {getMethodIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{getMethodTitle()}</h2>
                <p className="text-sm text-muted-foreground">Add your expense</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Method-specific input */}
          {method === 'scan' && !selectedFile && (
            <div className="mb-6">
              <Button
                onClick={startCamera}
                className="w-full h-16 primary-button"
                disabled={isProcessing}
              >
                <Camera className="w-6 h-6 mr-2" />
                Open Camera
              </Button>
            </div>
          )}

          {method === 'upload' && !selectedFile && (
            <div className="mb-6">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-16 primary-button"
                disabled={isProcessing}
              >
                <Upload className="w-6 h-6 mr-2" />
                Select Image
              </Button>
            </div>
          )}

          {method === 'email' && (
            <div className="mb-6">
              <Label htmlFor="email">Email Content</Label>
              <Textarea
                id="email"
                placeholder="Paste your receipt email content here..."
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="min-h-24 rounded-xl"
              />
              <Button
                onClick={processEmailReceipt}
                className="w-full mt-2 primary-button"
                disabled={isProcessing || !formData.email.trim()}
              >
                {isProcessing ? 'Processing...' : 'Process Email'}
              </Button>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-foreground font-medium">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="h-12 pl-8 rounded-xl border-2"
                  placeholder="0.00"
                />
                <DollarSign className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="h-12 rounded-xl border-2"
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-foreground font-medium">Date</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="h-12 pl-10 rounded-xl border-2"
                />
                <Calendar className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label className="text-foreground font-medium">Category</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={formData.category === category ? "default" : "outline"}
                    className={`p-2 cursor-pointer transition-all text-xs ${
                      formData.category === category
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category }))}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-6 primary-button h-12"
            disabled={isProcessing || !formData.amount || !formData.description}
          >
            {isProcessing ? 'Saving...' : 'Add Expense'}
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseEntryModal;