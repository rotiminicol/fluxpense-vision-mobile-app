
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
          console.log('Auth state changed:', event, session?.user?.email, 'email_confirmed_at:', session?.user?.email_confirmed_at);

          if (session?.user) {
            // If user is signing in but their email is not confirmed, sign them out immediately.
            if (event === 'SIGNED_IN' && !session.user.email_confirmed_at) {
              console.log('User signed in but email not confirmed. Signing out.');
              await supabase.auth.signOut();
              // setUser(null) will be handled by the subsequent 'SIGNED_OUT' event from onAuthStateChange
              // setSession(null) also by 'SIGNED_OUT'
              // No need to set isLoading(false) here, finally block or SIGNED_OUT will do it.
              // We want the login function to throw an error in this case.
              return; // Exit early, the SIGNED_OUT event will clean up.
            }

            // Proceed with setting user if email is confirmed or if it's not a SIGNED_IN event (e.g. TOKEN_REFRESHED, USER_UPDATED)
            setSession(session); // Set session here for all valid session events

            if (event === 'SIGNED_IN' && session.user.email_confirmed_at) { // Only create notification if fully signed in and confirmed
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
      // is to ensure login() itself also sets isLoading to false on non-error path.
      // This is a slight deviation from pure reliance on onAuthStateChange for this.
      if (signInData.user && signInData.user.email_confirmed_at) {
        // Successfully signed in and email is confirmed.
        // onAuthStateChange will handle setting the user.
        // We can set isLoading to false here to make the login button responsive faster.
        // Note: This means onAuthStateChange might set it to false again, which is fine.
        // Let's test this specific change.
        // setIsLoading(false); // Tentatively add this.
        // No, the original design is that onAuthStateChange is the single source of truth for isLoading after an event.
        // The issue is more likely that the LoginScreen isn't correctly re-rendering or picking up the isLoading change.

        // The login function should resolve, and LoginScreen should see isLoading become false via useAuth().
        // If it's not, the problem is subtle.

        // Let's stick to the principle that onAuthStateChange's finally block handles this.
        // The previous analysis of onAuthStateChange's finally block suggests it *is* robust.

        // What if the navigation in LoginScreen happens too fast?
        // `await login(...)` means LoginScreen waits for the login promise.
        // The login promise resolves *after* signInWithPassword but *before* onAuthStateChange fully completes usually.
        // This is the standard Supabase pattern.

        // If the login button remains stuck, it's because the `isLoading` state from `useAuth()`
        // in `LoginScreen.tsx` is not updating. This points to `onAuthStateChange` not
        // setting `setIsLoading(false)` or `LoginScreen` not re-rendering.
        // The `finally` block in `onAuthStateChange` is the most reliable place.

        // No change here for now, let's ensure other parts are correct. The existing logic for isLoading
        // in onAuthStateChange's finally block is designed to be the primary place it's set to false.
        // Adding setIsLoading(false) in login() success path might cause race conditions or hide other issues.
      }
      // If email is verified, onAuthStateChange will handle setting the user state
      // and isLoading will be set to false in its finally block.
      // No need to setIsLoading(false) here on success path as onAuthStateChange handles it.

    } catch (error: any) {
      setIsLoading(false); // Ensure loading is false on any error from login attempt
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        throw error; // Re-throw specific error
      }
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
