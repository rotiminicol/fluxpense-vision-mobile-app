import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import dashboard3dElements from '@/assets/dashboard-3d-elements.png';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-primary/5 flex flex-col relative overflow-hidden pb-10">
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

      {/* Main content with entrance animation */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
        }}
      >
        {/* 3D Illustration Placeholder */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <img
            src={dashboard3dElements}
            alt="Finance 3D Illustration"
            className="w-32 h-32 md:w-44 md:h-44 rounded-2xl shadow-2xl object-contain"
            style={{ filter: 'drop-shadow(0 8px 32px rgba(31,38,135,0.18))' }}
          />
        </motion.div>

        {/* Welcome content */}
        <motion.div
          className="max-w-md mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="text-gradient">FluxPense</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Take control of your finances with our smart expense tracking solution. 
            Scan receipts, categorize expenses, and get actionable insights.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-8 mb-20 w-full max-w-md mx-auto">
            {/* Feature 1 */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold text-foreground">Smart Receipt Scanning</h3>
              <p className="text-sm text-muted-foreground">AI-powered OCR extraction</p>
            </div>
            {/* Feature 2 */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold text-foreground">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">Track spending patterns</p>
            </div>
            {/* Feature 3 */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold text-foreground">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">Bank-level security</p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons with animation */}
        <motion.div
          className="w-full max-w-sm space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97, boxShadow: '0 4px 24px #00b4d8' }}>
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="w-full primary-button text-lg py-6 rounded-2xl font-semibold shadow-strong"
            >
              Get Started
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="lg"
              className="w-full text-lg py-6 rounded-2xl font-medium border-2 hover:bg-hover"
            >
              I Already Have an Account
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;