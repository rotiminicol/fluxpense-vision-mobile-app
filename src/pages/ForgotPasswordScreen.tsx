import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';

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
          <motion.div
            className="w-full max-w-md mx-auto backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
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
            <motion.div
              className="space-y-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
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
            </motion.div>

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
          </motion.div>
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
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="w-full max-w-md mx-auto animate-fade-in-up">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="w-16 h-16 rounded-xl mx-auto mb-6 shadow-medium"
            />
            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">Enter your email to reset your password</p>
          </div>
          {/* Google button */}
          <Button type="button" className="w-full mb-6 flex items-center justify-center gap-2 bg-white text-foreground border border-input shadow hover:bg-muted font-semibold py-3 rounded-xl">
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path d="M44.5 20H24v8.5h11.7C34.7 33.7 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3c-7.2 0-13 5.8-13 13 0 1.6.3 3.1.8 4.7z" fill="#FFC107"/><path d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3c-7.2 0-13 5.8-13 13 0 1.6.3 3.1.8 4.7z" fill="#FF3D00"/><path d="M24 45c5.1 0 9.8-1.7 13.4-4.7l-6.2-5.1C29.5 36.9 26.9 38 24 38c-6.1 0-10.7-3.3-11.7-8.5H6.2C8.6 40.2 15.7 45 24 45z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.7c-1.1 3.2-4.2 5.5-7.7 5.5-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.1 0 4 .7 5.5 2.1l6.6-6.6C36.7 7.1 30.7 4 24 4 12.4 4 3 13.4 3 25s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5.1-.7.1-1.3.1-2 0-1.3-.1-2.5-.3-3.5z" fill="#1976D2"/></g></svg>
            Continue with Google
          </Button>
          {/* Forgot password form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className={`pl-10 h-12 rounded-xl border-2 transition-all focus:ring-2 focus:ring-primary/40 ${error ? 'border-destructive' : 'border-input hover:border-ring focus:border-ring'}`}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <p className="text-sm text-muted-foreground">
                We'll send a password reset link to this email address.
              </p>
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full primary-button text-lg py-6 rounded-2xl font-semibold shadow-strong transition-all"
              whileHover={{ scale: 1.03, boxShadow: '0 4px 24px #00b4d8' }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>

          {/* Floating back to login text */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span
              className="text-primary hover:underline cursor-pointer font-medium transition-colors"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </span>
          </motion.div>

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