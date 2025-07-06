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
  Download,
  Bell
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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

  const billingHistory: any[] = []; // Start with empty billing history

  const [cards, setCards] = React.useState<any[]>([]); // Start with no cards
  const [addCardOpen, setAddCardOpen] = React.useState(false);
  const [paymentStep, setPaymentStep] = React.useState<1 | 2 | 3 | 4 | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);
  const [cardForm, setCardForm] = React.useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    isDefault: false
  });
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);

  function handleAddCard() {
    setCards([...cards, {
      id: (cards.length + 1).toString(),
      brand: 'Visa', // This will be updated by the preview
      last4: cardForm.number.slice(-4),
      name: cardForm.name,
      expiry: cardForm.expiry,
      isDefault: cardForm.isDefault
    }]);
    setAddCardOpen(false);
    setCardForm({ number: '', expiry: '', cvc: '', name: '', isDefault: false });
  }
  function handleRemoveCard(id: string) {
    setCards(cards.filter(c => c.id !== id));
  }
  function openPaymentFlow(planId: string) {
    setSelectedPlan(planId);
    setPaymentStep(1);
  }
  function closePaymentFlow() {
    setPaymentStep(null);
    setSelectedPlan(null);
  }
  function nextStep() {
    setPaymentStep((s) => (s ? (s + 1) as 1 | 2 | 3 | 4 : null));
  }
  function prevStep() {
    setPaymentStep((s) => (s ? (s - 1) as 1 | 2 | 3 | 4 : null));
  }
  function handlePay() {
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 2000);
  }
  function handleDownloadInvoice(billId: string) {
    // Mock download: create a blob and trigger download
    const blob = new Blob([
      `Invoice for ${billId}\nThank you for your payment!`
    ], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${billId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
              <span className="text-base font-extrabold text-blue-700 leading-tight">Billing & Plans</span>
              <span className="text-xs text-muted-foreground mt-0.5">Manage your subscription</span>
            </div>
          </div>
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1.5 rounded-full hover:bg-blue-100 transition-colors focus:outline-none">
                <Bell className="w-5 h-5 text-blue-600" />
                
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
              <div className="p-2 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <div className="text-center text-muted-foreground py-4 text-sm">
                  No notifications yet
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-8 px-2 pt-2 max-w-md mx-auto w-full">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="flex items-center space-x-2 text-base">
                <CreditCard className="w-5 h-5" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-1">
              <div className="flex items-center justify-between p-3 bg-gradient-primary rounded-xl text-white">
                <div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-6 h-6" />
                    <h3 className="text-lg font-bold">Free Plan</h3>
                  </div>
                  <p className="text-white/80 mt-1">Perfect for getting started</p>
                  <p className="text-xs text-white/60 mt-2">23 of 50 expenses used this month</p>
                </div>
                <Button variant="secondary" size="sm">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Available Plans */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground mb-2">Choose Your Plan</h2>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1, type: 'spring' }}
              className={`mb-3 transition-all duration-300 hover:shadow-2xl ${plan.recommended ? 'border-primary shadow-primary/20' : ''} ${plan.current ? 'bg-primary/5 border-primary' : ''}`}
              style={{ perspective: 1000 }}
            >
              <CardContent className="p-4 bg-white/90 backdrop-blur rounded-xl shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plan.id === 'free' ? 'bg-primary/10' : plan.id === 'pro' ? 'bg-warning/10' : 'bg-success/10'}`}>
                        <plan.icon className={`w-5 h-5 ${plan.id === 'free' ? 'text-primary' : plan.id === 'pro' ? 'text-warning' : 'text-success'}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
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
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-lg font-bold text-foreground">{plan.price}</span>
                        <span className="text-xs text-muted-foreground">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 mb-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {!plan.current && (
                    <Button variant="default" size="sm" className="ml-2 mt-2" onClick={() => openPaymentFlow(plan.id)}>Select</Button>
                  )}
                </div>
              </CardContent>
            </motion.div>
          ))}
        </div>
        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardHeader className="pb-2 px-0 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-base">
                <CreditCard className="w-5 h-5" />
                <span>Payment Methods</span>
              </CardTitle>
              <Button size="sm" variant="outline" className="ml-auto" onClick={() => setAddCardOpen(true)}>Add Card</Button>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-1">
              <div className="space-y-2">
                {cards.length === 0 && <div className="text-xs text-muted-foreground">No cards added yet.</div>}
                {cards.map(card => (
                  <div key={card.id} className="flex items-center justify-between bg-white/90 rounded-lg p-2 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">{card.brand}</div>
                      <div className="text-xs text-muted-foreground">**** **** **** {card.last4}</div>
                      <div className="text-xs text-muted-foreground">{card.expiry}</div>
                      <div className="text-xs text-muted-foreground">{card.name}</div>
                      {card.isDefault && <Badge variant="secondary" className="ml-1">Default</Badge>}
                    </div>
                    <Button size="sm" variant="ghost" className="px-2 py-0.5 text-xs text-destructive" onClick={() => handleRemoveCard(card.id)}>Remove</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Add Card Modal */}
        {addCardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md mx-auto bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up min-h-[90vh] max-h-[95vh] p-0 overflow-hidden">
              {/* Close Icon */}
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-blue-600 text-2xl font-bold z-10" onClick={() => setAddCardOpen(false)} aria-label="Close">&times;</button>
              {/* Card Preview */}
              <div className="w-full flex flex-col items-center justify-center pt-6 pb-2">
                <div className="relative w-72 h-44 bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl shadow-lg flex flex-col justify-between p-5 mb-2 animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    {/* Card Brand Icon (placeholder only) */}
                    <span className="w-10 h-10" />
                    <span className="text-xs text-white/80 font-semibold">{cardForm.expiry || 'MM/YY'}</span>
                  </div>
                  <div className="flex flex-col items-start mt-6">
                    <span className="tracking-widest text-lg font-mono text-white mb-2">{cardForm.number ? cardForm.number.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}</span>
                    <span className="text-xs text-white/80">{cardForm.name || 'CARDHOLDER NAME'}</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-xs mx-auto px-6 pb-6 flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 180px)' }}>
                {/* Card Number */}
                <Input placeholder="Card Number" maxLength={16} value={cardForm.number} onChange={e => setCardForm(f => ({ ...f, number: e.target.value.replace(/\D/g, '') }))} className="rounded-lg text-center" />
                {cardForm.number && cardForm.number.length !== 16 && <span className="text-xs text-red-500">Card number must be 16 digits</span>}
                {/* Expiry & CVC */}
                <div className="flex gap-2">
                  <Input placeholder="MM/YY" maxLength={5} value={cardForm.expiry} onChange={e => setCardForm(f => ({ ...f, expiry: e.target.value }))} className="rounded-lg text-center" />
                  <Input placeholder="CVC" maxLength={4} value={cardForm.cvc} onChange={e => setCardForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, '') }))} className="rounded-lg text-center" />
                </div>
                {(cardForm.expiry && !/^\d{2}\/\d{2}$/.test(cardForm.expiry)) && <span className="text-xs text-red-500">Expiry must be MM/YY</span>}
                {(cardForm.cvc && cardForm.cvc.length < 3) && <span className="text-xs text-red-500">CVC must be at least 3 digits</span>}
                {/* Name */}
                <Input placeholder="Name on Card" value={cardForm.name} onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} className="rounded-lg text-center" />
                {cardForm.name && cardForm.name.length < 3 && <span className="text-xs text-red-500">Name is too short</span>}
                {/* Billing Address */}
                <Input placeholder="Billing Address (optional)" className="rounded-lg text-center" />
                {/* Save as Default */}
                <div className="flex items-center gap-2 mt-1">
                  <input type="checkbox" id="defaultCard" checked={cardForm.isDefault} onChange={e => setCardForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-blue-500" />
                  <label htmlFor="defaultCard" className="text-xs text-muted-foreground">Save as default card</label>
                </div>
                {/* Secure Payment Badge */}
                <div className="flex items-center gap-2 mt-2 mb-1 justify-center">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Your card is encrypted & secure</span>
                </div>
                {/* Add Card Button */}
                <Button className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-lg py-2 text-base shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all mx-auto disabled:opacity-60 sticky bottom-0" onClick={handleAddCard} disabled={cardForm.number.length !== 16 || !/^\d{2}\/\d{2}$/.test(cardForm.expiry) || cardForm.cvc.length < 3 || cardForm.name.length < 3}>Add Card</Button>
              </div>
            </div>
          </div>
        )}
        {/* Multi-step Full-Screen Payment Overlay */}
        {paymentStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md mx-auto bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in-up min-h-[90vh]">
              {/* Close button */}
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-blue-600 text-2xl font-bold z-10" onClick={closePaymentFlow} aria-label="Close">&times;</button>
              {/* Step 1: Plan Summary */}
              {paymentStep === 1 && selectedPlan && (
                <div className="flex flex-col h-full p-6 w-full max-w-xs mx-auto items-center justify-center text-center">
                  <div className="mb-6 w-full">
                    <div className="text-lg font-bold text-blue-700 mb-1">Confirm Your Plan</div>
                    <div className="text-xs text-muted-foreground mb-4">Review your selected plan before continuing.</div>
                    {plans.filter(p => p.id === selectedPlan).map(plan => (
                      <div key={plan.id} className="bg-white/90 rounded-xl p-4 shadow mb-2 mx-auto w-full">
                        <div className="flex items-center gap-3 mb-2 justify-center">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plan.id === 'free' ? 'bg-primary/10' : plan.id === 'pro' ? 'bg-warning/10' : 'bg-success/10'}`}>
                            <plan.icon className={`w-5 h-5 ${plan.id === 'free' ? 'text-primary' : plan.id === 'pro' ? 'text-warning' : 'text-success'}`} />
                          </div>
                          <div>
                            <div className="font-bold text-base text-foreground">{plan.name}</div>
                            <div className="text-xs text-muted-foreground">{plan.description}</div>
                          </div>
                        </div>
                        <div className="flex items-baseline space-x-1 mb-2 justify-center">
                          <span className="text-lg font-bold text-foreground">{plan.price}</span>
                          <span className="text-xs text-muted-foreground">{plan.period}</span>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1 text-left mx-auto w-fit">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-success" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex justify-center gap-2 w-full">
                    <Button variant="outline" onClick={closePaymentFlow}>Cancel</Button>
                    <Button onClick={nextStep}>Continue</Button>
                  </div>
                </div>
              )}
              {/* Step 2: Payment Method */}
              {paymentStep === 2 && (
                <div className="flex flex-col h-full p-6 w-full max-w-xs mx-auto items-center justify-center text-center">
                  <div className="mb-6 w-full">
                    <div className="text-lg font-bold text-blue-700 mb-1">Payment Method</div>
                    <div className="text-xs text-muted-foreground mb-4">Select a card or add a new one.</div>
                    <div className="space-y-2 mb-2 w-full">
                      {cards.length === 0 && <div className="text-xs text-muted-foreground">No cards added yet.</div>}
                      {cards.map(card => (
                        <button key={card.id} className={`flex items-center justify-between w-full bg-white/90 rounded-lg p-2 shadow-sm border ${selectedCardId === card.id ? 'border-blue-500' : 'border-transparent'} transition-all mx-auto`} onClick={() => setSelectedCardId(card.id)}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">{card.brand}</div>
                            <div className="text-xs text-muted-foreground">**** **** **** {card.last4}</div>
                            <div className="text-xs text-muted-foreground">{card.expiry}</div>
                            <div className="text-xs text-muted-foreground">{card.name}</div>
                            {card.isDefault && <Badge variant="secondary" className="ml-1">Default</Badge>}
                          </div>
                          {selectedCardId === card.id && <Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2 mx-auto" onClick={() => { setAddCardOpen(true); setPaymentStep(null); }}>+ Add New Card</Button>
                  </div>
                  <div className="mt-auto flex justify-center gap-2 w-full">
                    <Button variant="outline" onClick={prevStep}>Back</Button>
                    <Button onClick={nextStep} disabled={!selectedCardId}>Continue</Button>
                  </div>
                </div>
              )}
              {/* Step 3: Review & Pay */}
              {paymentStep === 3 && selectedPlan && (
                <div className="flex flex-col h-full p-6 w-full max-w-xs mx-auto items-center justify-center text-center">
                  <div className="mb-6 w-full">
                    <div className="text-lg font-bold text-blue-700 mb-1">Review & Pay</div>
                    <div className="text-xs text-muted-foreground mb-4">Review your payment details before confirming.</div>
                    {plans.filter(p => p.id === selectedPlan).map(plan => (
                      <div key={plan.id} className="bg-white/90 rounded-xl p-4 shadow mb-2 mx-auto w-full">
                        <div className="flex items-center gap-3 mb-2 justify-center">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plan.id === 'free' ? 'bg-primary/10' : plan.id === 'pro' ? 'bg-warning/10' : 'bg-success/10'}`}>
                            <plan.icon className={`w-5 h-5 ${plan.id === 'free' ? 'text-primary' : plan.id === 'pro' ? 'text-warning' : 'text-success'}`} />
                          </div>
                          <div>
                            <div className="font-bold text-base text-foreground">{plan.name}</div>
                            <div className="text-xs text-muted-foreground">{plan.description}</div>
                          </div>
                        </div>
                        <div className="flex items-baseline space-x-1 mb-2 justify-center">
                          <span className="text-lg font-bold text-foreground">{plan.price}</span>
                          <span className="text-xs text-muted-foreground">{plan.period}</span>
                        </div>
                      </div>
                    ))}
                    {cards.filter(c => c.id === selectedCardId).map(card => (
                      <div key={card.id} className="bg-white/90 rounded-xl p-4 shadow flex items-center gap-3 mt-2 justify-center">
                        <CreditCard className="w-6 h-6 text-blue-500" />
                        <div className="text-xs text-muted-foreground">**** **** **** {card.last4} ({card.expiry})</div>
                        <div className="text-xs text-muted-foreground">{card.name}</div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-4 justify-center">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">Your payment is secure and encrypted.</span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-center gap-2 w-full">
                    <Button variant="outline" onClick={prevStep}>Back</Button>
                    <Button onClick={() => { setPaymentStep(4); setTimeout(() => { setPaymentStep(null); setPaymentSuccess(true); }, 1200); }}>Pay Now</Button>
                  </div>
                </div>
              )}
              {/* Step 4: Confirmation */}
              {paymentStep === 4 && (
                <div className="flex flex-col h-full items-center justify-center p-6 w-full max-w-xs mx-auto text-center">
                  <Check className="w-16 h-16 text-green-500 mb-2 mx-auto" />
                  <div className="font-bold text-xl text-green-700 mb-1">Payment Successful!</div>
                  <div className="text-xs text-muted-foreground mb-2">Your plan has been updated.</div>
                  <Button className="mt-2 mx-auto" onClick={closePaymentFlow}>Close</Button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Payment Success Modal */}
        <Dialog open={paymentSuccess} onOpenChange={setPaymentSuccess}>
          <DialogContent className="max-w-xs w-full rounded-2xl p-0 overflow-hidden bg-white/95 backdrop-blur shadow-2xl border-0 flex flex-col items-center justify-center">
            <div className="p-6 flex flex-col items-center">
              <Check className="w-12 h-12 text-green-500 mb-2" />
              <div className="font-bold text-lg text-green-700 mb-1">Payment Successful!</div>
              <div className="text-xs text-muted-foreground mb-2">Your plan has been updated.</div>
              <Button className="mt-2" onClick={() => setPaymentSuccess(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Download className="w-5 h-5" />
                <span>Billing History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-1">
              <div className="divide-y divide-border">
                {billingHistory.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-semibold text-sm text-foreground">{bill.description}</div>
                      <div className="text-xs text-muted-foreground">{bill.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{bill.amount}</span>
                      <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>{bill.status}</Badge>
                      <Button size="sm" variant="ghost" className="px-2 py-0.5 text-xs" onClick={() => handleDownloadInvoice(bill.id)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
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