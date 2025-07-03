import React, { useState, useRef, useEffect } from 'react';
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
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { motion } from 'framer-motion';
import receiptScanning3d from '@/assets/receipt-scanning-3d.png';
import dashboard3dElements from '@/assets/dashboard-3d-elements.png';
import onboarding3dIllustration from '@/assets/onboarding-3d-illustration.png';
import type { Swiper as SwiperType } from 'swiper';

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

const onboardingSlides = [
  {
    type: 'intro',
    title: "Scan Receipts Instantly",
    desc: "Snap a photo and let AI extract your expenses in seconds.",
    illustration: receiptScanning3d,
  },
  {
    type: 'intro',
    title: "Visualize Your Spending",
    desc: "Get real-time analytics and insights with beautiful charts.",
    illustration: dashboard3dElements,
  },
  {
    type: 'intro',
    title: "Stay in Control",
    desc: "Set budgets, track goals, and receive smart reminders.",
    illustration: onboarding3dIllustration,
  },
  {
    type: 'currency',
    title: "Choose Your Main Currency",
    desc: "Select the currency you use most often.",
    illustration: dashboard3dElements,
  },
  {
    type: 'categories',
    title: "Pick Your Top Categories",
    desc: "What do you spend on most? Select a few to personalize your dashboard.",
    illustration: receiptScanning3d,
  },
  {
    type: 'goals',
    title: "Set Your First Financial Goal",
    desc: "Choose a goal to start tracking your progress.",
    illustration: onboarding3dIllustration,
  },
];

// Tips and badges for steps 1-3
const onboardingTips = [
  {
    tip: "No manual entry needed!",
    badge: "AI Powered",
    badgeColor: "bg-primary/90 text-white",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    )
  },
  {
    tip: "See your spending at a glance!",
    badge: "Instant Charts",
    badgeColor: "bg-success/90 text-white",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 19V6a1 1 0 0 1 2 0v13m-7-7v7a1 1 0 0 0 2 0v-7m10 4v3a1 1 0 0 0 2 0v-3" /></svg>
    )
  },
  {
    tip: "Stay on top of your goals!",
    badge: "Smart Reminders",
    badgeColor: "bg-warning/90 text-white",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /></svg>
    )
  },
];

const onboardingHowItWorks = [
  'Just snap a photo of your receipt and our AI will do the rest. No more manual entry!',
  'See your spending breakdown instantly with interactive charts and graphs.',
  'Set budgets, get reminders, and always know where your money goes.'
];

const onboardingFunFacts = [
  'Over 80% of users save time with receipt scanning!',
  'Visual feedback helps you spot trends 2x faster.',
  'Users who set goals are 3x more likely to stay on budget.'
];

const currencyFunFact = 'You can always change your main currency later in Settings.';
const currencyMostPopular = 'USD'; // For demo, could use locale detection

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeOnboarding } = useAuth();
  const [swiperIndex, setSwiperIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
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
  const progressPercentage = (swiperIndex / totalSteps) * 100;

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
    if (swiperIndex < totalSteps - 1) {
      setSwiperIndex(swiperIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (swiperIndex > 0) {
      setSwiperIndex(swiperIndex - 1);
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

  // Sync Swiper UI with swiperIndex
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(swiperIndex);
    }
  }, [swiperIndex]);

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
          {swiperIndex > 0 && (
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
          Step {swiperIndex + 1} of {totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mb-8">
        <Progress value={progressPercentage} className="h-2 bg-muted" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-6 w-full min-h-[70vh]">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Swiper for onboarding slides */}
          <Swiper
            spaceBetween={32}
            slidesPerView={1}
            onSlideChange={(swiper) => setSwiperIndex(swiper.activeIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="mb-8"
          >
            {onboardingSlides.map((slide, idx) => (
              <SwiperSlide key={slide.title}>
                <motion.div
                  className={`flex flex-col items-center text-center justify-center min-h-[75vh] ${slide.type === 'intro' || slide.type === 'currency' ? 'pt-28' : ''} ${slide.type === 'intro' ? 'py-12' : ''}`}
                  style={slide.type === 'intro' ? { minHeight: '75vh' } : {}}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  {/* Illustration with background shape and floating badge for steps 1-3 */}
                  {slide.type === 'intro' ? (
                    <div className="relative flex flex-col items-center w-full mb-8">
                      {/* Subtle background shape */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 bg-primary/10 rounded-full blur-2xl z-0" />
                      <img
                        src={slide.illustration}
                        alt={slide.title}
                        className="w-40 h-40 md:w-56 md:h-56 rounded-2xl shadow-2xl object-contain relative z-10"
                      />
                      {/* Floating badge */}
                      <div className={`absolute -top-4 right-1/2 translate-x-16 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg text-sm font-semibold ${onboardingTips[idx].badgeColor} z-20 animate-float`}
                        style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                      >
                        {onboardingTips[idx].icon}
                        {onboardingTips[idx].badge}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={slide.illustration}
                      alt={slide.title}
                      className="w-40 h-40 md:w-56 md:h-56 mb-8 rounded-2xl shadow-2xl object-contain"
                    />
                  )}
                  <h2 className="text-2xl font-bold text-foreground mb-4">{slide.title}</h2>
                  <p className="text-muted-foreground mb-4 text-lg">{slide.desc}</p>
                  {/* Bold tip for steps 1-3 */}
                  {slide.type === 'intro' && (
                    <>
                      <div className="mb-2">
                        <span className="inline-block text-sm font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-lg animate-fade-in-up" style={{ animationDelay: `${0.35 + idx * 0.1}s` }}>
                          How it works: {onboardingHowItWorks[idx]}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center justify-center gap-2 animate-fade-in-up" style={{ animationDelay: `${0.4 + idx * 0.1}s` }}>
                        <svg className="w-5 h-5 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-3.09 1.636.588-3.43L5 10.364l3.454-.502L10 6.5l1.546 3.362L15 10.364l-2.498 2.842.588 3.43z" /></svg>
                        <span className="text-xs text-muted-foreground">Did you know? {onboardingFunFacts[idx]}</span>
                      </div>
                    </>
                  )}
                  {/* Interactive slides for steps 4-6 */}
                  {slide.type === 'currency' && (
                    <>
                      <div className="relative w-full flex flex-col items-center mb-4">
                        {/* World/currency icon background */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-primary/40 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2" /></svg>
                        </div>
                        <Label htmlFor="currency" className="mb-2 text-lg font-medium relative z-10">Currency</Label>
                        <select
                          id="currency"
                          className="w-full max-w-xs h-12 rounded-xl border-2 border-input bg-white/80 text-foreground px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/40 relative z-10"
                          value={data.currency}
                          onChange={e => setData(d => ({ ...d, currency: e.target.value }))}
                        >
                          {currencyOptions.map(opt => (
                            <option key={opt.code} value={opt.code}>{opt.symbol} {opt.name}</option>
                          ))}
                        </select>
                        <div className="mt-2 text-xs text-muted-foreground relative z-10">
                          <span className="font-semibold text-primary">Most popular:</span> {currencyMostPopular}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground relative z-10">
                          Why choose the right currency? It helps you track your finances more accurately and avoid confusion.
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground relative z-10 animate-fade-in-up">
                          <svg className="w-4 h-4 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-3.09 1.636.588-3.43L5 10.364l3.454-.502L10 6.5l1.546 3.362L15 10.364l-2.498 2.842.588 3.43z" /></svg>
                          <span>{currencyFunFact}</span>
                        </div>
                      </div>
                    </>
                  )}
                  {slide.type === 'categories' && (
                    <div className="w-full flex flex-col items-center mb-4">
                      <Label className="mb-2 text-lg font-medium">Categories</Label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {categoryOptions.map(cat => (
                          <Badge
                            key={cat}
                            className={`cursor-pointer px-4 py-2 rounded-xl text-base ${data.categories.includes(cat) ? 'bg-primary text-white' : 'bg-muted-foreground/10 text-foreground'}`}
                            onClick={() => toggleCategory(cat)}
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {slide.type === 'goals' && (
                    <div className="w-full flex flex-col items-center mb-4">
                      <Label className="mb-2 text-lg font-medium">Goal</Label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {goalOptions.map(goal => (
                          <Badge
                            key={goal}
                            className={`cursor-pointer px-4 py-2 rounded-xl text-base ${data.goals.includes(goal) ? 'bg-primary text-white' : 'bg-muted-foreground/10 text-foreground'}`}
                            onClick={() => toggleGoal(goal)}
                          >
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Progress indicator */}
          <div className="flex justify-center items-center mb-8 space-x-2">
            {onboardingSlides.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === swiperIndex
                    ? 'bg-primary shadow-lg scale-110'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          {/* Swipe gesture prompt */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-muted-foreground text-sm">Swipe to continue</span>
          </motion.div>
          {/* CTA button */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', bounce: 0.4 }}
          >
            <Button
              size="lg"
              className="w-full primary-button text-lg py-6 rounded-2xl font-semibold shadow-strong"
              onClick={() => {
                if (swiperIndex < onboardingSlides.length - 1) {
                  setSwiperIndex(swiperIndex + 1);
                  swiperRef.current?.slideNext();
                } else {
                  completeOnboarding();
                  navigate('/dashboard');
                }
              }}
            >
              {swiperIndex < onboardingSlides.length - 1 ? 'Next' : "Let's Get Started"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingScreen;