import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Filter, 
  Calendar,
  MoreHorizontal,
  Receipt,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  Plus,
  Bell
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar as GlassyCalendar } from '@/components/ui/calendar';

// Define the Expense type
interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
  receipt?: boolean;
}

const ExpensesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const { data: expenseData, error } = await supabase
        .from('expenses')
        .select(`
          *,
          categories(name, icon)
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedExpenses: Expense[] = expenseData?.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        category: `${expense.categories?.icon || '💰'} ${expense.categories?.name || 'Uncategorized'}`,
        description: expense.description,
        date: expense.date,
        type: 'expense' as const,
        receipt: !!expense.receipt_url
      })) || [];

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use only real expenses, no mock data
  const displayExpenses = expenses;

  const categories = [...new Set(displayExpenses.map(e => e.category))];

  const filteredExpenses = displayExpenses.filter(e => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || e.type === filterType;
    const matchesDate = !filterDate || new Date(e.date).toDateString() === filterDate.toDateString();
    const matchesCategory = !filterCategory || e.category === filterCategory;
    return matchesSearch && matchesType && matchesDate && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-surface pb-20 flex flex-col">
      {/* Header: reduce padding, align items */}
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between w-full bg-white/70 backdrop-blur shadow-lg px-3 py-2 mb-2 max-w-md mx-auto rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
              <img src={fluxpenseLogo} alt="FluxPense" className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base font-extrabold text-blue-700 leading-tight">All Expenses</span>
              <span className="text-xs text-muted-foreground mt-0.5">{loading ? 'Loading...' : `${displayExpenses.length} expenses`}</span>
            </div>
          </div>
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1.5 rounded-full hover:bg-blue-100 transition-colors focus:outline-none">
                <Bell className="w-5 h-5 text-blue-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
              <div className="p-2 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <div className="text-center text-muted-foreground py-4 text-sm">
                  No notifications yet
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-20 px-2 pt-2 max-w-md mx-auto w-full">
        {/* Filters Row: compact, aligned */}
        <motion.div
          className="flex space-x-2 mb-3 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm rounded-lg"
            />
          </div>
          <Select value={filterType} onValueChange={v => setFilterType(v as 'all' | 'expense' | 'income')}>
            <SelectTrigger className="w-24 h-9 text-sm rounded-lg">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={showCalendar ? 'secondary' : 'outline'} size="sm" className="h-9 px-2" onClick={() => setShowCalendar(v => !v)}>
            <Calendar className="w-4 h-4" />
          </Button>
          {showCalendar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-xs mx-auto bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up p-4">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-blue-600 text-2xl font-bold z-10" onClick={() => setShowCalendar(false)} aria-label="Close">&times;</button>
                <h2 className="text-lg font-bold text-blue-700 mb-2">Select Date</h2>
                <GlassyCalendar
                  mode="single"
                  selected={filterDate || undefined}
                  onSelect={date => { setFilterDate(date); setShowCalendar(false); }}
                  className="rounded-xl shadow bg-white/90"
                />
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => { setFilterDate(null); setShowCalendar(false); }}>Clear</Button>
                  <Button variant="default" size="sm" onClick={() => setShowCalendar(false)}>Apply</Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        {/* Quick Stats: compact, aligned */}
        <motion.div
          className="grid grid-cols-2 gap-2 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 flex items-center h-20">
            <CardContent className="p-0 w-full">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">This Month</p>
                  <p className="text-lg font-bold text-expense leading-tight">${displayExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-expense/10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-expense" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 flex items-center h-20">
            <CardContent className="p-0 w-full">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Income</p>
                  <p className="text-lg font-bold text-income leading-tight">${displayExpenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-income/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-income" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Categories: compact badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-1">
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filterCategory === category ? 'default' : 'secondary'}
                    className={`px-2 py-0.5 text-xs cursor-pointer ${filterCategory === category ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => setFilterCategory(filterCategory === category ? '' : category)}
                  >
                    {category}
                  </Badge>
                ))}
                {filterCategory && (
                  <Button size="sm" variant="ghost" className="ml-1 px-2 py-0.5 text-xs" onClick={() => setFilterCategory('')}>Clear</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Expense List: compact, aligned */}
        <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mt-3">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center text-muted-foreground py-6 text-sm">Loading expenses...</div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center text-muted-foreground py-6 text-sm">
                  {displayExpenses.length === 0 ? "No expenses yet. Add your first one!" : "No expenses match your filters."}
                </div>
              ) : null}
              {filteredExpenses.map((expense) => (
                <button
                  key={expense.id}
                  className="w-full text-left flex items-center justify-between p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:bg-blue-50 transition-colors focus:outline-none"
                  onClick={() => setSelectedTransaction(expense)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${expense.type === 'income' ? 'bg-income/10' : 'bg-expense/10'}`}>
                      <span className="text-base">{expense.category.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <p className="font-semibold text-foreground text-sm truncate">{expense.description}</p>
                        {expense.receipt && (
                          <Receipt className="w-3 h-3 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {expense.category.replace(/^[^ ]+ /, '')} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <div>
                      <p className={`font-bold text-base ${expense.type === 'income' ? 'text-income' : 'text-expense'}`}>{expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString()}</p>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Transaction Details Modal: compact */}
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden bg-white/95 backdrop-blur shadow-2xl border-0">
            <DialogHeader className="p-4 pb-1">
              <DialogTitle className="text-lg font-bold text-blue-700">Transaction Details</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Full details of the selected transaction</DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="px-4 pb-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedTransaction.type === 'income' ? 'bg-income/10' : 'bg-expense/10'}`}>
                    <span className="text-xl">{selectedTransaction.category.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-foreground">{selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{selectedTransaction.category.replace(/^[^ ]+ /, '')}</div>
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-semibold mb-0.5 text-muted-foreground">Description</span>
                  <span className="block text-sm text-foreground">{selectedTransaction.description}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold mb-0.5 text-muted-foreground">Date</span>
                  <span className="block text-sm text-foreground">{new Date(selectedTransaction.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold mb-0.5 text-muted-foreground">Type</span>
                  <span className="block text-sm text-foreground capitalize">{selectedTransaction.type}</span>
                </div>
                {selectedTransaction.receipt && (
                  <div>
                    <span className="block text-xs font-semibold mb-0.5 text-muted-foreground">Receipt</span>
                    <span className="block text-sm text-primary">Available</span>
                  </div>
                )}
              </div>
            )}
            <DialogClose asChild>
              <button className="absolute top-3 right-3 text-muted-foreground hover:text-blue-600 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </main>
      {/* Bottom Navigation */}
      <BottomNavigation onQuickAdd={() => {}} />
    </div>
  );
};

export default ExpensesPage;