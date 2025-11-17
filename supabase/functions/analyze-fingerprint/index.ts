import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FingerprintData {
  sessionId: string;
  browserFingerprint: any;
  connectionMetadata: any;
  userAgent: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { sessionId, browserFingerprint, connectionMetadata, userAgent }: FingerprintData = await req.json();

    // Get client IP from headers
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    console.log('Analyzing fingerprint for session:', sessionId);

    // Create AI analysis prompt
    const systemPrompt = `You are a cybersecurity expert analyzing browser and connection fingerprints to detect potential threats, bots, and anomalies. 

Analyze the provided fingerprint data and provide:
1. Risk score (0-100, where 100 is highest risk)
2. List of detected threats or anomalies
3. Browser/device identification
4. Confidence level
5. Recommendations

Be specific and technical in your analysis.`;

    const userPrompt = `Analyze this connection fingerprint:

User Agent: ${userAgent}
IP Address: ${ipAddress}
Browser Fingerprint: ${JSON.stringify(browserFingerprint, null, 2)}
Connection Metadata: ${JSON.stringify(connectionMetadata, null, 2)}

Provide analysis in JSON format with keys: riskScore, threats, deviceInfo, confidence, recommendations`;

    // Call Lovable AI for analysis
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const aiAnalysisText = aiData.choices[0]?.message?.content || '';
    
    console.log('AI Analysis:', aiAnalysisText);

    // Parse AI response
    let aiAnalysis;
    let riskScore = 50;
    let threats: string[] = [];

    try {
      // Try to extract JSON from the response
      const jsonMatch = aiAnalysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
        riskScore = aiAnalysis.riskScore || 50;
        threats = aiAnalysis.threats || [];
      } else {
        aiAnalysis = { rawAnalysis: aiAnalysisText };
        
        // Extract risk indicators from text
        if (aiAnalysisText.toLowerCase().includes('bot') || 
            aiAnalysisText.toLowerCase().includes('automated')) {
          threats.push('Potential bot activity detected');
          riskScore += 20;
        }
        if (aiAnalysisText.toLowerCase().includes('suspicious') || 
            aiAnalysisText.toLowerCase().includes('anomaly')) {
          threats.push('Suspicious behavior detected');
          riskScore += 15;
        }
        if (aiAnalysisText.toLowerCase().includes('vpn') || 
            aiAnalysisText.toLowerCase().includes('proxy')) {
          threats.push('VPN/Proxy detected');
          riskScore += 10;
        }
      }
    } catch (e) {
      console.error('Error parsing AI response:', e);
      aiAnalysis = { rawAnalysis: aiAnalysisText };
    }

    // Get current user if authenticated
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Store fingerprint analysis in database
    const { data: fingerprintRecord, error: dbError } = await supabase
      .from('connection_fingerprints')
      .insert({
        user_id: userId,
        session_id: sessionId,
        ip_address: ipAddress,
        user_agent: userAgent,
        browser_fingerprint: browserFingerprint,
        connection_metadata: connectionMetadata,
        ai_analysis: aiAnalysis,
        risk_score: Math.min(100, Math.max(0, riskScore)),
        detected_threats: threats,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Fingerprint analysis stored:', fingerprintRecord.id);

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          id: fingerprintRecord.id,
          riskScore: fingerprintRecord.risk_score,
          threats: fingerprintRecord.detected_threats,
          aiAnalysis: aiAnalysis,
          ipAddress: ipAddress,
          timestamp: fingerprintRecord.created_at,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-fingerprint:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});