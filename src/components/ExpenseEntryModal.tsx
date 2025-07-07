
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Edit3, 
  Camera, 
  Upload, 
  Mail,
  X,
  ArrowLeft
} from 'lucide-react';
import ExpenseManualEntry from './ExpenseManualEntry';
import ExpenseCameraScanner from './ExpenseCameraScanner';
import ExpenseReceiptUpload from './ExpenseReceiptUpload';
import ExpenseEmailProcessor from './ExpenseEmailProcessor';

interface ExpenseEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
  initialMethod?: EntryMethod;
}

type EntryMethod = 'selection' | 'manual' | 'scan' | 'upload' | 'email';

const ExpenseEntryModal: React.FC<ExpenseEntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onExpenseAdded,
  initialMethod = 'selection'
}) => {
  const [currentMethod, setCurrentMethod] = useState<EntryMethod>(initialMethod);

  // Effect to update currentMethod if initialMethod changes while modal is open
  React.useEffect(() => {
    if (isOpen) {
      setCurrentMethod(initialMethod);
    }
  }, [initialMethod, isOpen]);

  const handleClose = () => {
    // Reset to selection only if it was the initial method or for explicit close.
    // If opened directly to a method, closing should just close.
    // However, for simplicity now, always reset to selection on explicit close action.
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
      default: // Selection screen
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                Add New Expense
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Choose your preferred method to record an expense.
              </p>
            </div>
            
            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {methods.map((method) => (
                <button
                  key={method.id}
                  className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 flex items-center space-x-4 text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600`}
                  onClick={() => setCurrentMethod(method.id)}
                >
                  <div className={`flex-shrink-0 w-12 h-12 ${method.color} rounded-lg flex items-center justify-center`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{method.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{method.description}</p>
                  </div>
                </button>
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
      <DialogContent
        className="w-full h-full max-w-none max-h-none m-0 p-0 bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-900 flex flex-col"
        onInteractOutside={(e) => e.preventDefault()} // Optional: prevent closing on outside click if truly modal
      >
        <DialogHeader className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentMethod !== 'selection' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                {getTitle()}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseEntryModal;
