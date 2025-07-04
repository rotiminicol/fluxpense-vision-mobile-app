import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReceiptData {
  merchant: string;
  date: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  category: string;
  confidence: number;
}

// Mock OCR function - replace with actual OCR service
function extractDataFromReceipt(imageBase64: string): ReceiptData {
  // This is a mock implementation
  // In production, you would use services like:
  // - Google Cloud Vision API
  // - Amazon Textract
  // - Microsoft Computer Vision
  // - OCR.Space API
  
  const mockData: ReceiptData = {
    merchant: "Walmart Supercenter",
    date: new Date().toISOString().split('T')[0],
    total: Math.floor(Math.random() * 100) + 10,
    items: [
      { name: "Milk", quantity: 1, price: 3.99 },
      { name: "Bread", quantity: 2, price: 2.50 },
      { name: "Eggs", quantity: 1, price: 4.99 }
    ],
    category: "Food & Dining",
    confidence: 0.85 + Math.random() * 0.1
  };
  
  return mockData;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { image, imageUrl, receiptId } = await req.json();

    let imageData = image;
    if (imageUrl && !image) {
      // Download image from URL if only URL is provided
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      imageData = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }

    if (!imageData) {
      throw new Error('No image data provided');
    }

    console.log('Processing receipt for user:', user.id);

    // Extract data from receipt image
    const extractedData = extractDataFromReceipt(imageData);
    
    console.log('Extracted data:', extractedData);

    // Update receipt record with extracted data
    if (receiptId) {
      const { error: updateError } = await supabaseClient
        .from('receipts')
        .update({
          ocr_status: 'completed',
          ocr_data: extractedData,
          extracted_amount: extractedData.total,
          extracted_merchant: extractedData.merchant,
          extracted_date: extractedData.date,
          extracted_items: extractedData.items,
          confidence_score: extractedData.confidence
        })
        .eq('id', receiptId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating receipt:', updateError);
        throw updateError;
      }
    }

    // Find matching category
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', extractedData.category)
      .single();

    // Create expense record
    const { data: expense, error: expenseError } = await supabaseClient
      .from('expenses')
      .insert({
        user_id: user.id,
        category_id: categories?.id,
        amount: extractedData.total,
        description: `${extractedData.merchant} - Receipt`,
        date: extractedData.date,
        merchant_name: extractedData.merchant,
        receipt_data: extractedData,
        receipt_url: imageUrl
      })
      .select()
      .single();

    if (expenseError) {
      console.error('Error creating expense:', expenseError);
      throw expenseError;
    }

    // Link receipt to expense if receiptId exists
    if (receiptId && expense) {
      await supabaseClient
        .from('receipts')
        .update({ expense_id: expense.id })
        .eq('id', receiptId)
        .eq('user_id', user.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        extractedData,
        expense,
        message: 'Receipt processed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in extract-receipt function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});