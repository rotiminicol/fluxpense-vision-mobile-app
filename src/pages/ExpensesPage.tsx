import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Calendar,
  MoreHorizontal,
  Receipt,
  ArrowUpDown,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';

const ExpensesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const expenses = [
    {
      id: '1',
      amount: 45.99,
      category: '🍔 Food & Dining',
      description: 'Lunch at Cafe Plaza',
      date: '2024-01-15',
      type: 'expense' as const,
      receipt: true
    },
    {
      id: '2',
      amount: 120.00,
      category: '⛽ Transportation',
      description: 'Gas Station Fill-up',
      date: '2024-01-14',
      type: 'expense' as const,
      receipt: false
    },
    {
      id: '3',
      amount: 2500.00,
      category: '💰 Income',
      description: 'Salary Payment',
      date: '2024-01-01',
      type: 'income' as const,
      receipt: false
    },
    {
      id: '4',
      amount: 89.50,
      category: '🛒 Shopping',
      description: 'Grocery Store',
      date: '2024-01-13',
      type: 'expense' as const,
      receipt: true
    },
    {
      id: '5',
      amount: 25.00,
      category: '☕ Coffee',
      description: 'Starbucks Coffee',
      date: '2024-01-12',
      type: 'expense' as const,
      receipt: true
    }
  ];

  const categories = [...new Set(expenses.map(e => e.category))];

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
              <h1 className="text-xl font-bold text-foreground">All Expenses</h1>
              <p className="text-sm text-muted-foreground">{expenses.length} transactions</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search and Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold text-expense">$255.49</p>
                </div>
                <div className="w-10 h-10 bg-expense/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-expense" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Income</p>
                  <p className="text-xl font-bold text-income">$2,500.00</p>
                </div>
                <div className="w-10 h-10 bg-income/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-income" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="px-3 py-1">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-hover transition-colors animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      expense.type === 'income' ? 'bg-income/10' : 'bg-expense/10'
                    }`}>
                      <span className="text-lg">
                        {expense.category.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-foreground">{expense.description}</p>
                        {expense.receipt && (
                          <Receipt className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {expense.category.replace(/^\S+\s/, '')} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <p className={`font-bold text-lg ${
                        expense.type === 'income' ? 'text-income' : 'text-expense'
                      }`}>
                        {expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesPage;