import React, { useState } from 'react';
import { DialogRoot, DialogContent, DialogOverlay, DialogClose } from './dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoogleOAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="overflow-visible p-0 bg-transparent border-none shadow-none [&_.absolute.right-4.top-4]:hidden">
        <AnimatePresence mode="wait">
          {!isLoading ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-[350px] max-w-full mx-auto flex flex-col items-center relative"
            >
              <DialogClose asChild>
                <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
                  <X className="w-5 h-5 text-gray-500" />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
              <svg className="w-10 h-10 mb-4" viewBox="0 0 48 48"><g><path d="M44.5 20H24v8.5h11.7C34.7 33.7 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5.1-.7.1-1.3.1-2 0-1.3-.1-2.5-.3-3.5z" fill="#FFC107"/><path d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3c-7.2 0-13 5.8-13 13 0 1.6.3 3.1.8 4.7z" fill="#FF3D00"/><path d="M24 45c5.1 0 9.8-1.7 13.4-4.7l-6.2-5.1C29.5 36.9 26.9 38 24 38c-6.1 0-10.7-3.3-11.7-8.5H6.2C8.6 40.2 15.7 45 24 45z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.7c-1.1 3.2-4.2 5.5-7.7 5.5-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.1 0 4 .7 5.5 2.1l6.6-6.6C36.7 7.1 30.7 4 24 4 12.4 4 3 13.4 3 25s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5.1-.7.1-1.3.1-2 0-1.3-.1-2.5-.3-3.5z" fill="#1976D2"/></g></svg>
              <div className="font-semibold text-lg mb-2">Sign in with Google</div>
              <div className="text-sm text-gray-500 mb-6">Continue to FluxPense with your Google account</div>
              
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mb-4"
              >
                Continue with Google
              </Button>
              
              <DialogClose asChild>
                <Button variant="ghost" className="w-full">Cancel</Button>
              </DialogClose>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-[350px] max-w-full mx-auto flex flex-col items-center"
            >
              <svg className="w-10 h-10 mb-4 animate-spin" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="#1976D2" strokeWidth="4" strokeDasharray="31.4 31.4" /></svg>
              <div className="font-semibold text-lg mb-1">Signing you in...</div>
              <div className="text-sm text-gray-500 mb-2">Please wait while we connect to Google</div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </DialogRoot>
  );
}; 