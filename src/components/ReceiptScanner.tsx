import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, Upload, X, CheckCircle, Loader2, 
  DollarSign, Calendar, FileText, Zap 
} from 'lucide-react';
import receiptScanningIllustration from '@/assets/receipt-scanning-3d.png';

interface ExtractedData {
  amount: number;
  merchant: string;
  date: string;
  category: string;
  items?: string[];
  confidence: number;
}

interface ReceiptScannerProps {
  onExpenseAdded: (expense: any) => void;
  onClose: () => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onExpenseAdded, onClose }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const categories = [
    '🍔 Food & Dining', '⛽ Transportation', '🛍️ Shopping', '🏠 Bills & Utilities',
    '🎬 Entertainment', '💊 Healthcare', '✈️ Travel', '📚 Education'
  ];

  // Simulate OCR processing
  const simulateOCRProcessing = useCallback(async (file: File): Promise<ExtractedData> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted data based on common receipt patterns
    const mockData: ExtractedData = {
      amount: Math.round((Math.random() * 150 + 10) * 100) / 100,
      merchant: ['Starbucks Coffee', 'Shell Gas Station', 'Target Store', 'Amazon', 'McDonald\'s'][
        Math.floor(Math.random() * 5)
      ],
      date: new Date().toISOString().split('T')[0],
      category: categories[Math.floor(Math.random() * categories.length)],
      items: ['Coffee', 'Sandwich', 'Tax'].slice(0, Math.floor(Math.random() * 3) + 1),
      confidence: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100
    };
    
    return mockData;
  }, [categories]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsProcessing(true);

    try {
      const data = await simulateOCRProcessing(file);
      setExtractedData(data);
      
      toast({
        title: "Receipt processed successfully! 🎉",
        description: `Extracted data with ${Math.round(data.confidence * 100)}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Unable to extract data from receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    toast({
      title: "Camera feature",
      description: "Camera integration would open here for live receipt capture.",
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSaveExpense = () => {
    if (!extractedData) return;

    const expense = {
      id: Date.now().toString(),
      amount: extractedData.amount,
      category: extractedData.category,
      description: `${extractedData.merchant} - Receipt scan`,
      date: extractedData.date,
      type: 'expense' as const,
      receipt: previewUrl,
      extractedItems: extractedData.items,
      confidence: extractedData.confidence
    };

    onExpenseAdded(expense);
    
    toast({
      title: "Expense added! 💰",
      description: `$${extractedData.amount} expense from ${extractedData.merchant}`,
    });
    
    onClose();
  };

  const handleUpdateField = (field: keyof ExtractedData, value: any) => {
    if (!extractedData) return;
    setExtractedData({ ...extractedData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-background shadow-strong">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Scan Receipt</h2>
                <p className="text-sm text-muted-foreground">AI-powered expense extraction</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Upload Options */}
          {!selectedFile && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="text-center mb-6">
                <img 
                  src={receiptScanningIllustration} 
                  alt="Receipt scanning" 
                  className="w-32 h-32 mx-auto mb-4 animate-float"
                />
                <p className="text-muted-foreground">
                  Take a photo or upload an image of your receipt
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={handleCameraCapture}
                  className="h-16 flex items-center justify-center space-x-3 primary-button"
                >
                  <Camera className="w-6 h-6" />
                  <span>Take Photo</span>
                </Button>
                
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                  className="h-16 flex items-center justify-center space-x-3 border-2"
                >
                  <Upload className="w-6 h-6" />
                  <span>Upload from Gallery</span>
                </Button>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 mt-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">AI Features</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Auto-detect amount and merchant</li>
                  <li>• Smart category suggestions</li>
                  <li>• Extract date and items</li>
                  <li>• 95% accuracy rate</li>
                </ul>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-8 animate-fade-in-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Processing Receipt...</h3>
              <p className="text-muted-foreground mb-4">Our AI is extracting expense data</p>
              
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse w-3/4"></div>
                </div>
                <p className="text-sm text-muted-foreground">This usually takes 2-5 seconds</p>
              </div>
            </div>
          )}

          {/* Extracted Data Review */}
          {extractedData && !isProcessing && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">Data Extracted</span>
                </div>
                <Badge variant="default" className="bg-success/10 text-success">
                  {Math.round(extractedData.confidence * 100)}% confident
                </Badge>
              </div>

              {/* Preview Image */}
              {previewUrl && (
                <div className="mb-4">
                  <img 
                    src={previewUrl} 
                    alt="Receipt preview" 
                    className="w-full h-32 object-cover rounded-xl border-2 border-border"
                  />
                </div>
              )}

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-foreground font-medium">Amount</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={extractedData.amount}
                      onChange={(e) => handleUpdateField('amount', parseFloat(e.target.value))}
                      className="h-12 pl-8 rounded-xl border-2"
                    />
                    <DollarSign className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="merchant" className="text-foreground font-medium">Merchant</Label>
                  <Input
                    id="merchant"
                    value={extractedData.merchant}
                    onChange={(e) => handleUpdateField('merchant', e.target.value)}
                    className="h-12 rounded-xl border-2"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-foreground font-medium">Date</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={extractedData.date}
                      onChange={(e) => handleUpdateField('date', e.target.value)}
                      className="h-12 pl-10 rounded-xl border-2"
                    />
                    <Calendar className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-foreground font-medium">Category</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={extractedData.category === category ? "default" : "outline"}
                        className={`p-2 cursor-pointer transition-all text-xs ${
                          extractedData.category === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleUpdateField('category', category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {extractedData.items && extractedData.items.length > 0 && (
                  <div>
                    <Label className="text-foreground font-medium">Detected Items</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {extractedData.items.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleSaveExpense}
                  className="flex-1 primary-button h-12 rounded-xl font-semibold"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Add Expense
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 h-12 rounded-xl border-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptScanner;