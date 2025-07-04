import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Smartphone,
  CreditCard,
  Download,
  Trash2,
  ChevronRight,
  Moon,
  Sun,
  Camera,
  Edit
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      budgetAlerts: true,
      expenseReminders: false,
      weeklyReports: true
    },
    privacy: {
      faceId: true,
      touchId: false,
      autoLock: true,
      dataSharing: false
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      theme: 'light',
      dateFormat: 'MM/DD/YYYY'
    }
  });

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const updateSetting = (category: string, key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];
  const themes = ['light', 'dark', 'system'];

  return (
    <div className="min-h-screen bg-gradient-surface pb-20 flex flex-col">
      {/* Top header: match ExpensesPage/ReportsPage, but with logout button */}
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between w-full bg-white/70 backdrop-blur shadow-lg px-3 py-2 mb-2 max-w-md mx-auto rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
              <img src={fluxpenseLogo} alt="FluxPense" className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base font-extrabold text-blue-700 leading-tight">Settings</span>
              <span className="text-xs text-muted-foreground mt-0.5">Manage your preferences</span>
            </div>
          </div>
          <Button variant="outline" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 font-semibold px-4 py-2 rounded-xl shadow-sm" size="sm" onClick={() => logout(navigate)}>
            Logout
          </Button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-4 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center space-x-3 mb-3">
                <motion.div className="relative" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    JD
                  </div>
                  <Button size="sm" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full p-0 bg-primary hover:bg-primary-dark">
                    <Camera className="w-4 h-4" />
                  </Button>
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-base">{profile.name}</h3>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  <Button variant="outline" size="sm" className="mt-1">
                    <Edit className="w-4 h-4 mr-1" />Edit
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium mb-1 block">Full Name</label>
                  <Input value={profile.name} onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} className="h-8 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Email</label>
                  <Input value={profile.email} onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))} className="h-8 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Phone</label>
                  <Input value={profile.phone} onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))} className="h-8 text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch checked={settings.notifications.pushNotifications} onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Get updates via email</p>
                  </div>
                  <Switch checked={settings.notifications.emailNotifications} onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Budget Alerts</p>
                    <p className="text-xs text-muted-foreground">Alert when approaching budget limits</p>
                  </div>
                  <Switch checked={settings.notifications.budgetAlerts} onCheckedChange={(checked) => updateSetting('notifications', 'budgetAlerts', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Expense Reminders</p>
                    <p className="text-xs text-muted-foreground">Remind to log expenses</p>
                  </div>
                  <Switch checked={settings.notifications.expenseReminders} onCheckedChange={(checked) => updateSetting('notifications', 'expenseReminders', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Weekly Reports</p>
                    <p className="text-xs text-muted-foreground">Summary every week</p>
                  </div>
                  <Switch checked={settings.notifications.weeklyReports} onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReports', checked)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & Privacy */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shield className="w-5 h-5" />
                <span>Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Face ID</p>
                    <p className="text-xs text-muted-foreground">Use Face ID to unlock the app</p>
                  </div>
                  <Switch checked={settings.privacy.faceId} onCheckedChange={(checked) => updateSetting('privacy', 'faceId', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Touch ID</p>
                    <p className="text-xs text-muted-foreground">Use fingerprint authentication</p>
                  </div>
                  <Switch checked={settings.privacy.touchId} onCheckedChange={(checked) => updateSetting('privacy', 'touchId', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Auto Lock</p>
                    <p className="text-xs text-muted-foreground">Lock app when inactive</p>
                  </div>
                  <Switch checked={settings.privacy.autoLock} onCheckedChange={(checked) => updateSetting('privacy', 'autoLock', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Data Sharing</p>
                    <p className="text-xs text-muted-foreground">Share usage data for improvements</p>
                  </div>
                  <Switch checked={settings.privacy.dataSharing} onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Palette className="w-5 h-5" />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium mb-1 block">Currency</label>
                  <div className="grid grid-cols-3 gap-1">
                    {currencies.map((currency) => (
                      <Button
                        key={currency}
                        variant={settings.preferences.currency === currency ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('preferences', 'currency', currency)}
                        className="h-7 text-xs"
                      >
                        {currency}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Language</label>
                  <div className="grid grid-cols-2 gap-1">
                    {languages.map((language) => (
                      <Button
                        key={language}
                        variant={settings.preferences.language === language ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('preferences', 'language', language)}
                        className="h-7 text-xs"
                      >
                        {language}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Theme</label>
                  <div className="grid grid-cols-3 gap-1">
                    {themes.map((theme) => (
                      <Button
                        key={theme}
                        variant={settings.preferences.theme === theme ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('preferences', 'theme', theme)}
                        className="h-7 text-xs capitalize"
                      >
                        {theme === 'light' && <Sun className="w-4 h-4 mr-1" />}
                        {theme === 'dark' && <Moon className="w-4 h-4 mr-1" />}
                        {theme === 'system' && <Smartphone className="w-4 h-4 mr-1" />}
                        {theme}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-primary" />
                  <span>Export Data</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Manage Subscription</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between text-destructive border-destructive/20 hover:bg-destructive/10">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
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

export default SettingsPage;