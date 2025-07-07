
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  Download,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [reportData, setReportData] = useState({
    totalExpenses: 0,
    monthlyAverage: 0,
    topCategory: '',
    monthlyTrend: [],
    categoryBreakdown: []
  });

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user]);

  const fetchReportData = async () => {
    try {
      // Fetch expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id);

      setExpenses(expensesData || []);
      setCategories(categoriesData || []);
      setHasData((expensesData?.length || 0) > 0);

      if (expensesData && expensesData.length > 0) {
        generateReportData(expensesData, categoriesData || []);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = (expensesData: any[], categoriesData: any[]) => {
    const totalExpenses = expensesData.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Monthly trend data
    const monthlyData = expensesData.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});

    const monthlyTrend = Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: Number(amount)
    })).slice(-6);

    // Category breakdown
    const categoryData = expensesData.reduce((acc, exp) => {
      const category = categoriesData.find(cat => cat.id === exp.category_id);
      const categoryName = category?.name || 'Other';
      acc[categoryName] = (acc[categoryName] || 0) + exp.amount;
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryData).map(([name, amount]) => ({
      name,
      amount: Number(amount),
      color: categoriesData.find(cat => cat.name === name)?.color || '#8b5cf6'
    })).sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown[0]?.name || '';
    const monthlyAverage = totalExpenses / Math.max(monthlyTrend.length, 1);

    setReportData({
      totalExpenses,
      monthlyAverage,
      topCategory,
      monthlyTrend,
      categoryBreakdown
    });
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
              <span className="text-base font-extrabold text-blue-700 leading-tight">Reports</span>
              <span className="text-xs text-muted-foreground mt-0.5">Financial insights</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="bg-white/80">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 pb-4 px-4 pt-2 max-w-md mx-auto w-full">
        {!hasData ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <BarChart3 className="w-16 h-16 text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-700 mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4 px-4">
              Start adding expenses to see your financial insights and reports here.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Add Your First Expense
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="text-lg font-bold text-blue-700">${reportData.totalExpenses.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Avg</p>
                      <p className="text-lg font-bold text-green-600">${reportData.monthlyAverage.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend Chart */}
            <Card className="bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Monthly Spending Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={reportData.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {reportData.categoryBreakdown.slice(0, 5).map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs font-bold">${category.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Category */}
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Top Spending Category</p>
                  <p className="text-lg font-bold text-blue-700">{reportData.topCategory}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <BottomNavigation onQuickAdd={() => {}} />
    </div>
  );
};

export default ReportsPage;
