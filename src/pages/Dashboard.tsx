
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import ExpenseEntryModal from '@/components/ExpenseEntryModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  merchant_name: string;
}

interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  weeklyExpenses: number;
  expenseCount: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    monthlyExpenses: 0,
    weeklyExpenses: 0,
    expenseCount: 0
  });
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchNotifications();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch expenses
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select(`
          id,
          amount,
          description,
          date,
          merchant_name,
          categories (name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      const expenseData = expenses || [];
      
      // Calculate stats
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalExpenses = expenseData.reduce((sum, exp) => sum + exp.amount, 0);
      const monthlyExpenses = expenseData
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      const weeklyExpenses = expenseData
        .filter(exp => new Date(exp.date) >= oneWeekAgo)
        .reduce((sum, exp) => sum + exp.amount, 0);

      setStats({
        totalExpenses,
        monthlyExpenses,
        weeklyExpenses,
        expenseCount: expenseData.length
      });

      // Format expenses for display
      const formattedExpenses: Expense[] = expenseData.map(exp => ({
        id: exp.id,
        amount: exp.amount,
        description: exp.description,
        category: exp.categories?.name || 'Other',
        date: exp.date,
        merchant_name: exp.merchant_name || ''
      }));

      setRecentExpenses(formattedExpenses);
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleQuickAdd = () => {
    setIsModalOpen(true);
  };

  const handleExpenseAdded = () => {
    fetchDashboardData();
    fetchNotifications();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface pb-20 flex flex-col">
      {/* Header */}
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between w-full bg-white/70 backdrop-blur shadow-lg px-3 py-2 mb-2 max-w-md mx-auto rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
              <img src={fluxpenseLogo} alt="FluxPense" className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base font-extrabold text-blue-700 leading-tight">FluxPense</span>
              <span className="text-xs text-muted-foreground mt-0.5">Welcome back, {user?.name}</span>
            </div>
          </div>
          
          {/* User Profile & Notifications */}
          <div className="flex items-center gap-2">
            {/* Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-1.5 rounded-full hover:bg-blue-100 transition-colors focus:outline-none">
                  <Bell className="w-5 h-5 text-blue-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[10px] text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
                <div className="p-2 border-b">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 3).map((notif) => (
                      <DropdownMenuItem key={notif.id} className="flex items-start space-x-2 p-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium">{notif.title}</p>
                          <p className="text-[11px] text-muted-foreground">{notif.message}</p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white font-bold shadow-lg focus:outline-none">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
                <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout((path) => window.location.href = path)}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 pb-8 px-2 pt-2 max-w-md mx-auto w-full">
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">This Month</p>
                  <p className="text-lg font-bold text-foreground">
                    ${stats.monthlyExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">This Week</p>
                  <p className="text-lg font-bold text-foreground">
                    ${stats.weeklyExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-lg font-bold text-foreground">
                    ${stats.totalExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                  <p className="text-lg font-bold text-foreground">
                    {stats.expenseCount}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Expenses</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/expenses'}
                  className="text-xs"
                >
                  View All
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {recentExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wallet className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">No expenses yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Start tracking your expenses to see them here</p>
                  <Button onClick={handleQuickAdd} size="sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add First Expense
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                          <p className="text-xs text-gray-500">
                            {expense.merchant_name || expense.category} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">-${expense.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Expense Entry Modal */}
      <ExpenseEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4, type: 'spring' }}
        className="z-50"
      >
        <BottomNavigation onQuickAdd={handleQuickAdd} />
      </motion.div>
    </div>
  );
};

export default Dashboard;
