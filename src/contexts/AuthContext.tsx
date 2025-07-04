import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  isFirstLogin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: (navigate?: (path: string) => void) => void;
  resetPassword: (email: string) => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed, full_name')
            .eq('user_id', session.user.id)
            .single();
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.email?.split('@')[0] || '',
            isFirstLogin: !profile?.onboarding_completed
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Initial session handling is done by the auth state change listener
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = async (navigate?: (path: string) => void) => {
    await supabase.auth.signOut();
    if (navigate) navigate('/welcome');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  };

  const completeOnboarding = async () => {
    if (user && session) {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', session.user.id);
      
      if (!error) {
        setUser(prev => prev ? { ...prev, isFirstLogin: false } : null);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};