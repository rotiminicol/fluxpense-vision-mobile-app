import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3,
  Calendar,
  Download,
  Share,
  Target,
  DollarSign,
  Plus,
  Bell
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  
  const periods = [
    { id: 'thisWeek', label: 'This Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'last3Months', label: 'Last 3 Months' },
    { id: 'thisYear', label: 'This Year' }
  ];

  // Add mock data for each period
  const periodData = {
    thisWeek: {
      monthlyTrends: [
        { month: 'This Week', income: 600, expenses: 300 },
      ],
      categoryBreakdown: [
        { category: '🍔 Food & Dining', amount: 80, percentage: 40, color: 'bg-red-500' },
        { category: '⛽ Transportation', amount: 60, percentage: 30, color: 'bg-blue-500' },
        { category: '🛒 Shopping', amount: 40, percentage: 20, color: 'bg-green-500' },
        { category: '☕ Coffee', amount: 20, percentage: 10, color: 'bg-yellow-500' },
      ],
      budget: { total: 700, spent: 400, remaining: 300, percent: 57, days: 3 },
      insights: [
        { title: 'Great Start!', desc: 'You are on track this week.', color: 'from-success/10 to-primary/10', icon: '🎉' },
        { title: 'Watch Transport', desc: 'Transport spending is up 10%.', color: 'from-warning/10 to-destructive/10', icon: '🚗' },
        { title: 'Tip', desc: 'Plan your meals to save more.', color: 'from-primary/10 to-secondary/10', icon: '🍽️' },
      ],
    },
    thisMonth: {
      monthlyTrends: [
        { month: 'Oct', income: 2500, expenses: 1200 },
        { month: 'Nov', income: 2500, expenses: 1450 },
        { month: 'Dec', income: 2500, expenses: 1100 },
        { month: 'Jan', income: 2500, expenses: 1350 },
      ],
      categoryBreakdown: [
        { category: '🍔 Food & Dining', amount: 345.50, percentage: 45, color: 'bg-red-500' },
        { category: '⛽ Transportation', amount: 220.00, percentage: 29, color: 'bg-blue-500' },
        { category: '🛒 Shopping', amount: 150.75, percentage: 20, color: 'bg-green-500' },
        { category: '☕ Coffee', amount: 45.25, percentage: 6, color: 'bg-yellow-500' },
      ],
      budget: { total: 3000, spent: 1350, remaining: 1650, percent: 45, days: 15 },
      insights: [
        { title: '🎉 Great Progress!', desc: 'You\'re saving 15% more than last month', color: 'from-success/10 to-primary/10' },
        { title: '📈 Spending Alert', desc: 'Food expenses increased by 25% this month', color: 'from-warning/10 to-destructive/10' },
        { title: '🎯 Budget Tip', desc: 'Set a $300 limit for dining out to stay on track', color: 'from-primary/10 to-secondary/10' },
      ],
    },
    last3Months: {
      monthlyTrends: [
        { month: 'Nov', income: 2500, expenses: 1450 },
        { month: 'Dec', income: 2500, expenses: 1100 },
        { month: 'Jan', income: 2500, expenses: 1350 },
      ],
      categoryBreakdown: [
        { category: '🍔 Food & Dining', amount: 900, percentage: 38, color: 'bg-red-500' },
        { category: '⛽ Transportation', amount: 600, percentage: 25, color: 'bg-blue-500' },
        { category: '🛒 Shopping', amount: 500, percentage: 21, color: 'bg-green-500' },
        { category: '☕ Coffee', amount: 200, percentage: 16, color: 'bg-yellow-500' },
      ],
      budget: { total: 9000, spent: 3900, remaining: 5100, percent: 43, days: 45 },
      insights: [
        { title: '📉 Good Savings', desc: 'You saved $500 more than last quarter', color: 'from-success/10 to-primary/10' },
        { title: '🛒 Shopping Alert', desc: 'Shopping up 10% over 3 months', color: 'from-warning/10 to-destructive/10' },
        { title: '💡 Tip', desc: 'Review subscriptions for savings', color: 'from-primary/10 to-secondary/10' },
      ],
    },
    thisYear: {
      monthlyTrends: [
        { month: 'Feb', income: 2500, expenses: 1200 },
        { month: 'Mar', income: 2500, expenses: 1450 },
        { month: 'Apr', income: 2500, expenses: 1100 },
        { month: 'May', income: 2500, expenses: 1350 },
        { month: 'Jun', income: 2500, expenses: 1400 },
        { month: 'Jul', income: 2500, expenses: 1300 },
        { month: 'Aug', income: 2500, expenses: 1250 },
        { month: 'Sep', income: 2500, expenses: 1200 },
        { month: 'Oct', income: 2500, expenses: 1200 },
        { month: 'Nov', income: 2500, expenses: 1450 },
        { month: 'Dec', income: 2500, expenses: 1100 },
        { month: 'Jan', income: 2500, expenses: 1350 },
      ],
      categoryBreakdown: [
        { category: '🍔 Food & Dining', amount: 4000, percentage: 35, color: 'bg-red-500' },
        { category: '⛽ Transportation', amount: 3200, percentage: 28, color: 'bg-blue-500' },
        { category: '🛒 Shopping', amount: 2500, percentage: 22, color: 'bg-green-500' },
        { category: '☕ Coffee', amount: 900, percentage: 15, color: 'bg-yellow-500' },
      ],
      budget: { total: 36000, spent: 17000, remaining: 19000, percent: 47, days: 180 },
      insights: [
        { title: '🏆 Yearly Win!', desc: 'You met your annual savings goal!', color: 'from-success/10 to-primary/10' },
        { title: '🚗 Transport', desc: 'Transport was your top expense', color: 'from-warning/10 to-destructive/10' },
        { title: '💡 Tip', desc: 'Automate savings for next year', color: 'from-primary/10 to-secondary/10' },
      ],
    },
  };
  const data = periodData[selectedPeriod];

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
              <span className="text-base font-extrabold text-blue-700 leading-tight">Financial Reports</span>
              <span className="text-xs text-muted-foreground mt-0.5">Insights & Analytics</span>
            </div>
          </div>
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1.5 rounded-full hover:bg-blue-100 transition-colors focus:outline-none">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[10px] text-white flex items-center justify-center">3</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
              <div className="p-2 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <DropdownMenuItem className="flex items-start space-x-2 p-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-medium">Budget Alert</p>
                    <p className="text-[11px] text-muted-foreground">You've used 85% of your monthly budget</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-2 p-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-medium">Goal Achieved!</p>
                    <p className="text-[11px] text-muted-foreground">You've saved $500 this month</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-2 p-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-medium">Receipt Reminder</p>
                    <p className="text-[11px] text-muted-foreground">Don't forget to scan today's receipts</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-8 px-2 pt-2 max-w-md mx-auto w-full">
        {/* Animated Period Selector */}
        <motion.div
          className="flex space-x-2 overflow-x-auto pb-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {periods.map((period) => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.id)}
              className="whitespace-nowrap"
            >
              {period.label}
            </Button>
          ))}
        </motion.div>
        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-2 gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="animate-fade-in-up bg-white/80 rounded-xl shadow-lg p-3">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Income</p>
                  <p className="text-2xl font-bold text-income">$1,150</p>
                  <p className="text-xs text-income flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-income/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-income" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up bg-white/80 rounded-xl shadow-lg p-3" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Savings Rate</p>
                  <p className="text-2xl font-bold text-success">46%</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <Target className="w-3 h-3 mr-1" />
                    Above target
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <Card className="animate-fade-in-up bg-white/80 rounded-xl shadow-lg p-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Monthly Trend</span>
                <BarChart3 className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.monthlyTrends.map((trend, index) => (
                  <motion.div
                    key={trend.month}
                    className="space-y-2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{trend.month}</span>
                      <span className="text-muted-foreground">
                        Net: ${(trend.income - trend.expenses).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-expense/20 rounded-full h-2">
                          <div 
                            className="bg-expense rounded-full h-2 transition-all duration-500"
                            style={{ 
                              width: `${(trend.expenses / trend.income) * 100}%`,
                              animationDelay: `${index * 0.1}s`
                            }}
                          />
                        </div>
                        <span className="text-xs text-expense font-medium">
                          ${trend.expenses}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-income/20 rounded-full h-2">
                          <div 
                            className="bg-income rounded-full h-2 transition-all duration-500"
                            style={{ width: '100%', animationDelay: `${index * 0.1}s` }}
                          />
                        </div>
                        <span className="text-xs text-income font-medium">
                          ${trend.income}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4"
        >
          <Card className="animate-fade-in-up bg-white/80 rounded-xl shadow-lg p-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Spending by Category</span>
                <PieChart className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.categoryBreakdown.map((item, index) => (
                  <motion.div
                    key={item.category}
                    className="space-y-2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{item.category}</span>
                      <div className="text-right">
                        <p className="font-bold text-expense">${item.amount}</p>
                        <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                      </div>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className="h-2"
                      style={{ 
                        animationDelay: `${index * 0.1 + 0.5}s`,
                        animation: 'scale-in 0.5s ease-out forwards'
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Budget Performance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-4"
        >
          <Card className="animate-fade-in-up bg-white/80 rounded-xl shadow-lg p-3">
            <CardHeader className="pb-3">
              <CardTitle>Budget Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Budget</span>
                  <span className="font-bold">${data.budget.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Spent This Period</span>
                  <span className="font-bold text-expense">${data.budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className="font-bold text-success">${data.budget.remaining.toLocaleString()}</span>
                </div>
                <Progress value={data.budget.percent} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{data.budget.percent}% used</span>
                  <span>{data.budget.days} days remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-4"
        >
          <Card className="animate-fade-in-up bg-white/80 rounded-xl shadow-lg p-3">
            <CardHeader className="pb-3">
              <CardTitle>💡 Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.insights.map((insight, idx) => (
                  <motion.div
                    key={insight.title}
                    className={`p-4 bg-gradient-to-r ${insight.color} rounded-xl`}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                  >
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
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

export default ReportsPage;