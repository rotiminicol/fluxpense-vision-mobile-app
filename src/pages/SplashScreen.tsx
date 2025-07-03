import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Auto-redirect authenticated users after 2 seconds
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        if (user?.isFirstLogin) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  const handleContinue = () => {
    if (isAuthenticated) {
      if (user?.isFirstLogin) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/welcome');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      {/* Main content */}
      <div className="z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div className="mb-12 animate-bounce-in">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-110"></div>
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full shadow-strong"
            />
          </div>
        </div>

        {/* App name and tagline */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            FluxPense
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-md">
            Smart Expense Tracking
          </p>
          <p className="text-lg text-white/70 mt-2 max-w-sm">
            Scan receipts, track expenses, and gain financial insights
          </p>
        </div>

        {/* Features preview */}
        <div className="mb-16 grid grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-white/80 text-sm">Scan Receipts</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-white/80 text-sm">Track Expenses</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-white/80 text-sm">Get Insights</p>
          </div>
        </div>

        {/* Continue button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <Button 
            onClick={handleContinue}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-12 py-4 text-lg rounded-2xl shadow-strong hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {isAuthenticated ? 'Continue to App' : 'Get Started'}
          </Button>
        </div>

        {/* Loading indicator for authenticated users */}
        {isAuthenticated && (
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center text-white/70">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span className="text-sm">Loading your dashboard...</span>
            </div>
          </div>
        )}
      </div>

      {/* Version info */}
      <div className="absolute bottom-6 text-white/50 text-sm animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
        Version 1.0.0
      </div>
    </div>
  );
};

export default SplashScreen;