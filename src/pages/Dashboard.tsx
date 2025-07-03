import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, Camera, FileText, TrendingUp, TrendingDown, 
  DollarSign, PieChart, Calendar, Bell, User,
  Scan, Upload, Eye, MoreHorizontal, LogOut, Settings, Lightbulb
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import BottomNavigation from '@/components/BottomNavigation';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
  receipt?: string;
}

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showAddOptions, setShowAddOptions] = useState(false);
  
  // Mock data - in real app this would come from API
  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 45.99,
      category: '🍔 Food & Dining',
      description: 'Lunch at Cafe Plaza',
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: '2',
      amount: 120.00,
      category: '⛽ Transportation',
      description: 'Gas Station Fill-up',
      date: '2024-01-14',
      type: 'expense'
    },
    {
      id: '3',
      amount: 2500.00,
      category: '💰 Income',
      description: 'Salary Payment',
      date: '2024-01-01',
      type: 'income'
    }
  ]);

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthlyBudget = 3000;
  const monthlySpent = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const monthlyIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const budgetUsed = (monthlySpent / monthlyBudget) * 100;
  const remaining = monthlyBudget - monthlySpent;

  const handleScanReceipt = () => {
    toast({
      title: "Camera Opening",
      description: "Receipt scanning feature will open camera to capture receipt.",
    });
    setShowAddOptions(false);
  };

  const handleUploadReceipt = () => {
    toast({
      title: "File Upload",
      description: "Upload receipt feature will allow you to select image files.",
    });
    setShowAddOptions(false);
  };

  const handleManualEntry = () => {
    toast({
      title: "Manual Entry",
      description: "Manual expense entry form will open.",
    });
    setShowAddOptions(false);
  };

  const handleEmailIntegration = () => {
    toast({
      title: "Email Integration",
      description: "Email receipt forwarding setup will be available soon.",
    });
    setShowAddOptions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary/5 relative overflow-hidden flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-card/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="w-10 h-10 rounded-xl shadow-soft"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">FluxPense</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative hover:bg-hover">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-xl">
                <div className="p-3 border-b">
                  <h4 className="font-semibold">Notifications</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Budget Alert</p>
                      <p className="text-xs text-muted-foreground">You've used 85% of your monthly budget</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Goal Achieved!</p>
                      <p className="text-xs text-muted-foreground">You've saved $500 this month</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Receipt Reminder</p>
                      <p className="text-xs text-muted-foreground">Don't forget to scan today's receipts</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-hover">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/billing'}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate('/welcome'); }} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Animated summary cards */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <motion.div
            className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-foreground">${monthlySpent.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-primary" />
            </div>
          </motion.div>
          <motion.div
            className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <div className="text-sm text-muted-foreground mb-1">Monthly Limit</div>
              <div className="text-2xl font-bold text-foreground">${monthlyBudget.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-warning" />
            </div>
          </motion.div>
          <motion.div
            className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div>
              <div className="text-sm text-muted-foreground mb-1">Balance Left</div>
              <div className="text-2xl font-bold text-foreground">${remaining.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </motion.div>
        </div>
        {/* Animated chart */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <CardTitle className="mb-2">Spending Breakdown</CardTitle>
          </div>
        </motion.div>
        {/* Daily tips widget */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 shadow-lg flex items-center">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Tip of the Day</div>
              <div className="text-sm text-muted-foreground">Set a weekly review to spot spending trends and save more.</div>
            </div>
          </div>
        </motion.div>
        {/* Budget Progress */}
        <Card className="expense-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Monthly Budget - {currentMonth}</span>
              <Badge variant={budgetUsed > 90 ? "destructive" : budgetUsed > 70 ? "secondary" : "default"}>
                {budgetUsed.toFixed(0)}% used
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress 
                value={budgetUsed} 
                className={`h-3 ${budgetUsed > 90 ? 'bg-destructive/20' : 'bg-primary/20'}`}
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">${monthlySpent.toLocaleString()} spent</span>
                <span className="text-muted-foreground">${monthlyBudget.toLocaleString()} budget</span>
              </div>
              {budgetUsed > 90 && (
                <p className="text-sm text-destructive">⚠️ You're approaching your budget limit</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="expense-card">
          <CardHeader className="pb-3">
            <CardTitle>Quick Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleScanReceipt}
                className="h-20 flex flex-col items-center justify-center space-y-2 primary-button"
              >
                <Camera className="w-6 h-6" />
                <span>Scan Receipt</span>
              </Button>
              
              <Button
                onClick={handleUploadReceipt}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-hover"
              >
                <Upload className="w-6 h-6" />
                <span>Upload Image</span>
              </Button>
              
              <Button
                onClick={handleManualEntry}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-hover"
              >
                <Plus className="w-6 h-6" />
                <span>Manual Entry</span>
              </Button>
              
              <Button
                onClick={handleEmailIntegration}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-hover"
              >
                <FileText className="w-6 h-6" />
                <span>Email Receipt</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="expense-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Recent Transactions</span>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-hover transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      expense.type === 'income' ? 'bg-income/10' : 'bg-expense/10'
                    }`}>
                      <span className="text-sm">
                        {expense.category.split(' ')[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category.replace(/^\S+\s/, '')} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      expense.type === 'income' ? 'text-income' : 'text-expense'
                    }`}>
                      {expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString()}
                    </p>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights Card */}
        <Card className="expense-card">
          <CardHeader className="pb-3">
            <CardTitle>💡 Smart Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-xl">
                <p className="text-sm font-medium text-foreground">Great job! 🎉</p>
                <p className="text-sm text-muted-foreground">You're saving 15% more than last month</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-warning/10 to-destructive/10 rounded-xl">
                <p className="text-sm font-medium text-foreground">Watch out! ⚠️</p>
                <p className="text-sm text-muted-foreground">Food spending is 25% higher than usual</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                <p className="text-sm font-medium text-foreground">Tip 💡</p>
                <p className="text-sm text-muted-foreground">Scan receipts immediately to never miss an expense</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={handleManualEntry}
        className="fixed bottom-24 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-strong flex items-center justify-center text-white text-3xl hover:scale-110 focus:scale-105 transition-transform duration-200 animate-fab-pulse"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', bounce: 0.4 }}
        style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}
        aria-label="Add Expense"
      >
        <Plus className="w-8 h-8 rotate-0 transition-transform duration-300 group-hover:rotate-90" />
      </motion.button>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4, type: 'spring' }}
        className="z-50"
      >
        <BottomNavigation onQuickAdd={handleManualEntry} />
      </motion.div>
    </div>
  );
};

export default Dashboard;