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
    <div className="min-h-screen bg-gradient-surface pb-20">
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

      <div className="p-6 space-y-6">
        {/* Search and Filter */}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-xl font-bold text-expense">${totalExpenses.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-expense/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-expense" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-xl font-bold text-income">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-income/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-income" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5" />
              <span>Transaction History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-hover transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-income/10' : 'bg-expense/10'
                    }`}>
                      <span className="text-lg">
                        {transaction.category.split(' ')[0]}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-foreground truncate">{transaction.description}</p>
                        {transaction.receipt && (
                          <Receipt className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{transaction.category.replace(/^\S+\s/, '')}</span>
                        <span>•</span>
                        <span>{transaction.method}</span>
                        <span>•</span>
                        <span>{transaction.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(transaction.date)} at {formatTime(transaction.date)}
                        </span>
                        {transaction.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-income' : 'text-expense'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Transaction
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No transactions found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsPage;