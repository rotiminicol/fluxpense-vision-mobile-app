import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client'; // Removed
// import { useToast } from '@/hooks/use-toast'; // Removed
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
  Camera,
  Upload,
  Pencil,
  Mail,
  X
} from 'lucide-react'; // Removed Smartphone
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
// Dialog, Input, Select, Calendar related imports are removed as they are no longer used directly here

// Define EntryMethod type locally or import if available globally
type EntryMethod = 'selection' | 'manual' | 'scan' | 'upload' | 'email';

interface BottomNavigationProps {
  onQuickAdd: (method?: EntryMethod) => void; // Updated prop type
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onQuickAdd }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  // Removed state variables for individual modals and their specific data/refs
  // e.g., manualModalOpen, expenseDate, videoRef, emailContent, isProcessing, etc.

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
    // { path: '#logout', icon: LogOut, label: 'Sign Out' }, // Example for logout
  ];

  // Removed useEffect for camera access.
  // Removed local handler functions: getCurrentUser, capturePhoto, stopCamera,
  // processReceiptImage, handleFileUpload, addExpense, handleManualSave, handleEmailProcess.
  // This logic is now expected to be within the individual expense entry components.

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
                    onClick={() => { setQuickMenuOpen(false); onQuickAdd('manual'); }}
                  >
                    <Pencil className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold group-hover:text-white">Manual</span>
                  </button>
                  <button
                    className="w-24 h-24 rounded-xl bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-400 hover:text-white transition-all duration-300 group animate-bounce-in delay-75"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => { setQuickMenuOpen(false); onQuickAdd('scan'); }}
                  >
                    <Camera className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold group-hover:text-white">Scan</span>
                  </button>
                  <button
                    className="w-24 h-24 rounded-xl bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-400 hover:text-white transition-all duration-300 group animate-bounce-in delay-150"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => { setQuickMenuOpen(false); onQuickAdd('upload'); }}
                  >
                    <Upload className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold group-hover:text-white">Upload</span>
                  </button>
                  <button
                    className="w-24 h-24 rounded-xl bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-400 hover:text-white transition-all duration-300 group animate-bounce-in delay-225"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => { setQuickMenuOpen(false); onQuickAdd('email'); }}
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
             item.path ? ( // Check if item.path exists for NavLink
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
              ) : (item as any).action ? ( // Handle items with an action
                <DropdownMenuItem
                  key={item.label} // Use label as key if path is missing
                  onClick={() => { (item as any).action(); setMenuOpen(false); }}
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-hover rounded-md transition-colors w-full cursor-pointer"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">{item.label}</span>
                </DropdownMenuItem>
              ) : null
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Removed all individual Dialog components for manual, scan, upload, email */}
    </div>
  );
};

export default BottomNavigation;