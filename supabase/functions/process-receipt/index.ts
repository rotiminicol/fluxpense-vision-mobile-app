import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { image } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

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
            content: `You are a receipt analysis expert. Extract expense information from receipt images and return it as JSON.

IMPORTANT: Only return valid JSON in this exact format:
{
  "amount": number,
  "merchant": "string",
  "date": "YYYY-MM-DD",
  "category": "string",
  "items": ["item1", "item2"],
  "confidence": number between 0 and 1
}

Categories must be one of: "🍔 Food & Dining", "⛽ Transportation", "🛍️ Shopping", "🏠 Bills & Utilities", "🎬 Entertainment", "💊 Healthcare", "✈️ Travel", "📚 Education"

If you cannot extract certain information, use reasonable defaults but indicate lower confidence.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract the expense information from this receipt image:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
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

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-receipt function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});