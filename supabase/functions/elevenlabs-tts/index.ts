
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
    const { text, voiceId, model } = await req.json();
    
    if (!text || !voiceId) {
      throw new Error('Missing required parameters: text and voiceId are required');
    }

    // The API key is securely stored in Supabase secrets, not exposed to clients
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured on the server');
    }

    // Log the request for monitoring
    console.log(`Generating speech for text (${text.length} chars) with voice ${voiceId}`);
    
    // Make the request to ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: model || "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("ElevenLabs API error:", errorData);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Return the audio directly to the client with the correct content type
    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error("Error in elevenlabs-tts function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
