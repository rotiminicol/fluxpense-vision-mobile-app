import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Receipt, 
  Plus, 
  BarChart3, 
  Menu,
  Bell,
  CreditCard,
  HelpCircle,
  ArrowRightLeft,
  Settings,
  User,
  LogOut,
  Smartphone,
  Camera,
  Upload,
  Pencil,
  Mail,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

interface BottomNavigationProps {
  onQuickAdd: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onQuickAdd }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date());
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/expenses', icon: Receipt, label: 'Expenses' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const menuItems = [
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: 3 },
    { path: '/billing', icon: CreditCard, label: 'Billing & Plans' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
    { path: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Handle camera access for scan modal
  useEffect(() => {
    if (scanModalOpen && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        })
        .catch((err) => console.error('Error accessing camera:', err));
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [scanModalOpen]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 px-4 py-2 safe-area-padding">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Dashboard */}
        <NavLink to="/dashboard">
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 hover:bg-hover">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-primary text-primary-foreground scale-110' : 'text-muted-foreground'
              }`}>
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Dashboard
              </span>
            </div>
          )}
        </NavLink>

        {/* Expenses */}
        <NavLink to="/expenses">
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 hover:bg-hover">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-primary text-primary-foreground scale-110' : 'text-muted-foreground'
              }`}>
                <Receipt className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Expenses
              </span>
            </div>
          )}
        </NavLink>

        {/* Quick Add Button */}
        <div className="flex flex-col items-center space-y-1 relative">
          <Button
            onClick={() => setQuickMenuOpen((v) => !v)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:scale-110 transition-all duration-300 shadow-2xl z-50 animate-pulse-slow"
          >
            {quickMenuOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
          </Button>
          <span className="text-xs font-medium text-muted-foreground">Add</span>
          {/* Floating Quick Action Menu */}
          {quickMenuOpen && (
            <>
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in-up"
                onClick={() => setQuickMenuOpen(false)}
              />
              {/* Floating Quick Action Menu */}
              <div className="fixed inset-x-0 bottom-20 z-50 flex justify-center pointer-events-none">
                <div className="pointer-events-auto grid grid-cols-2 gap-6 p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200 max-w-sm">
                  <button
                    className="w-24 h-24 rounded-xl bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-400 hover:text-white transition-all duration-300 group animate-bounce-in"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => { setQuickMenuOpen(false); setManualModalOpen(true); }}
                  >
                    <Pencil className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold group-hover:text-white">Manual</span>
                  </button>
                  <button
                    className="w-24 h-24 rounded-xl bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-400 hover:text-white transition-all duration-300 group animate-bounce-in delay-75"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => { setQuickMenuOpen(false); setScanModalOpen(true); }}
                  >
                    <Camera className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold group-hover:text-white">Scan</span>
                  </button>
                  <button
                    className="w-24 h-24 rounded-xl bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-400 hover:text-white transition-all duration-300 group animate-bounce-in delay-150"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => { setQuickMenuOpen(false); setUploadModalOpen(true); }}
                  >
                    <Upload className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold group-hover:text-white">Upload</span>
                  </button>
                  <button
                    className="w-24 h-24 rounded-xl bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-400 hover:text-white transition-all duration-300 group animate-bounce-in delay-225"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => { setQuickMenuOpen(false); setEmailModalOpen(true); }}
                  >
                    <Mail className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold group-hover:text-white">Email</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Reports */}
        <NavLink to="/reports">
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 hover:bg-hover">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-primary text-primary-foreground scale-110' : 'text-muted-foreground'
              }`}>
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Reports
              </span>
            </div>
          )}
        </NavLink>

        {/* Menu */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 hover:bg-hover cursor-pointer">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                menuOpen ? 'bg-primary text-primary-foreground scale-110' : 'text-muted-foreground'
              }`}>
                <Menu className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium transition-colors ${
                menuOpen ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Menu
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            side="top" 
            className="w-56 mb-2 bg-card/95 backdrop-blur-xl border border-border/50 shadow-strong animate-slide-up"
          >
            <DropdownMenuLabel className="font-semibold text-foreground">More Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <NavLink 
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-hover rounded-md transition-colors w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Manual Entry Modal */}
      <Dialog open={manualModalOpen} onOpenChange={setManualModalOpen}>
        <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 bg-white/95 backdrop-blur-2xl flex flex-col animate-slide-up">
          <DialogHeader className="p-6 pb-4 bg-gradient-to-b from-blue-500 to-blue-400 text-white">
            <DialogTitle className="text-2xl font-bold">Add Expense</DialogTitle>
            <DialogDescription className="text-sm text-blue-100">Manually add a new expense entry</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
            <div className="animate-fade-in-up delay-0">
              <label className="block text-sm font-semibold mb-2 text-blue-700">Date</label>
              <Calendar selected={expenseDate} onSelect={setExpenseDate} className="rounded-2xl border bg-white shadow-lg" />
            </div>
            <div className="animate-fade-in-up delay-75">
              <label className="block text-sm font-semibold mb-2 text-blue-700">Title</label>
              <Input 
                value={expenseTitle} 
                onChange={e => setExpenseTitle(e.target.value)} 
                placeholder="Expense Title" 
                className="rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-400 transition-all" 
              />
            </div>
            <div className="animate-fade-in-up delay-150">
              <label className="block text-sm font-semibold mb-2 text-blue-700">Amount</label>
              <Input 
                value={expenseAmount} 
                onChange={e => setExpenseAmount(e.target.value)} 
                placeholder="Amount" 
                type="number" 
                className="rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-400 transition-all" 
              />
            </div>
            <div className="animate-fade-in-up delay-225">
              <label className="block text-sm font-semibold mb-2 text-blue-700">Category</label>
              <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                <SelectTrigger className="rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl rounded-xl">
                  <SelectItem value="food">🍔 Food & Dining</SelectItem>
                  <SelectItem value="transport">⛽ Transportation</SelectItem>
                  <SelectItem value="shopping">🛒 Shopping</SelectItem>
                  <SelectItem value="income">💰 Income</SelectItem>
                  <SelectItem value="coffee">☕ Coffee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-xl py-6 text-lg shadow-2xl hover:from-blue-600 hover:to-blue-500 transition-all animate-scale-in delay-300"
              onClick={() => setManualModalOpen(false)}
            >
              Save Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scan Receipt Modal */}
      <Dialog open={scanModalOpen} onOpenChange={setScanModalOpen}>
        <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 bg-black flex flex-col animate-slide-up">
          <DialogHeader className="p-6 bg-gradient-to-b from-blue-500 to-blue-400 text-white">
            <DialogTitle className="text-2xl font-bold">Scan Receipt</DialogTitle>
            <DialogDescription className="text-sm text-blue-100">Use your camera to scan a receipt</DialogDescription>
          </DialogHeader>
          <div className="flex-1 relative">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-blue-400/50 rounded-xl animate-scan-frame" />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-xl py-6 px-8 text-lg shadow-2xl hover:from-blue-600 hover:to-blue-500 transition-all animate-scale-in"
                onClick={() => setScanModalOpen(false)}
              >
                Capture Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Image Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 bg-white/95 backdrop-blur-2xl flex flex-col animate-slide-up">
          <DialogHeader className="p-6 bg-gradient-to-b from-blue-500 to-blue-400 text-white">
            <DialogTitle className="text-2xl font-bold">Upload Receipt Image</DialogTitle>
            <DialogDescription className="text-sm text-blue-100">Upload a photo of your receipt</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6">
            <label 
              htmlFor="upload-receipt" 
              className="w-full max-w-md flex flex-col items-center justify-center border-4 border-dashed border-blue-300 rounded-2xl p-12 cursor-pointer bg-blue-50/50 hover:bg-blue-100 transition-all duration-300 animate-pulse-slow"
            >
              <Upload className="w-16 h-16 text-blue-400 mb-4 transition-transform group-hover:scale-110" />
              <span className="text-lg font-semibold text-blue-700">Click or drag file to upload</span>
              <span className="text-sm text-muted-foreground mt-2">Supports PNG, JPG, JPEG</span>
              <input id="upload-receipt" type="file" accept="image/*" className="hidden" />
            </label>
            <Button 
              className="w-full max-w-md mt-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-xl py-6 text-lg shadow-2xl hover:from-blue-600 hover:to-blue-500 transition-all animate-scale-in delay-300"
              onClick={() => setUploadModalOpen(false)}
            >
              Upload Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Receipt Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 bg-white/95 backdrop-blur-2xl flex flex-col animate-slide-up">
          <DialogHeader className="p-6 bg-gradient-to-b from-blue-500 to-blue-400 text-white">
            <DialogTitle className="text-2xl font-bold">Email Receipt</DialogTitle>
            <DialogDescription className="text-sm text-blue-100">Forward a receipt to your expense inbox</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 flex flex-col gap-6">
            <div className="animate-fade-in-up delay-0">
              <label className="block text-sm font-semibold mb-2 text-blue-700">Your Email</label>
              <Input 
                placeholder="you@email.com" 
                className="rounded-xl border-blue-200 focus:ring-2 focus:ring-blue-400 transition-all" 
              />
            </div>
            <div className="animate-fade-in-up delay-75">
              <label className="block text-sm font-semibold mb-2 text-blue-700">Attach Receipt</label>
              <label 
                htmlFor="email-receipt-upload" 
                className="w-full flex flex-col items-center justify-center border-4 border-dashed border-blue-300 rounded-2xl p-8 cursor-pointer bg-blue-50/50 hover:bg-blue-100 transition-all duration-300 animate-pulse-slow"
              >
                <Upload className="w-12 h-12 text-blue-400 mb-4 transition-transform group-hover:scale-110" />
                <span className="text-lg font-semibold text-blue-700">Click or drag file to upload</span>
                <span className="text-sm text-muted-foreground mt-2">Supports PNG, JPG, JPEG, PDF</span>
                <input id="email-receipt-upload" type="file" accept="image/*,application/pdf" className="hidden" />
              </label>
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-xl py-6 text-lg shadow-2xl hover:from-blue-600 hover:to-blue-500 transition-all animate-scale-in delay-150"
              onClick={() => setEmailModalOpen(false)}
            >
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BottomNavigation;