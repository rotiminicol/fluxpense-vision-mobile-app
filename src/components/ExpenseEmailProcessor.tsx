
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ExpenseEmailProcessorProps {
  onClose: () => void;
  onExpenseAdded: () => void;
}

const ExpenseEmailProcessor: React.FC<ExpenseEmailProcessorProps> = ({ onClose, onExpenseAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    sender: '',
    content: ''
  });

  const processEmail = async () => {
    if (!user) return;
    
    if (!emailData.subject && !emailData.content) {
      toast({
        title: "Missing information",
        description: "Please provide email content or subject.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Call email processing edge function
      const { data: result, error } = await supabase.functions.invoke('process-email-receipt', {
        body: {
          subject: emailData.subject,
          sender: emailData.sender,
          content: emailData.content,
          userId: user.id
        }
      });

      if (error) throw error;

      if (result?.expense) {
        // Create notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Email Receipt Processed',
          message: `Successfully processed email receipt - $${result.expense.amount}`,
          type: 'success'
        });

        toast({
          title: "Email processed successfully!",
          description: `Expense has been added: $${result.expense.amount}`,
        });

        onExpenseAdded();
        onClose();
      } else {
        toast({
          title: "No expense found",
          description: "Could not extract expense information from the email.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error processing email:', error);
      toast({
        title: "Failed to process email",
        description: "Could not extract expense information. Please try manual entry.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Process Email Receipt
        </h3>
        <p className="text-sm text-gray-600">
          Paste email content with receipt information to automatically extract expense details.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="sender">Sender Email</Label>
          <Input
            id="sender"
            type="email"
            placeholder="receipt@store.com"
            value={emailData.sender}
            onChange={(e) => setEmailData(prev => ({ ...prev, sender: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            placeholder="Your receipt from Store Name"
            value={emailData.subject}
            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="content">Email Content</Label>
          <textarea
            id="content"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the email content containing receipt information..."
            value={emailData.content}
            onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Forward receipt emails to <strong>tzibdfwx@mailparser.io</strong> for automatic processing, or paste the email content here manually.
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={processEmail} 
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
              <Send className="w-4 h-4 mr-2" />
              Process Email
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExpenseEmailProcessor;
