
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subject, sender, content, userId } = await req.json()

    if (!content && !subject) {
      throw new Error('Email content or subject is required')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Simple regex patterns to extract expense information
    const text = `${subject} ${content}`.toLowerCase()
    
    // Extract amount (looking for $XX.XX, $XX, etc.)
    const amountMatch = text.match(/\$(\d+(?:\.\d{2})?)/g)
    const amounts = amountMatch?.map(match => parseFloat(match.replace('$', ''))) || []
    const amount = amounts.length > 0 ? Math.max(...amounts) : null

    // Extract merchant name from subject or sender
    let merchant = null
    if (subject) {
      const merchantMatch = subject.match(/(?:from|at)\s+([^-\n\r]+)/i)
      merchant = merchantMatch ? merchantMatch[1].trim() : null
    }
    
    if (!merchant && sender) {
      const domain = sender.split('@')[1]?.split('.')[0]
      merchant = domain?.charAt(0).toUpperCase() + domain?.slice(1)
    }

    // Extract date (look for common date patterns)
    const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/g)
    const extractedDate = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0]

    // Try to convert date to standard format
    let formattedDate = extractedDate
    if (extractedDate.includes('/')) {
      const [month, day, year] = extractedDate.split('/')
      formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    let result = null

    // Only create expense if we have amount and merchant
    if (amount && merchant) {
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          amount: amount,
          description: `Email receipt from ${merchant}`,
          merchant_name: merchant,
          date: formattedDate,
          receipt_data: {
            source: 'email',
            subject,
            sender,
            processed_at: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (expenseError) {
        console.error('Error creating expense:', expenseError)
        throw expenseError
      }

      result = {
        expense: {
          id: expense.id,
          amount: expense.amount,
          merchant: expense.merchant_name,
          date: expense.date
        },
        extracted: {
          amount,
          merchant,
          date: formattedDate,
          rawText: text
        }
      }
    }

    return new Response(
      JSON.stringify(result || { 
        error: 'Could not extract expense information',
        extracted: { amount, merchant, date: formattedDate }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error processing email receipt:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
