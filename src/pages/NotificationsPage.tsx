import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Calendar,
  Receipt
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMockNotifications();
    }
  }, [user]);

  const loadMockNotifications = async () => {
    try {
      // Get some real data to create relevant notifications
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, date, categories(name)')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(5);

      const { data: budgets } = await supabase
        .from('budgets')
        .select('amount, spent_amount')
        .eq('user_id', user?.id);

      // Create dynamic notifications based on real data
      const mockNotifications = [
        {
          id: '1',
          type: 'budget' as const,
          title: 'Budget Alert',
          message: expenses && expenses.length > 0 ? 
            `Recent expense: $${expenses[0].amount} for ${expenses[0].categories?.name || 'expense'}` :
            'You\'ve used 85% of your monthly food budget',
          time: '2 hours ago',
          read: false,
          icon: AlertTriangle,
          color: 'text-warning'
        },
        {
          id: '2',
          type: 'expense' as const,
          title: 'New Expense Added',
          message: expenses && expenses.length > 1 ? 
            `$${expenses[1].amount} expense was recorded` :
            'Coffee purchase of $4.50 was automatically detected',
          time: '4 hours ago',
          read: false,
          icon: DollarSign,
          color: 'text-primary'
        },
        {
          id: '3',
          type: 'reminder' as const,
          title: 'Receipt Reminder',
          message: 'Don\'t forget to scan your grocery receipt from today',
          time: '1 day ago',
          read: true,
          icon: Receipt,
          color: 'text-info'
        },
        {
          id: '4',
          type: 'success' as const,
          title: 'Goal Achieved!',
          message: 'Congratulations! You\'re tracking your expenses regularly',
          time: '2 days ago',
          read: true,
          icon: CheckCircle,
          color: 'text-success'
        },
        {
          id: '5',
          type: 'budget' as const,
          title: 'Monthly Report Ready',
          message: 'Your spending report is now available',
          time: '3 days ago',
          read: true,
          icon: Calendar,
          color: 'text-secondary'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fall back to static notifications
      const staticNotifications = [
        {
          id: '1',
          type: 'budget' as const,
          title: 'Welcome to FluxPense!',
          message: 'Start by adding your first expense',
          time: 'Just now',
          read: false,
          icon: CheckCircle,
          color: 'text-primary'
        }
      ];
      setNotifications(staticNotifications);
    } finally {
      setLoading(false);
    }
  };

  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlerts: true,
    expenseReminders: true,
    weeklyReports: false,
    goalAchievements: true,
    receiptReminders: true
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
              <span className="text-base font-extrabold text-blue-700 leading-tight">Notifications</span>
              <span className="text-xs text-muted-foreground mt-0.5">{loading ? 'Loading...' : `${unreadCount} unread notifications`}</span>
            </div>
          </div>
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1.5 rounded-full hover:bg-blue-100 transition-colors focus:outline-none">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[10px] text-white flex items-center justify-center">{unreadCount}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
              <div className="p-2 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {notifications.slice(0, 3).map((notif) => (
                  <DropdownMenuItem key={notif.id} className="flex items-start space-x-2 p-2">
                    <notif.icon className={`w-4 h-4 ${notif.color} mt-1`} />
                    <div>
                      <p className="text-xs font-medium">{notif.title}</p>
                      <p className="text-[11px] text-muted-foreground">{notif.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-8 px-2 pt-2 max-w-md mx-auto w-full">
        {/* Notification Settings */}
        <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-4">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Settings className="w-5 h-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-0 pb-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
                </div>
                <Switch
                  checked={notificationSettings.budgetAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, budgetAlerts: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Expense Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders to log daily expenses</p>
                </div>
                <Switch
                  checked={notificationSettings.expenseReminders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, expenseReminders: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Weekly spending summary reports</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Goal Achievements</p>
                  <p className="text-sm text-muted-foreground">Celebrate when you reach savings goals</p>
                </div>
                <Switch
                  checked={notificationSettings.goalAchievements}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, goalAchievements: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Receipt Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders to scan receipts</p>
                </div>
                <Switch
                  checked={notificationSettings.receiptReminders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, receiptReminders: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Notifications List */}
        <div className="space-y-3">
          {loading && (
            <div className="text-center text-muted-foreground py-8">Loading notifications...</div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No notifications.</div>
          )}
          {!loading && notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <Card className={`flex flex-row items-center bg-white/90 backdrop-blur rounded-xl shadow p-3 ${!notif.read ? 'border-l-4 border-blue-400' : ''}`}>
                <notif.icon className={`w-6 h-6 ${notif.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm truncate ${!notif.read ? 'text-blue-700' : 'text-foreground'}`}>{notif.title}</span>
                    {!notif.read && <Badge variant="secondary" className="text-xs">New</Badge>}
                  </div>
                  <span className="block text-xs text-muted-foreground truncate">{notif.message}</span>
                  <span className="block text-[11px] text-muted-foreground mt-0.5">{notif.time}</span>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
                  {!notif.read && (
                    <Button size="sm" variant="ghost" className="px-2 py-0.5 text-xs" onClick={() => markAsRead(notif.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Read
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="px-2 py-0.5 text-xs text-destructive" onClick={() => deleteNotification(notif.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
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

export default NotificationsPage;