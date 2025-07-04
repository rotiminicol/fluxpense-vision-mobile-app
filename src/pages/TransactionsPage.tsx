import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Calendar,
  MoreHorizontal,
  Receipt,
  TrendingDown,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { format, isToday, isThisWeek, isThisMonth, isSameDay, parseISO } from 'date-fns';
import { Calendar as GlassyCalendar } from '@/components/ui/calendar';

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [openTransaction, setOpenTransaction] = useState<null | any>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select(`
          *,
          categories(name, icon)
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedTransactions = expenses?.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        category: `${expense.categories?.icon || '💰'} ${expense.categories?.name || 'Uncategorized'}`,
        description: expense.description,
        date: expense.date + 'T12:00:00',
        type: 'expense' as const,
        method: expense.payment_method || 'Unknown',
        receipt: !!expense.receipt_url,
        location: expense.location || 'Unknown',
        tags: expense.tags || []
      })) || [];

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use only real transactions, no mock data
  const displayTransactions = transactions;

  const filters = [
    { id: 'all', label: 'All Transactions' },
    { id: 'expense', label: 'Expenses' },
    { id: 'income', label: 'Income' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  const filteredTransactions = displayTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    const txDate = new Date(transaction.date);
    if (selectedFilter === 'expense') matchesFilter = transaction.type === 'expense';
    else if (selectedFilter === 'income') matchesFilter = transaction.type === 'income';
    else if (selectedFilter === 'today') matchesFilter = isToday(txDate);
    else if (selectedFilter === 'week') matchesFilter = isThisWeek(txDate, { weekStartsOn: 1 });
    else if (selectedFilter === 'month') matchesFilter = isThisMonth(txDate);
    if (calendarDate) matchesFilter = isSameDay(txDate, calendarDate);
    return matchesSearch && matchesFilter;
  });

  const totalExpenses = displayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = displayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface pb-20 flex flex-col">
      {/* Header */}
      {/* Only show header if no transaction is open */}
      {!openTransaction && (
        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between w-full bg-white/70 backdrop-blur shadow-lg px-3 py-2 mb-2 max-w-md mx-auto rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
                <img src={fluxpenseLogo} alt="FluxPense" className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-base font-extrabold text-blue-700 leading-tight">All Transactions</span>
                <span className="text-xs text-muted-foreground mt-0.5">{loading ? 'Loading...' : `${filteredTransactions.length} transactions`}</span>
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
      )}
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Animated Search and Filter Bar */}
        <motion.div className="mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-2 animate-fade-in-up">
            <CardContent className="p-0">
              <div className="flex space-x-2 mb-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search transactions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-9 text-sm" />
                </div>
                <Button variant="outline" size="sm" className="h-9" onClick={() => setCalendarOpen(true)}><Calendar className="w-4 h-4" /></Button>
              </div>
              <div className="flex space-x-1 overflow-x-auto pb-1">
                {filters.map((filter) => (
                  <Button key={filter.id} variant={selectedFilter === filter.id ? "default" : "outline"} size="sm" className="h-8 text-xs px-3" onClick={() => setSelectedFilter(filter.id)}>{filter.label}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Glassy summary bar */}
        <div className="flex gap-2 mb-2 max-w-md mx-auto px-1">
          <div className="flex-1 bg-white/80 backdrop-blur rounded-xl shadow p-2 flex flex-col items-center">
            <span className="text-[11px] text-muted-foreground">Expenses</span>
            <span className="font-bold text-base text-red-500">-${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex-1 bg-white/80 backdrop-blur rounded-xl shadow p-2 flex flex-col items-center">
            <span className="text-[11px] text-muted-foreground">Income</span>
            <span className="font-bold text-base text-green-600">+${totalIncome.toLocaleString()}</span>
          </div>
          <div className="flex-1 bg-white/80 backdrop-blur rounded-xl shadow p-2 flex flex-col items-center">
            <span className="text-[11px] text-muted-foreground">Net</span>
            <span className="font-bold text-base text-blue-700">${(totalIncome-totalExpenses).toLocaleString()}</span>
          </div>
        </div>
        {/* Transaction list */}
        {/* Transaction list: stretch cards, add padding, more spacing */}
        <div className="flex flex-col gap-3 mb-2">
          {loading ? (
            <div className="text-center text-muted-foreground py-8 text-sm">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              {displayTransactions.length === 0 ? "No transactions yet. Add your first expense!" : "No transactions match your filters."}
            </div>
          ) : (
            filteredTransactions.map(transaction => (
            <motion.div key={transaction.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <button className="w-full text-left" onClick={() => setOpenTransaction(transaction)}>
                <Card className="bg-white/80 backdrop-blur rounded-2xl shadow p-4 flex items-center gap-4 w-full hover:bg-blue-50/60 transition-all">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'}`}>{transaction.type === 'expense' ? <TrendingDown className="w-6 h-6 text-red-500" /> : <TrendingUp className="w-6 h-6 text-green-600" />}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base truncate">{transaction.category}</span>
                      {transaction.receipt && <Receipt className="w-4 h-4 text-blue-400 ml-1" />}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{transaction.description}</div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{transaction.method}</Badge>
                      <Badge variant="secondary" className="text-xs">{transaction.location}</Badge>
                      {transaction.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end min-w-[80px]">
                    <span className={`font-bold text-base ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>{transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(transaction.date)}</span>
                  </div>
                </Card>
              </button>
            </motion.div>
            ))
          )}
        </div>
        {/* Full-screen glassy overlay for transaction details */}
        {/* Full-screen glassy overlay for transaction details: center content, fill space */}
        {openTransaction && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md mx-auto bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up min-h-[95vh] p-0">
              {/* Close button */}
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-blue-600 text-2xl font-bold z-10" onClick={() => setOpenTransaction(null)} aria-label="Close">&times;</button>
              <div className="flex flex-col items-center justify-center p-8 w-full h-full text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${openTransaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'}`}>{openTransaction.type === 'expense' ? <TrendingDown className="w-10 h-10 text-red-500" /> : <TrendingUp className="w-10 h-10 text-green-600" />}</div>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">{openTransaction.category}</h2>
                <div className="text-base text-muted-foreground mb-3">{openTransaction.description}</div>
                <div className="flex items-center gap-3 mb-3 justify-center">
                  <span className={`font-bold text-3xl ${openTransaction.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>{openTransaction.type === 'expense' ? '-' : '+'}${openTransaction.amount.toLocaleString()}</span>
                  <Badge variant="secondary" className="text-sm">{openTransaction.method}</Badge>
                </div>
                <div className="flex gap-2 mb-3 justify-center flex-wrap">
                  <Badge variant="secondary" className="text-sm">{openTransaction.location}</Badge>
                  {openTransaction.tags.map(tag => <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>)}
                </div>
                <div className="flex gap-2 mb-3 justify-center">
                  <span className="text-sm text-muted-foreground">{formatDate(openTransaction.date)}</span>
                  <span className="text-sm text-muted-foreground">{formatTime(openTransaction.date)}</span>
                </div>
                {openTransaction.receipt && <div className="flex items-center gap-2 mb-3 justify-center"><Receipt className="w-6 h-6 text-blue-400" /><span className="text-sm text-blue-600">Receipt attached</span></div>}
                <div className="flex gap-3 mt-6 justify-center">
                  <Button variant="outline" size="sm"><Edit className="w-5 h-5 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200"><Trash2 className="w-5 h-5 mr-1" />Delete</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Calendar Date Picker Overlay */}
        {calendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-xs mx-auto bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up p-4">
              <button className="absolute top-3 right-3 text-muted-foreground hover:text-blue-600 text-2xl font-bold z-10" onClick={() => setCalendarOpen(false)} aria-label="Close">&times;</button>
              <h2 className="text-lg font-bold text-blue-700 mb-2">Select Date</h2>
              <GlassyCalendar
                mode="single"
                selected={calendarDate || undefined}
                onSelect={date => setCalendarDate(date || null)}
                className="rounded-xl shadow bg-white/90"
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => { setCalendarDate(null); setCalendarOpen(false); }}>Clear</Button>
                <Button variant="default" size="sm" onClick={() => setCalendarOpen(false)}>Apply</Button>
              </div>
            </div>
          </div>
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

export default TransactionsPage;