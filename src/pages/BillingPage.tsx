import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Check, 
  Crown, 
  Zap,
  Shield,
  Star,
  Calendar,
  Download
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';

const BillingPage: React.FC = () => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 50 expenses per month',
        'Basic expense categories',
        'Monthly reports',
        'Receipt scanning (5/month)',
        'Email support'
      ],
      current: true,
      recommended: false,
      icon: Shield
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'For serious expense tracking',
      features: [
        'Unlimited expenses',
        'Advanced analytics & insights',
        'Unlimited receipt scanning',
        'Email receipt forwarding',
        'Budget goal tracking',
        'Export to Excel/PDF',
        'Priority support',
        'Multiple account sync'
      ],
      current: false,
      recommended: true,
      icon: Crown
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: 'per month',
      description: 'For teams and businesses',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin dashboard',
        'Custom categories',
        'API access',
        'Advanced security',
        'Dedicated account manager',
        'Custom integrations'
      ],
      current: false,
      recommended: false,
      icon: Zap
    }
  ];

  const billingHistory = [
    {
      id: '1',
      date: '2024-01-01',
      description: 'FluxPense Pro - Monthly',
      amount: '$9.99',
      status: 'paid'
    },
    {
      id: '2',
      date: '2023-12-01',
      description: 'FluxPense Pro - Monthly',
      amount: '$9.99',
      status: 'paid'
    },
    {
      id: '3',
      date: '2023-11-01',
      description: 'FluxPense Pro - Monthly',
      amount: '$9.99',
      status: 'paid'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-surface pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={fluxpenseLogo} 
              alt="FluxPense" 
              className="w-8 h-8 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Billing & Plans</h1>
              <p className="text-sm text-muted-foreground">Manage your subscription</p>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="animate-fade-in-up">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-primary rounded-xl text-white">
                <div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Free Plan</h3>
                  </div>
                  <p className="text-white/80 mt-1">Perfect for getting started</p>
                  <p className="text-sm text-white/60 mt-2">
                    23 of 50 expenses used this month
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Available Plans */}
        <div className="space-y-4 mt-8">
          <h2 className="text-lg font-bold text-foreground">Choose Your Plan</h2>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1, type: 'spring' }}
              className={`transition-all duration-300 hover:shadow-2xl ${plan.recommended ? 'border-primary shadow-primary/20' : ''} ${plan.current ? 'bg-primary/5 border-primary' : ''}`}
              style={{ perspective: 1000 }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.id === 'free' ? 'bg-primary/10' :
                        plan.id === 'pro' ? 'bg-warning/10' :
                        'bg-success/10'
                      }`}>
                        <plan.icon className={`w-5 h-5 ${
                          plan.id === 'free' ? 'text-primary' :
                          plan.id === 'pro' ? 'text-warning' :
                          'text-success'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                          {plan.recommended && (
                            <Badge className="bg-primary text-primary-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          {plan.current && (
                            <Badge variant="secondary">Current Plan</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <Check className="w-4 h-4 text-success flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="ml-4">
                    {plan.current ? (
                      <Button variant="outline" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        variant={plan.recommended ? "default" : "outline"}
                        className={plan.recommended ? "bg-gradient-primary" : ""}
                      >
                        {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          ))}
        </div>
        {/* Add New Card Button */}
        <motion.button
          className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-semibold text-lg shadow-2xl hover:scale-105 focus:scale-100 transition-transform duration-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: 'spring', bounce: 0.4 }}
          style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}
        >
          + Add New Card
        </motion.button>
        {/* Loading animation for transactions */}
        <motion.div
          className="flex items-center justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="inline-block w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span className="ml-3 text-muted-foreground">Loading transactions...</span>
        </motion.div>
      </main>
      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4, type: 'spring' }}
        className="z-50"
      >
        <BottomNavigation onQuickAdd={() => {}} />
      </motion.div>
    </div>
  );
};

export default BillingPage;