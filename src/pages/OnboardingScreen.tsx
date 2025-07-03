import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';

interface OnboardingData {
  monthlyIncome: string;
  monthlyBudget: string;
  categories: string[];
  currency: string;
  goals: string[];
  preferences: {
    notifications: boolean;
    autoCategories: boolean;
    receiptReminders: boolean;
  };
}

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeOnboarding } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    monthlyIncome: '',
    monthlyBudget: '',
    categories: [],
    currency: 'USD',
    goals: [],
    preferences: {
      notifications: true,
      autoCategories: true,
      receiptReminders: true
    }
  });

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const categoryOptions = [
    '🍔 Food & Dining', '⛽ Transportation', '🛍️ Shopping', '🏠 Bills & Utilities',
    '🎬 Entertainment', '💊 Healthcare', '✈️ Travel', '📚 Education',
    '💼 Business', '🎁 Gifts & Donations', '💰 Investments', '🔧 Maintenance'
  ];

  const goalOptions = [
    '💰 Build Emergency Fund', '🏠 Save for House', '✈️ Plan Vacation',
    '🚗 Buy a Car', '📚 Pay Off Debt', '💼 Start Business',
    '🎓 Education Fund', '💍 Wedding Planning'
  ];

  const currencyOptions = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    localStorage.setItem('fluxpense_onboarding', JSON.stringify(data));
    toast({
      title: "Setup Complete!",
      description: "Welcome to FluxPense. Let's start tracking your expenses!",
    });
    navigate('/dashboard');
  };

  const toggleCategory = (category: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">What's your monthly income?</h2>
            <p className="text-muted-foreground mb-8">This helps us create a personalized budget for you</p>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="5000"
                  value={data.monthlyIncome}
                  onChange={(e) => setData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  className="h-14 text-lg text-center border-2 rounded-2xl"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-muted-foreground">
                  {currencyOptions.find(c => c.code === data.currency)?.symbol}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Don't worry, you can change this later</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Set your monthly budget</h2>
            <p className="text-muted-foreground mb-8">How much do you want to spend each month?</p>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="3000"
                  value={data.monthlyBudget}
                  onChange={(e) => setData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
                  className="h-14 text-lg text-center border-2 rounded-2xl"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-muted-foreground">
                  {currencyOptions.find(c => c.code === data.currency)?.symbol}
                </span>
              </div>
              {data.monthlyIncome && data.monthlyBudget && (
                <p className="text-sm text-muted-foreground">
                  This leaves {currencyOptions.find(c => c.code === data.currency)?.symbol}
                  {(parseFloat(data.monthlyIncome) - parseFloat(data.monthlyBudget)).toLocaleString()} for savings
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Choose your expense categories</h2>
            <p className="text-muted-foreground mb-8">Select the categories you spend money on most often</p>
            
            <div className="grid grid-cols-2 gap-3">
              {categoryOptions.map((category) => (
                <Badge
                  key={category}
                  variant={data.categories.includes(category) ? "default" : "outline"}
                  className={`p-3 cursor-pointer transition-all hover:scale-105 ${
                    data.categories.includes(category)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Selected {data.categories.length} categories
            </p>
          </div>
        );

      case 4:
        return (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Select your currency</h2>
            <p className="text-muted-foreground mb-8">Choose your preferred currency for tracking expenses</p>
            
            <div className="grid grid-cols-2 gap-3">
              {currencyOptions.map((currency) => (
                <div
                  key={currency.code}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                    data.currency === currency.code
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-ring'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, currency: currency.code }))}
                >
                  <div className="text-2xl font-bold">{currency.symbol}</div>
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-sm text-muted-foreground">{currency.name}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-investment/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-investment" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">What are your financial goals?</h2>
            <p className="text-muted-foreground mb-8">Select goals to help us track your progress</p>
            
            <div className="grid grid-cols-1 gap-3">
              {goalOptions.map((goal) => (
                <Badge
                  key={goal}
                  variant={data.goals.includes(goal) ? "default" : "outline"}
                  className={`p-4 cursor-pointer transition-all hover:scale-[1.02] text-left ${
                    data.goals.includes(goal)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Selected {data.goals.length} goals
            </p>
          </div>
        );

      case 6:
        return (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">You're all set!</h2>
            <p className="text-muted-foreground mb-8">Your FluxPense account is ready to help you track expenses</p>
            
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-2xl p-6 text-left">
                <h3 className="font-semibold text-foreground mb-4">Your Setup Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Income:</span>
                    <span className="font-medium">
                      {currencyOptions.find(c => c.code === data.currency)?.symbol}
                      {data.monthlyIncome ? parseFloat(data.monthlyIncome).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Budget:</span>
                    <span className="font-medium">
                      {currencyOptions.find(c => c.code === data.currency)?.symbol}
                      {data.monthlyBudget ? parseFloat(data.monthlyBudget).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categories:</span>
                    <span className="font-medium">{data.categories.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Goals:</span>
                    <span className="font-medium">{data.goals.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency:</span>
                    <span className="font-medium">{data.currency}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-success/5 rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Ready to start tracking!</h3>
                <p className="text-sm text-muted-foreground">
                  Take a photo of your first receipt or manually add an expense to get started.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
        <div className="flex items-center">
          {currentStep > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-hover mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )}
          <img 
            src={fluxpenseLogo} 
            alt="FluxPense" 
            className="w-8 h-8 rounded-lg"
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mb-8">
        <Progress value={progressPercentage} className="h-2 bg-muted" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-6">
        <div className="w-full max-w-md">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="w-full max-w-md mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={handleNext}
            className="w-full primary-button text-lg py-6 rounded-2xl font-semibold"
            disabled={
              (currentStep === 1 && !data.monthlyIncome) ||
              (currentStep === 2 && !data.monthlyBudget) ||
              (currentStep === 3 && data.categories.length === 0)
            }
          >
            {currentStep === totalSteps ? (
              <>
                Complete Setup
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {currentStep < totalSteps && (
            <Button
              variant="ghost"
              onClick={() => handleComplete()}
              className="w-full mt-4 text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;