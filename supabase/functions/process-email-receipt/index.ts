import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailContent, userId } = await req.json();

    if (!emailContent || !userId) {
      throw new Error('Missing email content or user ID');
    }

    // Use OpenAI to extract expense information from email content
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an email receipt analyzer. Extract expense information from email receipts and return it as JSON.

IMPORTANT: Only return valid JSON in this exact format:
{
  "amount": number,
  "merchant": "string", 
  "date": "YYYY-MM-DD",
  "category": "string",
  "description": "string",
  "confidence": number between 0 and 1
}

Categories must be one of: "🍔 Food & Dining", "⛽ Transportation", "🛍️ Shopping", "🏠 Bills & Utilities", "🎬 Entertainment", "💊 Healthcare", "✈️ Travel", "📚 Education"

Look for purchase confirmations, receipts, invoices, and transaction notifications. If the email doesn't contain expense information, return confidence: 0.`
          },
          {
            role: 'user',
            content: `Extract expense information from this email:\n\n${emailContent}`
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const extractedText = data.choices[0].message.content;

    // Parse the JSON response
    let extractedData;
    try {
      extractedData = JSON.parse(extractedText);
    } catch (e) {
      throw new Error('Failed to parse extracted data');
    }

    // If confidence is too low, don't create expense
    if (extractedData.confidence < 0.3) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No expense information found in email' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the category ID
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .eq('name', extractedData.category)
      .eq('user_id', userId)
      .single();

    // Create expense record
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        amount: extractedData.amount,
        description: extractedData.description || `${extractedData.merchant} - Email receipt`,
        category_id: categories?.id,
        expense_date: extractedData.date,
        source: 'email'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      expense,
      extractedData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-email-receipt function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});