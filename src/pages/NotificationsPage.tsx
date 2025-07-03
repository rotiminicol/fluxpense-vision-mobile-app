import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'budget' as const,
      title: 'Budget Alert',
      message: 'You\'ve used 85% of your monthly food budget',
      time: '2 hours ago',
      read: false,
      icon: AlertTriangle,
      color: 'text-warning'
    },
    {
      id: '2',
      type: 'expense' as const,
      title: 'New Expense Added',
      message: 'Coffee purchase of $4.50 was automatically detected',
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
      message: 'Congratulations! You\'ve saved $500 this month',
      time: '2 days ago',
      read: true,
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      id: '5',
      type: 'budget' as const,
      title: 'Monthly Report Ready',
      message: 'Your January spending report is now available',
      time: '3 days ago',
      read: true,
      icon: Calendar,
      color: 'text-secondary'
    }
  ]);

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
      <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="w-8 h-8 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Notification Settings */}
        <Card className="animate-fade-in-up">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
        <div className="space-y-4 mt-8">
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.08, duration: 0.5, type: 'spring' }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center space-x-3">
                    <notif.icon className={`w-6 h-6 ${notif.color}`} />
                    <span className="font-semibold text-foreground">{notif.title}</span>
                    {!notif.read && (
                      <span className="ml-2 w-3 h-3 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notif.read && (
                      <Badge variant="secondary" className="animate-pulse">Unread</Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                      Mark Read
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteNotification(notif.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="text-muted-foreground mb-1">{notif.message}</div>
                  <div className="text-xs text-muted-foreground">{notif.time}</div>
                </CardContent>
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