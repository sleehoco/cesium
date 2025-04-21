
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for public access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Construct prompt for LLM
    const prompt = `Collect and summarize the latest credible cybersecurity news from multiple reputable sources (such as BleepingComputer, KrebsOnSecurity, The Hacker News, etc.). 
For each news item, provide:
- Title
- Short summary (1-2 sentences)
- Source name and link
- A security impact level: "low", "medium", or "high" (assess how severe or urgent you believe it is for a business audience).
Respond strictly in the following JSON array format:

[
  {
    "title": "...",
    "summary": "...",
    "source": "...",
    "url": "...",
    "impact": "low|medium|high"
  },
  ...
]

Do NOT add any explanatory text before or after the array. Only respond with the array.`;

    // Query Gemini for response
    const llmRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 700,
            topP: 0.9,
            topK: 40
          }
        }),
      }
    );

    if (!llmRes.ok) {
      const error = await llmRes.text();
      return new Response(
        JSON.stringify({ error: "LLM error", details: error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await llmRes.json();
    // Extract the content
    let newsRaw = "";
    try {
      newsRaw = data.candidates[0].content.parts[0].text.trim();
      // The response will be a JSON array, but potentially with markdown or formatting; extract the array safely
      const jsonStart = newsRaw.indexOf('[');
      const jsonEnd = newsRaw.lastIndexOf(']');
      const newsArrayStr = newsRaw.slice(jsonStart, jsonEnd + 1);
      const newsArr = JSON.parse(newsArrayStr);
      return new Response(JSON.stringify({ news: newsArr }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Failed to parse LLM response", llmOutput: newsRaw }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
