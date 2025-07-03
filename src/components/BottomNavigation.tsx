import React, { useState } from 'react';
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
  Smartphone
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface BottomNavigationProps {
  onQuickAdd: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onQuickAdd }) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="flex flex-col items-center space-y-1">
          <Button
            onClick={onQuickAdd}
            className="w-12 h-12 rounded-full bg-gradient-primary text-white hover:scale-110 transition-all duration-300 shadow-primary"
          >
            <Plus className="w-6 h-6" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground">Add</span>
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
    </div>
  );
};

export default BottomNavigation;