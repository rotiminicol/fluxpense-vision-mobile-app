import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
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
  Star,
  Lock
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
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    savingsRate: 0,
    monthlyAverage: 0,
    categories: 0,
    receiptsScanned: 0,
    memberSince: 'Loading...'
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchProfile();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Get total expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', user?.id);

      // Get categories count
      const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user?.id);

      // Get receipts count
      const { data: receipts } = await supabase
        .from('receipts')
        .select('id')
        .eq('user_id', user?.id);

      const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyExpenses = expenses?.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      }).reduce((sum, exp) => sum + exp.amount, 0) || 0;

      setStats({
        totalExpenses,
        totalIncome: 0, // We don't track income separately yet
        savingsRate: 0, // Calculate based on budget vs spending
        monthlyAverage: monthlyExpenses,
        categories: categories?.length || 0,
        receiptsScanned: receipts?.length || 0,
        memberSince: user?.isFirstLogin ? 'New Member' : 'Member since signup'
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setProfileData({
          name: profile.full_name || user?.name || '',
          email: profile.email || user?.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
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
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* HERO SECTION */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
          <div className="relative w-full max-w-md mx-auto mt-2 mb-2">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/60 to-purple-300/40 blur-xl opacity-80 animate-pulse-slow" />
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-4 flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 shadow-xl flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white/30">
                  {profileData.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-blue-100 transition-all border-2 border-white" title="Edit Avatar">
                  <Camera className="w-4 h-4 text-blue-600" />
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-800 mb-0.5">{profileData.name || 'User'}</h2>
                <p className="text-xs text-muted-foreground mb-0.5">{profileData.email}</p>
              </div>
            </div>
          </div>
        </motion.div>
        {/* STATS BAR */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full max-w-md mx-auto mb-1 overflow-x-auto pb-1">
          <div className="flex gap-2 px-1">
            <div className="min-w-[90px] bg-white/70 rounded-2xl shadow flex flex-col items-center py-2 px-1 animate-fade-in-up">
              <TrendingUp className="w-4 h-4 text-blue-500 mb-0.5" />
              <span className="font-bold text-base text-blue-700">${stats.totalExpenses.toLocaleString()}</span>
              <span className="text-[11px] text-muted-foreground">Expenses</span>
            </div>
            <div className="min-w-[90px] bg-white/70 rounded-2xl shadow flex flex-col items-center py-2 px-1 animate-fade-in-up">
              <Star className="w-4 h-4 text-yellow-500 mb-0.5" />
              <span className="font-bold text-base text-green-600">${stats.totalIncome.toLocaleString()}</span>
              <span className="text-[11px] text-muted-foreground">Income</span>
            </div>
            <div className="min-w-[90px] bg-white/70 rounded-2xl shadow flex flex-col items-center py-2 px-1 animate-fade-in-up">
              <Target className="w-4 h-4 text-purple-500 mb-0.5" />
              <span className="font-bold text-base text-purple-600">{stats.savingsRate}%</span>
              <span className="text-[11px] text-muted-foreground">Savings</span>
            </div>
            <div className="min-w-[90px] bg-white/70 rounded-2xl shadow flex flex-col items-center py-2 px-1 animate-fade-in-up">
              <Calendar className="w-4 h-4 text-orange-500 mb-0.5" />
              <span className="font-bold text-base text-orange-500">{stats.monthlyAverage}</span>
              <span className="text-[11px] text-muted-foreground">Monthly Avg</span>
            </div>
            <div className="min-w-[90px] bg-white/70 rounded-2xl shadow flex flex-col items-center py-2 px-1 animate-fade-in-up">
              <Camera className="w-4 h-4 text-blue-400 mb-0.5" />
              <span className="font-bold text-base text-blue-400">{stats.receiptsScanned}</span>
              <span className="text-[11px] text-muted-foreground">Receipts</span>
            </div>
          </div>
        </motion.div>
        {/* TABS */}
        <div className="flex justify-center mb-2">
          <div className="flex bg-white/70 rounded-full shadow px-1 py-1 gap-1">
            {tabs.map(tab => (
              <button key={tab.id} className={`px-3 py-1 rounded-full font-semibold text-xs transition-all ${activeTab === tab.id ? 'bg-blue-500 text-white shadow' : 'text-blue-700 hover:bg-blue-100'}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
        </div>
        {/* TAB CONTENT */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2">
              <CardContent className="p-0">
                <div className="flex flex-col gap-1 items-center">
                  <h3 className="text-base font-bold text-blue-700 mb-0.5">Welcome back, {profileData.name || 'User'}!</h3>
                  <div className="relative flex items-center justify-center mb-1">
                    <svg width="60" height="60" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="36" fill="#e0e7ef" />
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#6366f1" strokeWidth="7" strokeDasharray="226" strokeDashoffset="{226 - (stats.savingsRate/100)*226}" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-base font-bold text-blue-700">{stats.savingsRate}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">You’re on track to save more this month!</span>
                  <div className="flex gap-1 mt-1">
                    <Button size="sm" variant="outline"><Edit className="w-3 h-3 mr-1" />Edit</Button>
                    <Button size="sm" variant="outline"><Share className="w-3 h-3 mr-1" />Share</Button>
                    <Button size="sm" variant="outline"><Download className="w-3 h-3 mr-1" />Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2">
              <CardContent className="p-0">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-sm font-semibold text-blue-700">Recent Highlights</span>
                  <div className="flex flex-col gap-0.5 w-full">
                    <div className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-500" />You saved $500 this month</div>
                    <div className="flex items-center gap-1"><Award className="w-3 h-3 text-yellow-500" />3 new achievements unlocked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {activeTab === 'achievements' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {achievements.map(a => (
                <div key={a.id} className={`relative flex flex-col items-center p-2 rounded-2xl shadow ${a.earned ? 'bg-gradient-to-br from-green-200/80 to-white/80' : 'bg-white/60 opacity-60 blur-[1px]'}`} style={{ minHeight: '90px' }}>
                  <a.icon className={`w-6 h-6 mb-0.5 ${a.earned ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                  <span className="font-bold text-xs text-foreground text-center">{a.title}</span>
                  <span className="text-[10px] text-muted-foreground text-center">{a.description}</span>
                  {a.earned && <span className="text-[10px] text-green-600 mt-0.5">{a.date}</span>}
                  {!a.earned && <span className="absolute top-1 right-1"><Lock className="w-3 h-3 text-gray-400" /></span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col gap-2 mb-2">
              {recentActivity.map(act => (
                <div key={act.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/80 shadow animate-fade-in-up">
                  {act.type === 'expense' && <TrendingUp className="w-4 h-4 text-red-500" />}
                  {act.type === 'receipt' && <Camera className="w-4 h-4 text-blue-400" />}
                  {act.type === 'achievement' && <Award className="w-4 h-4 text-green-500" />}
                  {act.type === 'income' && <Star className="w-4 h-4 text-yellow-500" />}
                  <div className="flex-1">
                    <div className="font-semibold text-xs text-foreground">{act.action}</div>
                    <div className="text-xs text-muted-foreground">{act.description}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{act.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {/* EDIT MODE OVERLAY */}
        {editMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md mx-auto bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up min-h-[60vh] p-8">
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-blue-600 text-2xl font-bold z-10" onClick={() => setEditMode(false)} aria-label="Close">&times;</button>
              <h2 className="text-xl font-bold text-blue-700 mb-4">Edit Profile</h2>
              <input className="w-full rounded-xl border px-3 py-2 text-lg font-bold text-foreground bg-white/80 mb-3" value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} />
              <input className="w-full rounded-xl border px-3 py-2 text-muted-foreground bg-white/80 mb-3" value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))} />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>Cancel</Button>
                <Button variant="default" size="sm" onClick={handleSave}>Save</Button>
              </div>
            </div>
          </div>
        )}
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50">Profile updated!</motion.div>
        )}
        {/* BOTTOM NAV */}
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.4, type: 'spring' }} className="z-50">
          <BottomNavigation onQuickAdd={() => {}} />
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;