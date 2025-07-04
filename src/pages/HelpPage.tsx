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
  Send,
  Bell,
  X
} from 'lucide-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'support', text: 'Hi! 👋 How can we help you today?' }
  ]);
  const [openQuickLink, setOpenQuickLink] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-surface flex flex-col pb-4">
      {/* Header */}
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between w-full bg-white/70 backdrop-blur shadow-lg px-3 py-2 mb-2 max-w-md mx-auto rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
              <img src={fluxpenseLogo} alt="FluxPense" className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base font-extrabold text-blue-700 leading-tight">Help & Support</span>
              <span className="text-xs text-muted-foreground mt-0.5">Get the help you need</span>
            </div>
          </div>
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1.5 rounded-full hover:bg-blue-100 transition-colors focus:outline-none">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[10px] text-white flex items-center justify-center">3</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl mt-2">
              <div className="p-2 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <DropdownMenuItem className="flex items-start space-x-2 p-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-medium">Budget Alert</p>
                    <p className="text-[11px] text-muted-foreground">You've used 85% of your monthly budget</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-2 p-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-medium">Goal Achieved!</p>
                    <p className="text-[11px] text-muted-foreground">You've saved $500 this month</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-2 p-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-medium">Receipt Reminder</p>
                    <p className="text-[11px] text-muted-foreground">Don't forget to scan today's receipts</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto relative z-10 pb-20 px-4 pt-6 max-w-md mx-auto w-full">
        {/* Search */}
        <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2 animate-fade-in-up">
          <CardContent className="p-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search for help..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-10 text-base rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2 animate-fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 gap-2">
              {quickLinks.map((link, index) => (
                <Popover key={index} open={openQuickLink === link.title} onOpenChange={open => setOpenQuickLink(open ? link.title : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between h-auto p-3 hover:bg-hover rounded-xl w-full flex items-center">
                      <div className="flex items-center gap-3">
                        <link.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium text-sm">{link.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="max-w-xs bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border p-4">
                    <div className="mb-2 font-semibold text-base">{link.title}</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {/* Example summaries for each link, customize as needed */}
                      {link.title === 'Getting Started Guide' && 'Step-by-step instructions to set up your account, add your first expense, and explore the app.'}
                      {link.title === 'Receipt Scanning Tutorial' && 'Learn how to scan receipts with your camera and let our AI extract expense details instantly.'}
                      {link.title === 'Budget Setup Guide' && 'Tips and walkthrough for creating budgets, setting alerts, and tracking your spending.'}
                      {link.title === 'Privacy Policy' && 'Read how we protect your data, your privacy rights, and our security practices.'}
                      {link.title === 'Terms of Service' && 'Review the terms and conditions for using FluxPense.'}
                    </div>
                    <Button asChild variant="link" className="p-0 h-auto text-blue-600 font-semibold text-xs">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">Open in New Tab</a>
                    </Button>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2 animate-fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><HelpCircle className="w-5 h-5" /><span>Frequently Asked Questions</span></CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <motion.div key={faq.id} className="border border-border rounded-xl overflow-hidden transition-all duration-300 bg-white/70" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}>
                  <Button variant="ghost" className={`w-full justify-between p-3 h-auto text-left hover:bg-blue-50/60 ${expandedFaq === faq.id ? 'text-blue-700 font-bold' : ''}`} onClick={() => toggleFaq(faq.id)}>
                    <span>{faq.question}</span>
                    {expandedFaq === faq.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-3 text-sm text-muted-foreground">
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
        <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2 animate-fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contact Options</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-border">
              {/* Live Chat */}
              <div
                className="flex items-center justify-between w-full px-2 py-3 hover:bg-blue-50/60 transition-colors group cursor-pointer"
                onClick={() => setChatOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm">Live Chat</span>
                    <span className="text-xs text-muted-foreground">Get instant help from our support team</span>
                    <span className="text-[11px] text-blue-600 mt-0.5">Available 24/7</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 group-hover:underline">Start Chat</span>
              </div>
              {/* Email Support */}
              <a
                href="mailto:support@fluxpense.com"
                className="flex items-center justify-between w-full px-2 py-3 hover:bg-blue-50/60 transition-colors group cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-500" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm">Email Support</span>
                    <span className="text-xs text-muted-foreground">Send us a detailed message</span>
                    <span className="text-[11px] text-blue-600 mt-0.5">Response within 24 hours</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 group-hover:underline">Send Email</span>
              </a>
              {/* Phone Support */}
              <a
                href="tel:+1234567890"
                className="flex items-center justify-between w-full px-2 py-3 hover:bg-blue-50/60 transition-colors group cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-blue-500" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm">Phone Support</span>
                    <span className="text-xs text-muted-foreground">Speak directly with our team</span>
                    <span className="text-[11px] text-blue-600 mt-0.5">Mon-Fri 9AM-6PM EST</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 group-hover:underline">Call Now</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-white/80 backdrop-blur rounded-xl shadow p-3 mb-2 animate-fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-2">
              <Input placeholder="Subject" value={contactForm.subject} onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))} className="h-9 text-sm" />
              <Textarea placeholder="Message" value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} className="h-20 text-sm" />
              <div className="flex gap-2 items-center">
                <span className="text-xs font-medium">Priority:</span>
                <Button type="button" size="sm" variant={contactForm.priority === 'low' ? 'default' : 'outline'} className="text-xs px-2 py-1" onClick={() => setContactForm(f => ({ ...f, priority: 'low' }))}>Low</Button>
                <Button type="button" size="sm" variant={contactForm.priority === 'medium' ? 'default' : 'outline'} className="text-xs px-2 py-1" onClick={() => setContactForm(f => ({ ...f, priority: 'medium' }))}>Medium</Button>
                <Button type="button" size="sm" variant={contactForm.priority === 'high' ? 'default' : 'outline'} className="text-xs px-2 py-1" onClick={() => setContactForm(f => ({ ...f, priority: 'high' }))}>High</Button>
              </div>
              <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-lg py-2 text-base shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all">Send Message <Send className="w-4 h-4 ml-2" /></Button>
            </form>
          </CardContent>
        </Card>
      </main>
      {/* Floating Contact Us Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-strong flex items-center justify-center text-white text-3xl hover:scale-110 focus:scale-105 transition-transform duration-200"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', bounce: 0.4 }}
        style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}
        aria-label="Contact Us"
        onClick={() => setChatOpen(true)}
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>
      {/* Chat Dropup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }}
            className="fixed z-50 right-6 bottom-[calc(1.5rem+4rem)] w-80 sm:max-w-md sm:w-full max-h-[70vh] flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-100 overflow-hidden"
            style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}
          >
            <div className="flex flex-row items-center gap-3 bg-gradient-to-r from-blue-500/80 to-blue-400/80 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center border border-blue-200">
                <span className="text-blue-600 font-bold text-lg">CS</span>
              </div>
              <span className="text-white text-lg font-bold flex-1">Live Chat</span>
              <button className="text-white/80 hover:text-white p-1 rounded-full focus:outline-none" onClick={() => setChatOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-white/70 to-blue-50/60" style={{ minHeight: 120 }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === 'support' ? 'justify-start' : 'justify-end'}`}> 
                  <div className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm shadow-md ${msg.from === 'support' ? 'bg-blue-100 text-blue-900' : 'bg-primary text-white'}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <form
              className="flex items-center gap-2 p-3 border-t bg-white/90 sticky bottom-0"
              onSubmit={e => {
                e.preventDefault();
                if (chatInput.trim()) {
                  setChatMessages(msgs => [...msgs, { from: 'user', text: chatInput }]);
                  setChatInput('');
                  setTimeout(() => {
                    setChatMessages(msgs => [...msgs, { from: 'support', text: 'Thanks for reaching out! Our team will reply shortly.' }]);
                  }, 1200);
                }
              }}
            >
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-10 rounded-full bg-white/90 border-none shadow"
              />
              <Button type="submit" className="rounded-full px-4 h-10 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
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