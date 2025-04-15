
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

    console.log(`Processing cybersecurity question: ${question}`);
    
    // Enhanced system prompt for cybersecurity context
    const systemPrompt = `You are an advanced AI cybersecurity assistant for CesiumCyber. 
    Your primary goal is to provide expert, concise, and actionable guidance on cybersecurity topics. 
    Always maintain a professional tone and focus on practical, implementable advice. 
    Responses should be clear, direct, and tailored to help businesses understand and mitigate cyber risks.`;
    
    // Call the Gemini API with updated configuration
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
          temperature: 0.6,  // Slightly reduced for more consistent responses
          maxOutputTokens: 300,
          topP: 0.9,
          topK: 40
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
    
    console.log(`Generated cybersecurity response (${llmResponse.length} chars)`);
    
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
