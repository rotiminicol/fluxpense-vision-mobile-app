-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'USD',
  monthly_budget DECIMAL(10,2) DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expense categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  budget_limit DECIMAL(10,2),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  receipt_data JSONB,
  merchant_name TEXT,
  location TEXT,
  payment_method TEXT,
  tags TEXT[],
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (category_id) REFERENCES public.categories(id)
);

-- Create receipts table for storing receipt images and OCR data
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  expense_id UUID,
  image_url TEXT NOT NULL,
  original_filename TEXT,
  file_size INTEGER,
  ocr_status TEXT DEFAULT 'pending',
  ocr_data JSONB,
  extracted_amount DECIMAL(10,2),
  extracted_merchant TEXT,
  extracted_date DATE,
  extracted_items JSONB,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (expense_id) REFERENCES public.expenses(id) ON DELETE SET NULL
);

-- Create budgets table for budget tracking
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (category_id) REFERENCES public.categories(id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for categories
CREATE POLICY "Users can view their own categories" 
ON public.categories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses" 
ON public.expenses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" 
ON public.expenses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" 
ON public.expenses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" 
ON public.expenses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for receipts
CREATE POLICY "Users can view their own receipts" 
ON public.receipts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own receipts" 
ON public.receipts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts" 
ON public.receipts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receipts" 
ON public.receipts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for budgets
CREATE POLICY "Users can view their own budgets" 
ON public.budgets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" 
ON public.budgets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
ON public.budgets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
ON public.budgets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email
  );
  
  -- Insert default categories for new user
  INSERT INTO public.categories (user_id, name, icon, color, is_default)
  VALUES 
    (NEW.id, 'Food & Dining', '🍽️', '#ef4444', true),
    (NEW.id, 'Transportation', '🚗', '#3b82f6', true),
    (NEW.id, 'Shopping', '🛍️', '#8b5cf6', true),
    (NEW.id, 'Entertainment', '🎬', '#f59e0b', true),
    (NEW.id, 'Healthcare', '🏥', '#10b981', true),
    (NEW.id, 'Bills & Utilities', '⚡', '#ef4444', true),
    (NEW.id, 'Travel', '✈️', '#06b6d4', true),
    (NEW.id, 'Education', '📚', '#8b5cf6', true),
    (NEW.id, 'Other', '📋', '#6b7280', true);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', false);

-- Create storage policies for receipt uploads
CREATE POLICY "Users can upload their own receipts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own receipts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own receipts" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own receipts" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);