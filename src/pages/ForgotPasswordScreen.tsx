import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';

const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await resetPassword(email);
      setIsSubmitted(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-success/5 flex flex-col relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-success/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="hover:bg-hover"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </Button>
        </div>

        {/* Success content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            {/* Success icon */}
            <div className="mb-8 animate-bounce-in">
              <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
            </div>

            {/* Success message */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-3xl font-bold text-foreground mb-4">Check Your Email</h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We've sent a password reset link to:
              </p>
              <p className="text-lg font-medium text-primary mb-8 bg-primary/5 py-3 px-4 rounded-xl">
                {email}
              </p>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                Click the link in the email to reset your password. 
                If you don't see it, check your spam folder.
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button
                onClick={() => handleSubmit(new Event('submit') as any)}
                variant="outline"
                className="w-full h-12 rounded-xl border-2 hover:bg-hover"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Resending...
                  </div>
                ) : (
                  'Resend Email'
                )}
              </Button>
              
              <Button
                onClick={() => navigate('/login')}
                className="w-full primary-button h-12 rounded-xl font-semibold"
              >
                Back to Login
              </Button>
            </div>

            {/* Email app shortcuts */}
            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-sm text-muted-foreground mb-4">Open your email app:</p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Gmail
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://outlook.live.com', '_blank')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Outlook
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://mail.yahoo.com', '_blank')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Yahoo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary/5 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/login')}
          className="hover:bg-hover"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo and title */}
          <div className="text-center mb-8 animate-fade-in-up">
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="w-16 h-16 rounded-xl mx-auto mb-6 shadow-medium"
            />
            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground leading-relaxed">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Reset form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className={`h-12 rounded-xl border-2 transition-colors ${
                  error ? 'border-destructive' : 'border-input hover:border-ring focus:border-ring'
                }`}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <p className="text-sm text-muted-foreground">
                We'll send a password reset link to this email address.
              </p>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full primary-button text-lg py-6 rounded-2xl font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back to login */}
          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-muted-foreground">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Help section */}
          <div className="mt-8 p-6 bg-muted/30 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="font-semibold text-foreground mb-3">Need more help?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Check your spam or junk folder</p>
              <p>• Make sure you're using the correct email</p>
              <p>• Contact support if you continue having issues</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 text-primary hover:text-primary-dark"
              onClick={() => toast({ title: "Support", description: "Contact support feature coming soon!" })}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;