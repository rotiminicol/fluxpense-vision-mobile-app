import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary/5 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header with back button */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="hover:bg-hover"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <div className="mb-12 animate-bounce-in">
          <img 
            src={fluxpenseLogo} 
            alt="FluxPense" 
            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-medium"
          />
        </div>

        {/* Welcome content */}
        <div className="max-w-md mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="text-gradient">FluxPense</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Take control of your finances with our smart expense tracking solution. 
            Scan receipts, categorize expenses, and get actionable insights.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-center text-left">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Smart Receipt Scanning</h3>
                <p className="text-sm text-muted-foreground">AI-powered OCR extraction</p>
              </div>
            </div>

            <div className="flex items-center justify-center text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">Track spending patterns</p>
              </div>
            </div>

            <div className="flex items-center justify-center text-left">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">Bank-level security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-sm space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={() => navigate('/signup')}
            size="lg"
            className="w-full primary-button text-lg py-6 rounded-2xl font-semibold"
          >
            Get Started
          </Button>
          
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            size="lg"
            className="w-full text-lg py-6 rounded-2xl font-medium border-2 hover:bg-hover"
          >
            I Already Have an Account
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of users</p>
          <div className="flex items-center justify-center space-x-6 text-muted-foreground">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-warning mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm">4.8/5 Rating</span>
            </div>
            <div className="text-sm">256-bit Encryption</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;