import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Eye
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

const TransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const transactions = [
    {
      id: '1',
      amount: 45.99,
      category: '🍔 Food & Dining',
      description: 'Lunch at Cafe Plaza',
      date: '2024-01-15T12:30:00',
      type: 'expense' as const,
      method: 'Credit Card',
      receipt: true,
      location: 'Downtown',
      tags: ['business', 'lunch']
    },
    {
      id: '2',
      amount: 120.00,
      category: '⛽ Transportation',
      description: 'Gas Station Fill-up',
      date: '2024-01-14T08:15:00',
      type: 'expense' as const,
      method: 'Debit Card',
      receipt: false,
      location: 'Highway 101',
      tags: ['commute']
    },
    {
      id: '3',
      amount: 2500.00,
      category: '💰 Income',
      description: 'Salary Payment',
      date: '2024-01-01T09:00:00',
      type: 'income' as const,
      method: 'Bank Transfer',
      receipt: false,
      location: 'Direct Deposit',
      tags: ['salary', 'monthly']
    },
    {
      id: '4',
      amount: 89.50,
      category: '🛒 Shopping',
      description: 'Grocery Store - Weekly Shopping',
      date: '2024-01-13T16:45:00',
      type: 'expense' as const,
      method: 'Credit Card',
      receipt: true,
      location: 'Whole Foods Market',
      tags: ['groceries', 'weekly']
    },
    {
      id: '5',
      amount: 25.00,
      category: '☕ Coffee',
      description: 'Starbucks Coffee & Pastry',
      date: '2024-01-12T07:30:00',
      type: 'expense' as const,
      method: 'Mobile Pay',
      receipt: true,
      location: 'Main Street',
      tags: ['coffee', 'morning']
    },
    {
      id: '6',
      amount: 150.00,
      category: '🎬 Entertainment',
      description: 'Movie Theater & Dinner',
      date: '2024-01-11T19:00:00',
      type: 'expense' as const,
      method: 'Credit Card',
      receipt: true,
      location: 'Cinema Complex',
      tags: ['entertainment', 'date']
    }
  ];

  const filters = [
    { id: 'all', label: 'All Transactions' },
    { id: 'expense', label: 'Expenses' },
    { id: 'income', label: 'Income' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'expense' || selectedFilter === 'income') {
      return matchesSearch && transaction.type === selectedFilter;
    }
    // Add date filtering logic here
    return matchesSearch;
  });

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = transactions
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
      <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="w-8 h-8 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">All Transactions</h1>
              <p className="text-sm text-muted-foreground">{filteredTransactions.length} transactions</p>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Animated Search and Filter Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex space-x-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className="whitespace-nowrap"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Timeline Layout */}
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 to-secondary/10 rounded-full" />
          {filteredTransactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              className="relative mb-8 group"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.07, duration: 0.5, type: 'spring' }}
            >
              {/* Timeline dot/icon */}
              <div className={`absolute -left-6 top-4 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${transaction.type === 'income' ? 'bg-success/20' : 'bg-expense/20'}`}>
                <motion.span
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 + idx * 0.07 }}
                >
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-expense" />
                  )}
                </motion.span>
              </div>
              {/* Transaction Card */}
              <div className="ml-4 p-4 bg-surface rounded-xl shadow transition-colors group-hover:bg-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">{transaction.category} • {formatDate(transaction.date)} {formatTime(transaction.date)}</div>
                  </div>
                  <div className={`font-bold text-lg ${transaction.type === 'income' ? 'text-success' : 'text-expense'}`}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}</div>
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary">{transaction.method}</Badge>
                  {transaction.receipt && <Receipt className="w-4 h-4 text-primary" />}
                  {transaction.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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