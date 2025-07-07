
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';

const BillingPage: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPlan, setCurrentPlan] = useState('Free');

  // Mock subscription data - in real app this would come from a payment provider
  const subscriptionPlans = [
    {
      name: 'Free',
      price: 0,
      features: ['Up to 50 expenses/month', 'Basic reports', 'Email support'],
      current: true
    },
    {
      name: 'Pro',
      price: 9.99,
      features: ['Unlimited expenses', 'Advanced reports', 'Receipt scanning', 'Priority support'],
      current: false
    },
    {
      name: 'Business',
      price: 19.99,
      features: ['Everything in Pro', 'Team collaboration', 'Custom categories', 'API access'],
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-surface pb-20 flex flex-col">
      {/* Header */}
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between w-full bg-white/70 backdrop-blur shadow-lg px-3 py-2 mb-2 max-w-md mx-auto rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
              <img src={fluxpenseLogo} alt="FluxPense" className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base font-extrabold text-blue-700 leading-tight">Billing</span>
              <span className="text-xs text-muted-foreground mt-0.5">Manage subscription</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 pb-4 px-4 pt-2 max-w-md mx-auto w-full">
        {/* Current Plan */}
        <Card className="bg-white/80 backdrop-blur mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-blue-700">{currentPlan}</h3>
                <p className="text-xs text-muted-foreground">
                  {currentPlan === 'Free' ? 'No billing required' : `$${subscriptionPlans.find(p => p.name === currentPlan)?.price}/month`}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Active
              </Badge>
            </div>
            {currentPlan === 'Free' && (
              <Button className="w-full mt-3 bg-blue-500 hover:bg-blue-600">
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="space-y-3 mb-4">
          <h3 className="text-sm font-semibold text-blue-700 px-1">Available Plans</h3>
          {subscriptionPlans.map((plan) => (
            <Card key={plan.name} className={`bg-white/80 backdrop-blur ${plan.current ? 'border-blue-500' : ''}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-blue-700">{plan.name}</h4>
                    <p className="text-sm font-bold">
                      {plan.price === 0 ? 'Free' : `$${plan.price}/month`}
                    </p>
                  </div>
                  {plan.current ? (
                    <Badge variant="default" className="bg-blue-500">Current</Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      {plan.price > (subscriptionPlans.find(p => p.current)?.price || 0) ? 'Upgrade' : 'Downgrade'}
                    </Button>
                  )}
                </div>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing History */}
        <Card className="bg-white/80 backdrop-blur mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {transactions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-center py-8"
              >
                <CreditCard className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                <h4 className="font-semibold text-blue-700 mb-1">No Transactions</h4>
                <p className="text-xs text-muted-foreground">
                  Your billing history will appear here once you make a purchase.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction: any, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Plan Upgrade</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">${transaction.amount}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">••••</span>
                </div>
                <span className="text-sm text-muted-foreground">No payment method added</span>
              </div>
              <Button variant="outline" size="sm">
                Add Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation onQuickAdd={() => {}} />
    </div>
  );
};

export default BillingPage;
