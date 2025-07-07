
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Edit3, 
  Camera, 
  Upload, 
  Mail,
  X
} from 'lucide-react';
import ExpenseManualEntry from './ExpenseManualEntry';
import ExpenseCameraScanner from './ExpenseCameraScanner';
import ExpenseReceiptUpload from './ExpenseReceiptUpload';
import ExpenseEmailProcessor from './ExpenseEmailProcessor';

interface ExpenseEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
}

type EntryMethod = 'selection' | 'manual' | 'scan' | 'upload' | 'email';

const ExpenseEntryModal: React.FC<ExpenseEntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onExpenseAdded 
}) => {
  const [currentMethod, setCurrentMethod] = useState<EntryMethod>('selection');

  const handleClose = () => {
    setCurrentMethod('selection');
    onClose();
  };

  const handleBack = () => {
    setCurrentMethod('selection');
  };

  const methods = [
    {
      id: 'manual' as EntryMethod,
      title: 'Manual Entry',
      description: 'Enter expense details manually',
      icon: Edit3,
      color: 'bg-blue-500',
    },
    {
      id: 'scan' as EntryMethod,
      title: 'Scan Receipt',
      description: 'Use camera to scan receipt',
      icon: Camera,
      color: 'bg-green-500',
    },
    {
      id: 'upload' as EntryMethod,
      title: 'Upload Receipt',
      description: 'Upload receipt image from gallery',
      icon: Upload,
      color: 'bg-purple-500',
    },
    {
      id: 'email' as EntryMethod,
      title: 'Email Receipt',
      description: 'Process receipt from email',
      icon: Mail,
      color: 'bg-orange-500',
    },
  ];

  const renderContent = () => {
    switch (currentMethod) {
      case 'manual':
        return (
          <ExpenseManualEntry 
            onClose={handleClose}
            onExpenseAdded={onExpenseAdded}
          />
        );
      case 'scan':
        return (
          <ExpenseCameraScanner 
            onClose={handleClose}
            onExpenseAdded={onExpenseAdded}
          />
        );
      case 'upload':
        return (
          <ExpenseReceiptUpload 
            onClose={handleClose}
            onExpenseAdded={onExpenseAdded}
          />
        );
      case 'email':
        return (
          <ExpenseEmailProcessor 
            onClose={handleClose}
            onExpenseAdded={onExpenseAdded}
          />
        );
      default:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How would you like to add this expense?
              </h3>
              <p className="text-sm text-gray-600">
                Choose the method that works best for you
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {methods.map((method) => (
                <Button
                  key={method.id}
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-gray-50 border-2 hover:border-blue-200 transition-all"
                  onClick={() => setCurrentMethod(method.id)}
                >
                  <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center mr-4`}>
                    <method.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{method.title}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (currentMethod) {
      case 'manual':
        return 'Manual Entry';
      case 'scan':
        return 'Scan Receipt';
      case 'upload':
        return 'Upload Receipt';
      case 'email':
        return 'Email Receipt';
      default:
        return 'Add Expense';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {getTitle()}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {currentMethod !== 'selection' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Back
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseEntryModal;
