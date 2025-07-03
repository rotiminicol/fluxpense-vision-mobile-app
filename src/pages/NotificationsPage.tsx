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

      <div className="p-6 space-y-6">
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
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Recent Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-hover ${
                      !notification.read ? 'bg-primary/5 border border-primary/20' : 'bg-surface'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      notification.type === 'budget' ? 'bg-warning/10' :
                      notification.type === 'expense' ? 'bg-primary/10' :
                      notification.type === 'reminder' ? 'bg-info/10' :
                      notification.type === 'success' ? 'bg-success/10' :
                      'bg-secondary/10'
                    }`}>
                      <notification.icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-foreground">{notification.title}</p>
                            {!notification.read && (
                              <Badge variant="secondary" className="h-5 px-2 text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex space-x-1 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;