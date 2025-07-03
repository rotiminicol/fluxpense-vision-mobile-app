import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Book,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqs = [
    {
      id: '1',
      question: 'How do I scan receipts?',
      answer: 'Tap the + button on your dashboard, then select "Scan Receipt". Point your camera at the receipt and tap the capture button. Our AI will automatically extract the expense details.',
      category: 'Receipts'
    },
    {
      id: '2',
      question: 'Can I set up budget alerts?',
      answer: 'Yes! Go to Settings > Notifications and enable Budget Alerts. You can set custom thresholds for different categories and get notified when you\'re approaching your limits.',
      category: 'Budgets'
    },
    {
      id: '3',
      question: 'How do I export my expense data?',
      answer: 'Navigate to Reports, select your desired time period, and tap the export button. You can export to Excel, PDF, or CSV format.',
      category: 'Reports'
    },
    {
      id: '4',
      question: 'What expense categories are available?',
      answer: 'FluxPense includes 15+ built-in categories like Food & Dining, Transportation, Shopping, and more. Pro users can create custom categories.',
      category: 'Categories'
    },
    {
      id: '5',
      question: 'Is my financial data secure?',
      answer: 'Absolutely. We use bank-level encryption, two-factor authentication, and never store your banking credentials. Your data is encrypted both in transit and at rest.',
      category: 'Security'
    },
    {
      id: '6',
      question: 'How do I sync across devices?',
      answer: 'Your account automatically syncs across all devices when you\'re logged in. Changes made on one device will appear on others within seconds.',
      category: 'Sync'
    }
  ];

  const quickLinks = [
    { title: 'Getting Started Guide', icon: Book, url: '#' },
    { title: 'Receipt Scanning Tutorial', icon: Book, url: '#' },
    { title: 'Budget Setup Guide', icon: Book, url: '#' },
    { title: 'Privacy Policy', icon: ExternalLink, url: '#' },
    { title: 'Terms of Service', icon: ExternalLink, url: '#' }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Mon-Fri 9AM-6PM EST',
      action: 'Call Now'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
  };

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
              <h1 className="text-xl font-bold text-foreground">Help & Support</h1>
              <p className="text-sm text-muted-foreground">Get the help you need</p>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-32 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Search */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-between h-auto p-4 hover:bg-hover"
                  asChild
                >
                  <a href={link.url}>
                    <div className="flex items-center space-x-3">
                      <link.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{link.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  className="border border-border rounded-xl overflow-hidden transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left hover:bg-hover"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="text-xs">
                        {faq.category}
                      </Badge>
                      <span className="font-medium text-foreground">{faq.question}</span>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedFaq === faq.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.span>
                  </Button>
                  <AnimatePresence initial={false}>
                    {expandedFaq === faq.id && (
                      <motion.div
                        key="faq-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4 text-muted-foreground text-sm"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-hover transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <option.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{option.title}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <p className="text-xs text-primary">{option.availability}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {option.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Please provide details about your question or issue..."
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <div className="flex space-x-2">
                  {['low', 'medium', 'high'].map((priority) => (
                    <Button
                      key={priority}
                      type="button"
                      variant={contactForm.priority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContactForm(prev => ({ ...prev, priority }))}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      {/* Floating Contact Us Button */}
      <motion.button
        className="fixed bottom-28 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-strong flex items-center justify-center text-white text-3xl animate-pulse hover:scale-110 focus:scale-105 transition-transform duration-200"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', bounce: 0.4 }}
        style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}
        aria-label="Contact Us"
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>
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

export default HelpPage;