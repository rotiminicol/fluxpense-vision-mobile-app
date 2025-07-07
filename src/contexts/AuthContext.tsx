
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
    let initialAuthCheckCompleted = false; // Flag to ensure fallbacks only run if needed for initial load

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);

          if (session?.user) {
            if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
              supabase.from('notifications').insert({
                user_id: session.user.id,
                title: 'Welcome back!',
                message: `Welcome back to FluxPense, ${session.user.email}!`,
                type: 'info'
              }).then(({ error: notificationError }) => { // Renamed to avoid conflict
                if (notificationError) console.error('Error creating notification:', notificationError);
              });
            }

            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('onboarding_completed, full_name')
              .eq('user_id', session.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
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
        } catch (e) { // Renamed error variable
          console.error("Error in onAuthStateChange callback:", e);
          setUser(null);
        } finally {
          setIsLoading(false); // Always set isLoading to false after any auth event or initial check
          if (!initialAuthCheckCompleted) {
            initialAuthCheckCompleted = true; // Mark that the initial auth check via onAuthStateChange has run
          }
        }
      }
    );

    // Get initial session. onAuthStateChange will fire based on this.
    supabase.auth.getSession()
      .then(({ error: getSessionError }) => { // Renamed to avoid conflict
        if (getSessionError) {
          console.error("Error getting initial session:", getSessionError);
          // Fallback: if getSession errors AND onAuthStateChange hasn't already run for the initial check
          if (!initialAuthCheckCompleted) {
            setIsLoading(false);
            initialAuthCheckCompleted = true;
          }
        }
        // If no error, onAuthStateChange is expected to handle setting isLoading and the flag.
      })
      .catch(criticalError => { // Renamed error variable
        console.error("Critical error in getSession promise chain:", criticalError);
        // Critical Fallback:
        if (!initialAuthCheckCompleted) {
          setIsLoading(false);
          initialAuthCheckCompleted = true;
        }
      });

    // Additional safety net for initial load:
    // If after a short delay, onAuthStateChange hasn't completed the initial check, force isLoading to false.
    const safetyNetTimeout = setTimeout(() => {
      if (!initialAuthCheckCompleted) {
        console.warn("AuthContext: Safety net triggered to set isLoading to false.");
        setIsLoading(false);
        initialAuthCheckCompleted = true;
      }
    }, 3000); // 3 seconds timeout

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyNetTimeout);
    };
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
