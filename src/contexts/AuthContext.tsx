
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
    console.log('[AuthContext] useEffect setup initiated. Current isLoading:', isLoading);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] onAuthStateChange triggered. Event:', event, 'Session User Email:', session?.user?.email, 'Email Confirmed:', session?.user?.email_confirmed_at, 'Current isLoading before processing:', isLoading);
        try {
          // console.log('Auth state changed:', event, session?.user?.email, 'email_confirmed_at:', session?.user?.email_confirmed_at); // Original log

          if (session?.user) {
            // If user is signing in but their email is not confirmed, sign them out immediately.
            if (event === 'SIGNED_IN' && !session.user.email_confirmed_at) {
              console.log('[AuthContext] onAuthStateChange: User signed in but email NOT confirmed. Signing out. User:', session.user.id);
              await supabase.auth.signOut();
              // setUser(null) will be handled by the subsequent 'SIGNED_OUT' event from onAuthStateChange
              // setSession(null) also by 'SIGNED_OUT'
              // No need to set isLoading(false) here, finally block or SIGNED_OUT will do it.
              // We want the login function to throw an error in this case.
              return; // Exit early, the SIGNED_OUT event will clean up.
            }

            // Proceed with setting user if email is confirmed or if it's not a SIGNED_IN event (e.g. TOKEN_REFRESHED, USER_UPDATED)
            console.log('[AuthContext] onAuthStateChange: Processing valid session for user:', session.user.id);
            setSession(session); // Set session here for all valid session events

            if (event === 'SIGNED_IN' && session.user.email_confirmed_at) { // Only create notification if fully signed in and confirmed
              console.log('[AuthContext] onAuthStateChange: User SIGNED_IN and email confirmed. Creating notification.');
              supabase.from('notifications').insert({
                user_id: session.user.id,
                title: 'Welcome back!',
                message: `Welcome back to FluxPense, ${session.user.email}!`,
                type: 'info'
              }).then(({ error: notificationError }) => { // Renamed to avoid conflict
                if (notificationError) console.error('Error creating notification:', notificationError);
              });
            }

            console.log('[AuthContext] onAuthStateChange: Fetching profile for user:', session.user.id);
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('onboarding_completed, full_name')
              .eq('user_id', session.user.id)
              .single();

            if (profileError) {
              console.error("[AuthContext] onAuthStateChange: Error fetching profile:", profileError);
            }

            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.full_name || session.user.email?.split('@')[0] || '',
              isFirstLogin: !profile?.onboarding_completed,
              emailConfirmed: !!session.user.email_confirmed_at
            };
            console.log('[AuthContext] onAuthStateChange: Setting user state:', userData);
            setUser(userData);
          } else {
            console.log('[AuthContext] onAuthStateChange: No session user, setting user to null.');
            setUser(null);
          }
        } catch (e: any) {
          console.error("[AuthContext] onAuthStateChange: Error in try block:", e.message, e.stack);
          setUser(null);
        } finally {
          console.log('[AuthContext] onAuthStateChange: Finally block. Setting isLoading to false. Was:', isLoading);
          setIsLoading(false);
          if (!initialAuthCheckCompleted) {
            console.log('[AuthContext] onAuthStateChange: Marking initial auth check as completed.');
            initialAuthCheckCompleted = true;
          }
        }
      }
    );

    console.log('[AuthContext] useEffect: Calling getSession.');
    supabase.auth.getSession()
      .then(({ data: { session }, error: getSessionError }) => {
        if (getSessionError) {
          console.error("[AuthContext] getSession: Error getting initial session:", getSessionError);
          if (!initialAuthCheckCompleted) {
            console.log('[AuthContext] getSession: Error fallback, setting isLoading to false.');
            setIsLoading(false);
            initialAuthCheckCompleted = true;
          }
        } else {
          console.log('[AuthContext] getSession: Success. Session:', session ? session.user?.id : 'null', 'onAuthStateChange will handle further processing.');
        }
      })
      .catch(criticalError => {
        console.error("[AuthContext] getSession: Critical error in promise chain:", criticalError);
        if (!initialAuthCheckCompleted) {
          console.log('[AuthContext] getSession: Critical error fallback, setting isLoading to false.');
          setIsLoading(false);
          initialAuthCheckCompleted = true;
        }
      });

    const safetyNetTimeout = setTimeout(() => {
      if (!initialAuthCheckCompleted) {
        console.warn("[AuthContext] Safety net timeout: Initial auth check not completed, forcing isLoading to false. Was:", isLoading);
        setIsLoading(false);
        initialAuthCheckCompleted = true;
      }
    }, 5000); // Increased timeout slightly for very slow networks

    return () => {
      console.log('[AuthContext] useEffect cleanup: Unsubscribing from onAuthStateChange and clearing safety net timeout.');
      subscription.unsubscribe();
      clearTimeout(safetyNetTimeout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('[AuthContext] login: Attempting login for email:', email, 'Current isLoading:', isLoading);
    setIsLoading(true);
    try {
      console.log('[AuthContext] login: Calling signInWithPassword.');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;

      // After successful signIn, check if email is confirmed.
      // signInWithPassword response includes user, check user.email_confirmed_at
      if (signInData.user && !signInData.user.email_confirmed_at) {
        await supabase.auth.signOut(); // Sign out the user
        // We throw a specific error that LoginScreen can catch
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      // If email is verified, onAuthStateChange will handle setting the user state.
      // However, to ensure isLoading is reset promptly by the login function itself on success:
      // This might be slightly redundant if onAuthStateChange is very fast, but adds robustness.
      // Check if user is now set by onAuthStateChange (or session is active)
      // This check is a bit tricky here because login function doesn't directly wait for onAuthStateChange.
      // For now, let's assume onAuthStateChange will set isLoading.
      // The problem might be if onAuthStateChange has an error AFTER setting the user but before its finally.
      // The existing finally in onAuthStateChange should cover it.

      // Let's reconsider: the login function's primary job is to attempt login.
      // If it succeeds and doesn't throw, it means Supabase accepted credentials.
      // onAuthStateChange is responsible for the aftermath, including isLoading.
      // The current structure *should* work.

      // If login is still stuck, it implies onAuthStateChange's finally block isn't running or is delayed
      // *after a successful login*.

      // One possible scenario:
      // 1. login() sets isLoading = true
      // 2. signInWithPassword() succeeds (email verified)
      // 3. login() finishes, promise resolves.
      // 4. LoginScreen navigates to /dashboard.
      // 5. onAuthStateChange runs, sets user, and in finally sets isLoading = false.
      // If LoginScreen navigates *before* onAuthStateChange's finally block, then isLoading might be true
      // when the dashboard loads, if other components rely on this isLoading from AuthContext.
      // However, the LoginScreen button itself should become enabled once its own isLoading (from useAuth()) becomes false.

      // The most direct fix if login button itself remains stuck after successful login (and verified):

      if (signInError) {
        console.error('[AuthContext] login: signInWithPassword error:', signInError.message);
        throw signInError;
      }

      console.log('[AuthContext] login: signInWithPassword successful. User:', signInData.user?.id, 'Email confirmed:', signInData.user?.email_confirmed_at);

      // After successful signIn, check if email is confirmed.
      if (signInData.user && !signInData.user.email_confirmed_at) {
        console.log('[AuthContext] login: Email NOT verified for user:', signInData.user.id, 'Signing out.');
        await supabase.auth.signOut();
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      // If email is verified, onAuthStateChange is now responsible for setting the user
      // and for setting isLoading to false via its finally block.
      // The login function's promise will resolve, and LoginScreen will await this.
      // The button state will update once isLoading from useAuth() becomes false.
      console.log('[AuthContext] login: Login attempt successful (or EMAIL_NOT_VERIFIED thrown). isLoading will be handled by onAuthStateChange.');

    } catch (error: any) {
      console.error('[AuthContext] login: Catch block. Error message:', error.message, 'Current isLoading before setIsloading(false):', isLoading);
      setIsLoading(false);
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        console.log('[AuthContext] login: Re-throwing EMAIL_NOT_VERIFIED error.');
        throw error;
      }
      console.log('[AuthContext] login: Throwing generic login error.');
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // const redirectUrl = `${window.location.origin}/dashboard`; // Old redirect
      const verificationRedirectUrl = `${window.location.origin}/email-verification`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: verificationRedirectUrl,
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
