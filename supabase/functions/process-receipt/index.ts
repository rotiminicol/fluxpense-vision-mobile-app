
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MINDEE_API_KEY = Deno.env.get('MINDEE_API_KEY') || 'ed2d51a32022a48b2b8ef5e9670c7ef4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MindeeResponse {
  document?: {
    inference?: {
      prediction?: {
        total_amount?: { value: number }[]
        supplier_name?: { value: string }[]
        date?: { value: string }[]
        line_items?: Array<{
          description?: string
          total_amount?: number
        }>
      }
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      throw new Error('Image URL is required')
    }

    // Download image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to download image')
    }

    const imageBlob = await imageResponse.blob()
    
    // Prepare form data for Mindee
    const formData = new FormData()
    formData.append('document', imageBlob, 'receipt.jpg')

    // Call Mindee Receipt OCR API
    const mindeeResponse = await fetch('https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${MINDEE_API_KEY}`,
      },
      body: formData,
    })

    if (!mindeeResponse.ok) {
      const errorText = await mindeeResponse.text()
      console.error('Mindee API error:', errorText)
      throw new Error(`Mindee API error: ${mindeeResponse.status}`)
    }

    const mindeeResult: MindeeResponse = await mindeeResponse.json()
    const prediction = mindeeResult.document?.inference?.prediction

    if (!prediction) {
      throw new Error('No prediction data received from Mindee')
    }

    // Extract data from Mindee response
    const amount = prediction.total_amount?.[0]?.value || null
    const merchant = prediction.supplier_name?.[0]?.value || null
    const date = prediction.date?.[0]?.value || null
    const items = prediction.line_items?.map(item => ({
      description: item.description,
      amount: item.total_amount
    })) || []

    const result = {
      amount,
      merchant,
      date,
      items,
      confidence: 0.8, // Mindee doesn't return confidence in v5, using default
      raw: mindeeResult
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error processing receipt:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        amount: null,
        merchant: null,
        date: null,
        items: [],
        confidence: 0
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
