
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MailCheck, AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { supabase } from '@/integrations/supabase/client'; // For resend
import { useToast } from '@/hooks/use-toast';

const EmailVerificationPage: React.FC = () => {
  const { user, isLoading: authLoading, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [status, setStatus] = useState<'verifying' | 'verified' | 'failed' | 'idle'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [targetEmailForResend, setTargetEmailForResend] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to get email from URL state if user is not yet available (e.g., for resend before first load)
    if (location.state?.email && !targetEmailForResend) {
      setTargetEmailForResend(location.state.email);
    } else if (user?.email && !targetEmailForResend) {
      setTargetEmailForResend(user.email);
    }
  }, [location.state, user, targetEmailForResend]);

  useEffect(() => {
    // Supabase client handles the URL fragment (#access_token=...) and updates auth state.
    // This useEffect hook listens to changes in the auth state (user, authLoading, session).

    // The actual verification happens when Supabase client processes the URL.
    // onAuthStateChange in AuthContext will then update the user object,
    // including user.emailConfirmed.

    if (authLoading) {
      setStatus('verifying'); // Still waiting for AuthContext to initialize
      return;
    }

    const hash = window.location.hash;
    if (hash.includes('error_description=')) {
      const params = new URLSearchParams(hash.substring(1));
      setErrorMessage(params.get('error_description') || 'An error occurred during verification.');
      setStatus('failed');
      window.history.replaceState(null, '', window.location.pathname + window.location.search); // Clean URL
      return;
    }

    if (user) {
      if (user.emailConfirmed) {
        setStatus('verified');
        toast({ title: "Email Verified!", description: "Redirecting you now..." });
        setTimeout(() => {
          navigate('/dashboard', { replace: true }); // Or to /login
        }, 2000);
      } else {
        // User exists but email not confirmed. This page might be visited directly.
        // Or link was clicked but something went wrong before email_confirmed was set.
        setStatus('idle'); // Ready to offer resend option
        setTargetEmailForResend(user.email); // Ensure we have the email for resend
      }
    } else if (!authLoading && !session) {
      // No user, not loading, and no error in URL.
      // This could be an invalid/expired link, or user clicked "verify" from a logged-out state.
      // Give a chance for Supabase to process if it's a fresh link click.
      const timer = setTimeout(() => {
        // Check status again, as it might have changed due to async Supabase processing
        if (status === 'verifying' && !user) {
          setStatus('failed');
          setErrorMessage('Verification failed. The link may be invalid, expired, or already used. Please try signing up or logging in to resend.');
        }
      }, 4000); // Wait a bit longer for Supabase to potentially establish a session
      return () => clearTimeout(timer);
    }

  }, [user, authLoading, session, navigate, toast, status]); // Added status to dependencies

  const handleResendEmail = async () => {
    if (!targetEmailForResend) {
      toast({ title: "Error", description: "No email address found to resend verification.", variant: "destructive" });
      setStatus('failed');
      setErrorMessage('Could not find an email address to resend the verification link. Please try logging in or signing up again.');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup', // Or 'email_change' if you handle that flow
        email: targetEmailForResend,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification` // Redirect back to this page
        }
      });

      if (error) throw error;

      toast({
        title: "Verification Email Resent!",
        description: `A new verification link has been sent to ${targetEmailForResend}.`,
      });
      setStatus('idle'); // Or a specific "resent" status
    } catch (error: any) {
      toast({
        title: "Failed to Resend Email",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <h1 className="text-xl font-semibold text-foreground mb-2">Verifying Your Email...</h1>
            <p className="text-muted-foreground text-sm">Please wait a moment.</p>
          </div>
        );
      case 'verified':
        return (
          <div className="flex flex-col items-center text-center">
            <MailCheck className="w-12 h-12 text-green-500 mb-6" />
            <h1 className="text-xl font-semibold text-foreground mb-2">Email Verified Successfully!</h1>
            <p className="text-muted-foreground text-sm">Redirecting to your dashboard...</p>
          </div>
        );
      case 'idle': // User landed here, email not verified yet, offer resend
        return (
           <div className="flex flex-col items-center text-center">
            <Mail className="w-12 h-12 text-primary mb-6" />
            <h1 className="text-xl font-semibold text-foreground mb-2">Confirm Your Email</h1>
            <p className="text-muted-foreground text-sm mb-6">
              A verification link was sent to <span className="font-medium text-foreground">{targetEmailForResend || "your email"}</span>.
              Please click the link to activate your account.
            </p>
            <Button onClick={handleResendEmail} disabled={isResending} className="w-full primary-button mb-4">
              {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
              Resend Verification Email
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
              Back to Login
            </Button>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mb-6" />
            <h1 className="text-xl font-semibold text-foreground mb-2">Verification Failed</h1>
            <p className="text-muted-foreground text-sm mb-6">{errorMessage || 'An unknown error occurred.'}</p>
            <Button onClick={handleResendEmail} disabled={!targetEmailForResend || isResending} className="w-full primary-button mb-4">
              {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
              Resend Verification Email
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
              Back to Login
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary/5 flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <img src={fluxpenseLogo} alt="FluxPense" className="w-10 h-10 rounded-lg shadow-md" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-sm bg-card p-6 sm:p-8 rounded-2xl shadow-xl"
      >
        {renderContent()}
      </motion.div>
       <p className="text-xs text-muted-foreground mt-8">
        &copy; {new Date().getFullYear()} FluxPense. All rights reserved.
      </p>
    </div>
  );
};

export default EmailVerificationPage;
