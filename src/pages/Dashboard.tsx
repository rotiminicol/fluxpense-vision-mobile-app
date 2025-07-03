import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, Camera, FileText, TrendingUp, TrendingDown, 
  DollarSign, PieChart, Calendar, Settings, User,
  Scan, Upload, Eye, MoreHorizontal
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="w-10 h-10 rounded-xl shadow-soft"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">FluxPense</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hover:bg-hover">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-hover">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Monthly Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="expense-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold text-foreground">${monthlySpent.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-expense/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-expense" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="expense-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-xl font-bold text-success">${remaining.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="expense-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Income</p>
                  <p className="text-xl font-bold text-income">${monthlyIncome.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-income/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-income" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="expense-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                  <p className="text-xl font-bold text-foreground">{budgetUsed.toFixed(0)}%</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
      </div>

      {/* Floating Action Button */}
      <div className="floating-action">
        <Button
          onClick={() => setShowAddOptions(!showAddOptions)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white hover:scale-110 transition-all duration-300"
        >
          <Plus className={`w-8 h-8 transition-transform duration-300 ${showAddOptions ? 'rotate-45' : ''}`} />
        </Button>
        
        {/* Quick add options */}
        {showAddOptions && (
          <div className="absolute bottom-20 right-0 space-y-3 animate-slide-up">
            <Button
              onClick={handleScanReceipt}
              className="w-14 h-14 rounded-full bg-success text-white shadow-medium hover:scale-110 transition-all duration-300"
            >
              <Scan className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleManualEntry}
              className="w-14 h-14 rounded-full bg-secondary text-white shadow-medium hover:scale-110 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;