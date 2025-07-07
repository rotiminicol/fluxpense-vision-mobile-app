
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category_name?: string;
  date: string;
  merchant_name?: string;
  payment_method?: string;
}

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    const filtered = transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.merchant_name && transaction.merchant_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.category_name && transaction.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm]);

  const fetchTransactions = async () => {
    try {
      const { data: expensesData, error } = await supabase
        .from('expenses')
        .select(`
          id,
          amount,
          description,
          date,
          merchant_name,
          payment_method,
          categories (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedTransactions = (expensesData || []).map(expense => ({
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        merchant_name: expense.merchant_name,
        payment_method: expense.payment_method,
        category_name: expense.categories?.name
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getCategoryColor = (categoryName?: string) => {
    const colors: { [key: string]: string } = {
      'Food & Dining': '#ef4444',
      'Transportation': '#3b82f6',
      'Shopping': '#8b5cf6',
      'Entertainment': '#f59e0b',
      'Healthcare': '#10b981',
      'Bills & Utilities': '#ef4444',
      'Travel': '#06b6d4',
      'Education': '#8b5cf6',
      'Other': '#6b7280'
    };
    return colors[categoryName || 'Other'] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
              <span className="text-base font-extrabold text-blue-700 leading-tight">Transactions</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {transactions.length} total
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="bg-white/80">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80">
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 pb-4 px-4 pt-2 max-w-md mx-auto w-full">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur"
          />
        </div>

        {transactions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <Receipt className="w-16 h-16 text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-700 mb-2">No Transactions</h3>
            <p className="text-muted-foreground mb-4 px-4">
              Your transaction history will appear here once you start adding expenses.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Add Your First Expense
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: getCategoryColor(transaction.category_name) }}
                        >
                          {transaction.category_name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-blue-700 truncate">
                            {transaction.description}
                          </h4>
                          {transaction.merchant_name && (
                            <p className="text-xs text-muted-foreground truncate">
                              {transaction.merchant_name}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(transaction.date)}
                            </span>
                            {transaction.category_name && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {transaction.category_name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-red-600">
                          -${transaction.amount.toFixed(2)}
                        </p>
                        {transaction.payment_method && (
                          <p className="text-xs text-muted-foreground">
                            {transaction.payment_method}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {filteredTransactions.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                <h4 className="font-semibold text-blue-700 mb-1">No Results Found</h4>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavigation onQuickAdd={() => {}} />
    </div>
  );
};

export default TransactionsPage;
