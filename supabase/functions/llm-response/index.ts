
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Set up CORS headers for browser requests
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
    const { question } = await req.json();
    
    if (!question) {
      throw new Error('Missing required parameter: question');
    }

    // Using Gemini API - API key stored in Supabase secrets
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!geminiApiKey) {
      console.error('Gemini API key is not configured');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing question: ${question}`);
    
    // Prompt the LLM to act as a cybersecurity assistant
    const systemPrompt = "You are an expert cybersecurity assistant for CesiumCyber. Provide helpful, detailed and accurate information about cybersecurity threats, best practices, and protective measures. Keep responses focused, professional, and concise (around 3-4 sentences maximum).";
    
    // Call the Gemini API - updated to use the correct API URL format
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + question }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}`, details: errorData }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const llmResponse = data.candidates[0].content.parts[0].text;
    
    console.log(`Generated LLM response (${llmResponse.length} chars)`);
    
    return new Response(
      JSON.stringify({ response: llmResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error in llm-response function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
