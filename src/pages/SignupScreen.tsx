import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Eye, EyeOff, Mail, User, Lock, AlertCircle, RotateCcw, Loader2 } from 'lucide-react'; // Added AlertCircle, RotateCcw, Loader2
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Added DialogFooter
  DialogClose
} from '@/components/ui/dialog';
import { GoogleOAuthModal } from '@/components/ui/GoogleOAuthModal';
import { supabase } from '@/integrations/supabase/client'; // For resend email

const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [googleOpen, setGoogleOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false); // New state for modal
  const [isResendingEmail, setIsResendingEmail] = useState(false); // State for resend button
  const termsRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: 'Please agree to the terms & conditions',
        description: 'You must agree to the terms & conditions to create an account.',
        variant: 'destructive',
      });
      termsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!validateForm()) return;

    try {
      await signup(formData.email, formData.password, formData.name);
      // Don't toast or navigate immediately. Show verification modal instead.
      setShowVerificationModal(true);
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    }
  };

  const handleResendVerificationEmail = async () => {
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification`
        }
      });
      if (error) throw error;
      toast({
        title: 'Verification Email Resent',
        description: `A new verification email has been sent to ${formData.email}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Resend Email',
        description: error.message || "An error occurred. Please try again.", // More generic error
        variant: "destructive",
      });
    } finally { // Ensure finally block is here
      setIsResendingEmail(false);
    }
  };

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
          onClick={() => navigate('/welcome')}
          className="hover:bg-hover"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join FluxPense and start tracking your expenses</p>
          </div>
          {/* Google button */}
          <Button type="button" className="w-full mb-6 flex items-center justify-center gap-2 bg-white text-foreground border border-input shadow hover:bg-muted font-semibold py-3 rounded-xl" onClick={() => setGoogleOpen(true)}>
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path d="M44.5 20H24v8.5h11.7C34.7 33.7 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5.1-.7.1-1.3.1-2 0-1.3-.1-2.5-.3-3.5z" fill="#FFC107"/><path d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3c-7.2 0-13 5.8-13 13 0 1.6.3 3.1.8 4.7z" fill="#FF3D00"/><path d="M24 45c5.1 0 9.8-1.7 13.4-4.7l-6.2-5.1C29.5 36.9 26.9 38 24 38c-6.1 0-10.7-3.3-11.7-8.5H6.2C8.6 40.2 15.7 45 24 45z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.7c-1.1 3.2-4.2 5.5-7.7 5.5-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.1 0 4 .7 5.5 2.1l6.6-6.6C36.7 7.1 30.7 4 24 4 12.4 4 3 13.4 3 25s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5.1-.7.1-1.3.1-2 0-1.3-.1-2.5-.3-3.5z" fill="#1976D2"/></g></svg>
            Continue with Google
          </Button>
          <GoogleOAuthModal open={googleOpen} onOpenChange={setGoogleOpen} onSuccess={() => { toast({ title: 'Signed up with Google!', description: 'Welcome to FluxPense.' }); navigate('/onboarding'); }} />
          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`pl-10 h-12 rounded-xl border-2 transition-all focus:ring-2 focus:ring-primary/40 ${errors.name ? 'border-destructive' : 'border-input hover:border-ring focus:border-ring'}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </motion.div>

            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`pl-10 h-12 rounded-xl border-2 transition-all focus:ring-2 focus:ring-primary/40 ${errors.email ? 'border-destructive' : 'border-input hover:border-ring focus:border-ring'}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </motion.div>

            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`pl-10 h-12 rounded-xl border-2 pr-12 transition-all focus:ring-2 focus:ring-primary/40 ${errors.password ? 'border-destructive' : 'border-input hover:border-ring focus:border-ring'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 flex items-center justify-center bg-transparent focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {/* Password requirements box */}
              <div className="mt-2 mb-1 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground space-y-1">
                <div className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                  {formData.password.length >= 8 ? '✓' : '•'} At least 8 characters
                </div>
                <div className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                  {/[A-Z]/.test(formData.password) ? '✓' : '•'} One uppercase letter
                </div>
                <div className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                  {/[a-z]/.test(formData.password) ? '✓' : '•'} One lowercase letter
                </div>
                <div className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                  {/\d/.test(formData.password) ? '✓' : '•'} One number
                </div>
                <div className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? 'text-green-600' : ''}>
                  {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? '✓' : '•'} One symbol
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </motion.div>

            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`pl-10 h-12 rounded-xl border-2 pr-12 transition-all focus:ring-2 focus:ring-primary/40 ${errors.confirmPassword ? 'border-destructive' : 'border-input hover:border-ring focus:border-ring'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 flex items-center justify-center bg-transparent focus:outline-none"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </motion.div>

            <motion.div className="flex items-center space-x-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} ref={termsRef}>
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={checked => setAgreedToTerms(checked === true)} />
              <Dialog>
                <DialogTrigger asChild>
                  <Label htmlFor="terms" className="text-muted-foreground text-sm cursor-pointer">
                    I agree to the <span className="underline text-primary">terms & conditions</span>
                  </Label>
                </DialogTrigger>
                <DialogContent>
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <DialogHeader>
                      <DialogTitle>Terms & Conditions</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="max-h-60 overflow-y-auto text-left text-foreground">
                        <p className="mb-4">Welcome to FluxPense! Please read these terms and conditions carefully before using our app.</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Your data is securely stored and never shared without your consent.</li>
                          <li>By creating an account, you agree to our privacy policy and responsible usage.</li>
                          <li>FluxPense is not responsible for financial decisions made based on app insights.</li>
                          <li>For full details, visit our website or contact support.</li>
                        </ul>
                        <p className="mt-4 text-xs text-muted-foreground">This is a sample. Replace with your real terms.</p>
                      </div>
                    </DialogDescription>
                    <DialogClose asChild>
                      <Button className="mt-4 w-full">Close</Button>
                    </DialogClose>
                  </motion.div>
                </DialogContent>
              </Dialog>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <motion.button
                type="submit"
                className="w-full primary-button text-lg py-6 rounded-2xl font-semibold shadow-strong transition-all"
                whileHover={{ scale: 1.03, boxShadow: '0 4px 24px #00b4d8' }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing Up...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Floating back to login text */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <span
                className="text-primary hover:underline cursor-pointer font-medium transition-colors"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">Verify Your Email</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-2">
              An email has been sent to <span className="font-semibold text-foreground">{formData.email}</span>.
              Please click the link in the email to verify your account and complete your signup.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerificationEmail}
              disabled={isResendingEmail}
              className="w-full"
            >
              {isResendingEmail ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="mr-2 h-4 w-4" />
              )}
              Resend Email
            </Button>
            <Button
              type="button"
              className="w-full primary-button"
              onClick={() => {
                setShowVerificationModal(false); // Close the modal
                navigate('/email-verification', { state: { email: formData.email } }); // Navigate
              }}
            >
              I've Verified My Email
            </Button>
          </DialogFooter>
           {/* Add a close button to the dialog content if not relying on overlay click or Esc,
               or ensure onOpenChange handles all close events appropriately if user should go to /login.
               For now, this setup means closing via Esc/Overlay will just hide the modal without navigation.
               The "I've Verified" button handles its own navigation.
               If the requirement is that *any* close of this modal (Esc, overlay) goes to /login,
               then the original onOpenChange was better, but the "I've Verified" button needed to stop propagation
               or use a flag to prevent the /login navigation.
               This simpler onOpenChange={setShowVerificationModal} means only explicit button actions cause navigation.
            */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignupScreen;