
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  isFirstLogin?: boolean;
  emailConfirmed?: boolean;
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
        try {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);

          if (session?.user) {
            // Create notification for login (except during signup)
            if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
              // Non-critical, so allow to fail silently or add specific error handling if needed
              supabase.from('notifications').insert({
                user_id: session.user.id,
                title: 'Welcome back!',
                message: `Welcome back to FluxPense, ${session.user.email}!`,
                type: 'info'
              }).then(({ error }) => {
                if (error) console.error('Error creating notification:', error);
              });
            }

            // Check if user has completed onboarding
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('onboarding_completed, full_name')
              .eq('user_id', session.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              // Potentially set a default/error state for user or logout
              // For now, we'll proceed to set user with available info
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.full_name || session.user.email?.split('@')[0] || '',
              isFirstLogin: !profile?.onboarding_completed,
              emailConfirmed: !!session.user.email_confirmed_at
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error in onAuthStateChange callback:", error);
          // Ensure user is clear if an unexpected error occurs
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    // The onAuthStateChange listener will be triggered by getSession's resolution,
    // or by the initial state check if a session already exists.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting initial session:", error);
        // If getSession itself fails catastrophically,
        // onAuthStateChange might not fire as expected.
        // Ensure isLoading is false in this scenario too.
        setIsLoading(false);
      }
      // If session is null and no error, onAuthStateChange will handle it.
      // If session exists, onAuthStateChange will handle it.
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
      const redirectUrl = `${window.location.origin}/dashboard`;
      
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
