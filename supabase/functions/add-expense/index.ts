import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { 
      userId, 
      amount, 
      description, 
      categoryName, 
      expenseDate, 
      receiptUrl,
      source = 'manual'
    } = await req.json();

    if (!userId || !amount || !description) {
      throw new Error('Missing required fields: userId, amount, description');
    }

    // Find the category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('user_id', userId)
      .single();

    // Create expense record
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        amount: parseFloat(amount),
        description,
        category_id: category?.id,
        expense_date: expenseDate || new Date().toISOString().split('T')[0],
        source
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // If there's a receipt URL, store it
    if (receiptUrl) {
      await supabase
        .from('receipts')
        .insert({
          expense_id: expense.id,
          image_url: receiptUrl,
          processed: true
        });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      expense 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in add-expense function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});