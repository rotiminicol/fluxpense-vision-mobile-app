import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  TrendingUp,
  Target,
  Award,
  MapPin,
  Phone,
  Mail,
  Edit,
  Camera,
  Share,
  Download,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const stats = {
    totalExpenses: 3425.50,
    totalIncome: 7500.00,
    savingsRate: 54,
    monthlyAverage: 1142.17,
    categories: 12,
    receiptsScanned: 87,
    memberSince: 'January 2024'
  };

  const achievements = [
    {
      id: '1',
      title: 'First Expense',
      description: 'Logged your first expense',
      icon: Target,
      earned: true,
      date: '2024-01-02'
    },
    {
      id: '2',
      title: 'Receipt Scanner',
      description: 'Scanned 10 receipts',
      icon: Camera,
      earned: true,
      date: '2024-01-15'
    },
    {
      id: '3',
      title: 'Budget Master',
      description: 'Stayed under budget for 3 months',
      icon: Award,
      earned: true,
      date: '2024-01-20'
    },
    {
      id: '4',
      title: 'Savings Star',
      description: 'Saved $1000 in a month',
      icon: Star,
      earned: false,
      date: null
    }
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'Added expense',
      description: 'Coffee at Starbucks - $4.50',
      date: '2 hours ago',
      type: 'expense'
    },
    {
      id: '2',
      action: 'Scanned receipt',
      description: 'Grocery shopping - $89.50',
      date: '1 day ago',
      type: 'receipt'
    },
    {
      id: '3',
      action: 'Budget goal met',
      description: 'Food & Dining category',
      date: '3 days ago',
      type: 'achievement'
    },
    {
      id: '4',
      action: 'Income added',
      description: 'Salary payment - $2,500',
      date: '1 week ago',
      type: 'income'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'activity', label: 'Activity' }
  ];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
    setEditMode(false);
  };

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
              <h1 className="text-xl font-bold text-foreground">Profile</h1>
              <p className="text-sm text-muted-foreground">Your financial journey</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl border-4 border-white/20">
                    {profileData.name?.charAt(0) || 'U'}
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary-dark"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </motion.div>
                <div className="flex-1">
                  {editMode ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <input
                        className="w-full rounded-xl border px-3 py-2 text-lg font-bold text-foreground bg-white/80"
                        value={profileData.name}
                        onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                      />
                      <input
                        className="w-full rounded-xl border px-3 py-2 text-muted-foreground bg-white/80"
                        value={profileData.email}
                        onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))}
                      />
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-foreground">{profileData.name || 'User'}</h2>
                      <p className="text-muted-foreground">{profileData.email}</p>
                    </>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {stats.memberSince}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Pro User
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                {editMode ? (
                  <motion.button
                    className="primary-button px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-br from-primary to-secondary shadow-lg"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                  >
                    Save
                  </motion.button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                {saveSuccess && (
                  <motion.span
                    className="ml-2 text-success font-semibold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                  >
                    Saved!
                  </motion.span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="animate-fade-in-up">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Saved</p>
                      <p className="text-2xl font-bold text-success">
                        ${(stats.totalIncome - stats.totalExpenses).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Savings Rate</p>
                      <p className="text-2xl font-bold text-primary">{stats.savingsRate}%</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Avg</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${stats.monthlyAverage.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Receipts</p>
                      <p className="text-2xl font-bold text-foreground">{stats.receiptsScanned}</p>
                    </div>
                    <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Camera className="w-5 h-5 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress */}
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="pb-3">
                <CardTitle>This Month's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Savings Goal</span>
                      <span>{stats.savingsRate}% / 60%</span>
                    </div>
                    <Progress value={stats.savingsRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Budget Usage</span>
                      <span>45% / 100%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Receipt Scanning</span>
                      <span>23 / 30</span>
                    </div>
                    <Progress value={77} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <Card className="animate-fade-in-up">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-success/10 to-primary/10 border-success/20' 
                        : 'bg-surface border-border opacity-60'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.earned ? 'bg-success/20' : 'bg-muted/20'
                    }`}>
                      <achievement.icon className={`w-6 h-6 ${
                        achievement.earned ? 'text-success' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-success mt-1">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {achievement.earned && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <Card className="animate-fade-in-up">
            <CardHeader className="pb-3">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 bg-surface rounded-xl animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'expense' ? 'bg-expense/10' :
                      activity.type === 'income' ? 'bg-income/10' :
                      activity.type === 'receipt' ? 'bg-primary/10' :
                      'bg-success/10'
                    }`}>
                      {activity.type === 'expense' && <TrendingUp className="w-5 h-5 text-expense rotate-180" />}
                      {activity.type === 'income' && <TrendingUp className="w-5 h-5 text-income" />}
                      {activity.type === 'receipt' && <Camera className="w-5 h-5 text-primary" />}
                      {activity.type === 'achievement' && <Award className="w-5 h-5 text-success" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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

export default ProfilePage;