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
  DollarSign
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  
  const periods = [
    { id: 'thisWeek', label: 'This Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'last3Months', label: 'Last 3 Months' },
    { id: 'thisYear', label: 'This Year' }
  ];

  const categoryBreakdown = [
    { category: '🍔 Food & Dining', amount: 345.50, percentage: 45, color: 'bg-red-500' },
    { category: '⛽ Transportation', amount: 220.00, percentage: 29, color: 'bg-blue-500' },
    { category: '🛒 Shopping', amount: 150.75, percentage: 20, color: 'bg-green-500' },
    { category: '☕ Coffee', amount: 45.25, percentage: 6, color: 'bg-yellow-500' }
  ];

  const monthlyTrends = [
    { month: 'Oct', income: 2500, expenses: 1200 },
    { month: 'Nov', income: 2500, expenses: 1450 },
    { month: 'Dec', income: 2500, expenses: 1100 },
    { month: 'Jan', income: 2500, expenses: 1350 }
  ];

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
              <h1 className="text-xl font-bold text-foreground">Financial Reports</h1>
              <p className="text-sm text-muted-foreground">Insights & Analytics</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Period Selector */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
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
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="animate-fade-in-up">
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

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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
        </div>

        {/* Monthly Trend */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Monthly Trend</span>
              <BarChart3 className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="space-y-2">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Spending by Category</span>
              <PieChart className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={item.category} className="space-y-2">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Performance */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle>Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Budget</span>
                <span className="font-bold">$3,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Spent This Month</span>
                <span className="font-bold text-expense">$1,350</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-bold text-success">$1,650</span>
              </div>
              <Progress value={45} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>45% used</span>
                <span>15 days remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="pb-3">
            <CardTitle>💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-xl">
                <p className="text-sm font-medium text-foreground">🎉 Great Progress!</p>
                <p className="text-sm text-muted-foreground">You're saving 15% more than last month</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-warning/10 to-destructive/10 rounded-xl">
                <p className="text-sm font-medium text-foreground">📈 Spending Alert</p>
                <p className="text-sm text-muted-foreground">Food expenses increased by 25% this month</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                <p className="text-sm font-medium text-foreground">🎯 Budget Tip</p>
                <p className="text-sm text-muted-foreground">Set a $300 limit for dining out to stay on track</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;