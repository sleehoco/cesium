import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScanRequest {
  url: string;
  scanType: 'quick' | 'comprehensive';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, scanType = 'comprehensive' }: ScanRequest = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const togetherApiKey = Deno.env.get('TOGETHER_API_KEY');
    if (!togetherApiKey) {
      throw new Error('TOGETHER_API_KEY not configured');
    }

    console.log(`Starting ${scanType} security scan for URL: ${url}`);

    const systemPrompt = `You are an expert web security scanner. Analyze the given URL for security vulnerabilities.

Find vulnerabilities in these categories: SQL Injection, XSS, CSRF, Security Misconfigurations, Authentication Issues, Access Control, SSL/TLS, HTTP Headers, Input Validation.

For EACH vulnerability found, provide complete code examples showing both vulnerable and secure implementations.

Return ONLY valid JSON (no markdown) in this exact format:
{
  "summary": {
    "totalVulnerabilities": 5,
    "critical": 1,
    "high": 2,
    "medium": 1,
    "low": 1,
    "overallRiskScore": 65
  },
  "vulnerabilities": [
    {
      "id": "sql-injection-1",
      "title": "SQL Injection in Login Form",
      "severity": "Critical",
      "category": "Injection",
      "description": "The login form accepts unsanitized user input that is directly concatenated into SQL queries, allowing attackers to manipulate the query structure and potentially access or modify sensitive database information.",
      "impact": "Attackers can bypass authentication, extract sensitive data including passwords and personal information, modify database records, or potentially execute arbitrary commands on the database server.",
      "location": "https://example.com/login",
      "remediation": {
        "steps": [
          "Replace all dynamic SQL queries with parameterized prepared statements",
          "Implement strict input validation using allowlists for all user inputs",
          "Use an ORM framework that automatically handles parameterization",
          "Implement least privilege database access controls",
          "Add database activity monitoring and logging"
        ],
        "codeExample": "// VULNERABLE CODE:\\nconst query = 'SELECT * FROM users WHERE username = \\\"' + username + '\\\" AND password = \\\"' + password + '\\\"';\\ndb.query(query);\\n\\n// SECURE CODE:\\nconst query = 'SELECT * FROM users WHERE username = ? AND password = ?';\\nconst stmt = db.prepare(query);\\nstmt.execute([username, hashedPassword]);",
        "references": [
          "https://owasp.org/www-project-top-ten/2017/A1_2017-Injection"
        ]
      }
    }
  ],
  "recommendations": [
    "Implement Web Application Firewall (WAF)",
    "Conduct regular security audits and penetration testing"
  ]
}`;

    const userPrompt = `Analyze ${url} for security vulnerabilities. Find at least 5-7 realistic vulnerabilities with complete remediation examples.`;

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Together.ai API error:', response.status, errorText);
      
      let errorMessage = `Together.ai API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Security scan completed successfully');

    // Parse JSON from response
    let scanResults;
    try {
      const content = data.choices[0].message.content;
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      scanResults = JSON.parse(jsonContent.trim());
    } catch (e) {
      console.error('Could not parse scan results:', e);
      scanResults = {
        summary: {
          totalVulnerabilities: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          overallRiskScore: 0
        },
        vulnerabilities: [],
        recommendations: ["Unable to complete scan. Please try again."]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        url,
        scannedAt: new Date().toISOString(),
        scanType,
        results: scanResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in together-security-scan function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: 'Security scan failed. Please check the URL and try again.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
