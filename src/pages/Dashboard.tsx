import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
  receipt?: boolean;
}

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Add state for balance visibility
  const [showBalance, setShowBalance] = useState(true);
  const totalBalance = 1250.00;
  const totalExpense = 14300.00;
  const totalSalary = 12500.00;
  const monthlyExpense = 2287.88;
  // Add state for selected transaction modal
  const [selectedTransaction, setSelectedTransaction] = useState<Expense & { method?: string; location?: string; tags?: string[]; receipt?: boolean } | null>(null);
  
  // Real data from backend
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real expenses from Supabase
  React.useEffect(() => {
    const loadExpenses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            id,
            amount,
            description,
            date,
            categories(name)
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5);

        if (error) throw error;

        const formattedExpenses = data?.map(expense => ({
          id: expense.id,
          amount: expense.amount,
          category: expense.categories?.name || 'Other',
          description: expense.description,
          date: expense.date,
          type: 'expense' as const
        })) || [];

        setExpenses(formattedExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
        // Fallback to empty array if no data
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary/5 relative overflow-hidden flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between w-full rounded-none bg-white/70 backdrop-blur shadow-lg p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
              <img src={fluxpenseLogo} alt="FluxPense" className="w-8 h-8" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg font-extrabold text-blue-700 leading-tight">FluxPense</span>
              <span className="text-xs text-muted-foreground mt-0.5">Welcome, {user?.email}</span>
            </div>
          </div>
          {/* Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-full hover:bg-blue-100 transition-colors focus:outline-none">
                <Bell className="w-6 h-6 text-blue-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
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
              <button className="ml-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors focus:outline-none flex items-center justify-center">
                <User className="w-6 h-6 text-blue-700" />
              </button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Profile
                </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout(navigate)} className="flex items-center gap-2 text-red-600">
                <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Top Balance Card */}
        <div className="mb-3">
          <div className="relative w-full min-h-[140px] rounded-2xl bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-white/80 shadow-2xl border border-blue-200/60 backdrop-blur-xl p-7 flex flex-col items-center justify-center overflow-hidden">
            {/* Decorative floating elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-300/30 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-0 right-0 w-32 h-16 bg-blue-100/40 rounded-full blur-xl animate-float-slow" />
            {/* Total Balance Label and Hide/Show */}
            <div className="w-full flex items-center justify-between mb-1 z-10">
              <span className="text-white/90 text-base font-semibold flex items-center gap-2 drop-shadow">Total Balance</span>
              <button onClick={() => setShowBalance(v => !v)} className="ml-2 px-3 py-1 rounded-full bg-white/30 hover:bg-white/50 text-blue-700 text-xs font-semibold shadow transition-all flex items-center gap-1 backdrop-blur border border-blue-200/40">
                {showBalance ? <span>Hide</span> : <span>Show</span>}
                <span className="inline-block w-4 h-4">
                  {showBalance ? (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.21 2.21A9.97 9.97 0 0021 12c0-5.523-4.477-10-10-10S1 6.477 1 12c0 1.657.403 3.22 1.125 4.575M4.22 19.78A9.97 9.97 0 0012 21c5.523 0 10-4.477 10-10 0-1.657-.403-3.22-1.125-4.575" /></svg>
                  )}
                </span>
              </button>
            </div>
            {/* Animated Balance */}
            <div className="w-full flex items-center justify-center">
          <motion.div
                key={showBalance ? 'balance' : 'hidden'}
                initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold text-white tracking-tight mb-0 drop-shadow-glow"
                style={{ textShadow: '0 0 16px #60a5fa, 0 2px 8px #fff' }}
          >
                {showBalance ? `$${totalBalance.toLocaleString()}` : '•••••••'}
              </motion.div>
            </div>
          </div>
            </div>
        {/* Overview Cards */}
        <div className="flex space-x-3 overflow-x-auto pb-1 mb-3 custom-scrollbar">
          {/* Total Expense Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="min-w-[140px] rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-blue-100/30 p-2 flex flex-col items-start relative overflow-hidden min-h-[72px]">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-100/10 rounded-full blur-2xl animate-float" />
            <span className="flex items-center gap-2 text-xs font-semibold text-blue-500/80 mb-1">
              <TrendingDown className="w-4 h-4 text-blue-300/80" /> Total Expense
            </span>
            <span className="text-xl font-extrabold text-blue-700/80 tracking-tight">${totalExpense.toLocaleString()}</span>
          </motion.div>
          {/* Total Salary Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="min-w-[140px] rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-green-100/30 p-2 flex flex-col items-start relative overflow-hidden min-h-[72px]">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-100/10 rounded-full blur-2xl animate-float" />
            <span className="flex items-center gap-2 text-xs font-semibold text-green-500/80 mb-1">
              <TrendingUp className="w-4 h-4 text-green-300/80" /> Total Salary
            </span>
            <span className="text-xl font-extrabold text-green-700/80 tracking-tight">${totalSalary.toLocaleString()}</span>
          </motion.div>
          {/* Monthly Expense Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="min-w-[140px] rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-red-100/30 p-2 flex flex-col items-start relative overflow-hidden min-h-[72px]">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-100/10 rounded-full blur-2xl animate-float" />
            <span className="flex items-center gap-2 text-xs font-semibold text-red-500/80 mb-1">
              <DollarSign className="w-4 h-4 text-red-300/80" /> Monthly Expense
            </span>
            <span className="text-xl font-extrabold text-red-700/80 tracking-tight">${monthlyExpense.toLocaleString()}</span>
          </motion.div>
        </div>
        {/* Analytics/Chart Section */}
        <div className="mb-3">
          <div className="relative rounded-2xl bg-white/60 backdrop-blur-xl shadow-2xl border border-blue-200/40 p-4 overflow-hidden flex flex-col items-stretch animate-fade-in-up">
            {/* Decorative floating elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-0 right-0 w-32 h-16 bg-blue-100/30 rounded-full blur-xl animate-float-slow" />
            <div className="flex items-center justify-between mb-2 z-10">
              <span className="font-semibold text-blue-700 tracking-tight text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Analytics
              </span>
              <span className="text-xs text-muted-foreground font-semibold">2022</span>
            </div>
            {/* Animated Chart Bars */}
            <div className="h-24 flex items-end gap-3 z-10">
              <motion.div initial={{ height: 0 }} animate={{ height: 32 }} transition={{ duration: 0.7, delay: 0.1 }} className="w-7 rounded-lg bg-gradient-to-t from-blue-200 to-blue-400 shadow-md" />
              <motion.div initial={{ height: 0 }} animate={{ height: 56 }} transition={{ duration: 0.7, delay: 0.2 }} className="w-7 rounded-lg bg-gradient-to-t from-blue-300 to-blue-600 shadow-lg" />
              <motion.div initial={{ height: 0 }} animate={{ height: 24 }} transition={{ duration: 0.7, delay: 0.3 }} className="w-7 rounded-lg bg-gradient-to-t from-blue-200 to-blue-400 shadow-md" />
              <motion.div initial={{ height: 0 }} animate={{ height: 64 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-7 rounded-lg bg-gradient-to-t from-blue-400 to-blue-700 shadow-xl" />
              <motion.div initial={{ height: 0 }} animate={{ height: 40 }} transition={{ duration: 0.7, delay: 0.5 }} className="w-7 rounded-lg bg-gradient-to-t from-blue-200 to-blue-500 shadow-lg" />
            </div>
            {/* Summary Stats Row */}
            <div className="flex justify-between items-center mt-3 px-1 z-10">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Spent</span>
                <span className="font-bold text-blue-600 text-sm">${monthlyExpense.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Saved</span>
                <span className="font-bold text-green-600 text-sm">${(totalSalary - totalExpense).toLocaleString()}</span>
          </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Budget</span>
                <span className="font-bold text-yellow-600 text-sm">$2,000</span>
              </div>
            </div>
          </div>
        </div>
        {/* Latest Entries */}
        <div className="mb-3">
          <div className="font-semibold text-foreground mb-1">Latest Entries</div>
          <div className="space-y-2">
            {loading ? (
              <div className="text-center text-muted-foreground py-4">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No expenses yet. Add your first one!</div>
            ) : (
              expenses.map((expense) => (
              <button
                key={expense.id}
                className="flex items-center justify-between p-4 bg-white/90 backdrop-blur rounded-xl shadow hover:bg-blue-50 transition-colors w-full text-left focus:outline-none"
                onClick={() => setSelectedTransaction({
                  id: expense.id,
                  amount: expense.amount,
                  category: expense.category,
                  description: expense.description,
                  date: expense.date,
                  type: expense.type,
                  method: 'Credit Card',
                  location: 'N/A',
                  tags: [],
                  receipt: typeof expense.receipt === 'boolean' ? expense.receipt : !!expense.receipt
                })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${expense.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className="text-lg">{expense.category.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{expense.description}</div>
                    <div className="text-xs text-muted-foreground">{expense.category.replace(/^[^ ]+ /, '')} • {new Date(expense.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString()}</div>
                </div>
              </button>
              ))
            )}
            </div>
        </div>
        {/* Transaction Details Modal: glassy, full-screen, compact */}
        {selectedTransaction && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md mx-auto bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up min-h-[95vh] p-0">
              {/* Close button */}
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-blue-600 text-2xl font-bold z-10" onClick={() => setSelectedTransaction(null)} aria-label="Close">&times;</button>
              <div className="flex flex-col items-center justify-center p-8 w-full h-full text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${selectedTransaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {selectedTransaction.type === 'income' ? <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> : <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5v-2h14v2z" /></svg>}
                </div>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">{selectedTransaction.category}</h2>
                <div className="text-base text-muted-foreground mb-3">{selectedTransaction.description}</div>
                <div className="flex items-center gap-3 mb-3 justify-center">
                  <span className={`font-bold text-3xl ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}</span>
                  {selectedTransaction.method && <Badge variant="secondary" className="text-sm">{selectedTransaction.method}</Badge>}
                </div>
                <div className="flex gap-2 mb-3 justify-center flex-wrap">
                  {selectedTransaction.location && <Badge variant="secondary" className="text-sm">{selectedTransaction.location}</Badge>}
                  {selectedTransaction.tags && selectedTransaction.tags.map(tag => <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>)}
              </div>
                <div className="flex gap-2 mb-3 justify-center">
                  <span className="text-sm text-muted-foreground">{selectedTransaction.date ? new Date(selectedTransaction.date).toLocaleDateString() : ''}</span>
              </div>
                {selectedTransaction.receipt && <div className="flex items-center gap-2 mb-3 justify-center"><svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-sm text-blue-600">Receipt attached</span></div>}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4, type: 'spring' }}
        className="z-50"
      >
        <BottomNavigation onQuickAdd={() => {}} />
      </motion.div>
    </div>
  );
};

export default Dashboard;