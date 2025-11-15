import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { policyType, companyName, industry, specificRequirements, accessKey } = await req.json();
    
    if (!policyType || !companyName || !accessKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate access key server-side
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: validationData, error: validationError } = await supabase.rpc('validate_policy_access_key', {
      key_to_validate: accessKey
    });

    if (validationError) {
      console.error('Access key validation error:', validationError);
      return new Response(
        JSON.stringify({ error: 'Failed to validate access key' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const validation = validationData as { valid: boolean; error?: string };
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error || 'Invalid or expired access key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error('Lovable API key is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Generating ${policyType} policy for ${companyName}`);
    
    const systemPrompt = `You are an expert cybersecurity policy writer with deep knowledge of industry standards, compliance requirements, and best practices. Generate comprehensive, professional, and legally sound cybersecurity policies that are tailored to the specific organization and requirements provided.

Your policies should:
- Be clear, actionable, and enforceable
- Follow industry standards (ISO 27001, NIST, etc.)
- Include all necessary sections: Purpose, Scope, Policy Statement, Procedures, Responsibilities, Compliance
- Be formatted professionally with proper sections and subsections
- Use formal business language
- Include specific controls and requirements

Format the output as a complete policy document ready for use.`;
    
    const userPrompt = `Generate a comprehensive ${policyType} for the following organization:

Company Name: ${companyName}
Industry: ${industry || 'General'}
${specificRequirements ? `Specific Requirements: ${specificRequirements}` : ''}

Please create a complete, professional policy document that includes:
1. Policy Title and Document Information
2. Purpose and Objectives
3. Scope and Applicability
4. Policy Statement
5. Roles and Responsibilities
6. Detailed Procedures and Controls
7. Compliance and Enforcement
8. Review and Revision Information

Make it comprehensive, specific to ${policyType}, and tailored to a ${industry || 'general'} organization.`;

    const response = await fetch(`https://ai.gateway.lovable.dev/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorData = await response.text();
      console.error("AI Gateway error:", errorData);
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const policyContent = data.choices[0].message.content;
    
    console.log(`Generated policy (${policyContent.length} chars)`);
    
    // Increment usage count after successful generation
    await supabase.rpc('increment_key_usage', {
      key_to_increment: accessKey
    });
    
    return new Response(
      JSON.stringify({ policyContent }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error in generate-policy function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
