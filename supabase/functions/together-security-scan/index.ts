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

    // Comprehensive security scanning prompt
    const systemPrompt = `You are an expert web security scanner and penetration testing specialist. Analyze the given URL for security vulnerabilities.

Perform a comprehensive security analysis covering:

1. **Common Web Vulnerabilities**:
   - SQL Injection risks
   - Cross-Site Scripting (XSS) - reflected, stored, DOM-based
   - Cross-Site Request Forgery (CSRF)
   - Security misconfigurations
   - Sensitive data exposure
   - Broken authentication and session management
   - XML External Entities (XXE)
   - Broken access control
   - Security logging and monitoring failures

2. **Infrastructure & Configuration**:
   - SSL/TLS configuration and certificate validity
   - HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
   - Server information disclosure
   - Directory listing and file exposure
   - Default credentials and common paths

3. **Frontend Security**:
   - JavaScript security issues
   - Client-side validation bypass
   - Insecure third-party dependencies
   - Cookie security attributes
   - Local storage security

4. **API & Backend**:
   - API endpoint security
   - Rate limiting and DDoS protection
   - Input validation and sanitization
   - Error handling and information leakage

For each vulnerability found, provide:
- Severity level (Critical, High, Medium, Low)
- Detailed description
- Potential impact
- Step-by-step remediation guide
- Code examples where applicable

Return results in JSON format with this structure:
{
  "summary": {
    "totalVulnerabilities": number,
    "critical": number,
    "high": number,
    "medium": number,
    "low": number,
    "overallRiskScore": number (0-100)
  },
  "vulnerabilities": [
    {
      "id": string,
      "title": string,
      "severity": "Critical" | "High" | "Medium" | "Low",
      "category": string,
      "description": string,
      "impact": string,
      "location": string,
      "remediation": {
        "steps": string[],
        "codeExample": string (if applicable),
        "references": string[]
      }
    }
  ],
  "recommendations": string[],
  "complianceStatus": {
    "owasp": string,
    "pci": string,
    "gdpr": string
  }
}`;

    const userPrompt = `Scan this website for security vulnerabilities: ${url}

Perform a ${scanType} security analysis. Provide detailed findings with actionable remediation steps.`;

    // Call Together.ai API
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
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
    const content = data.choices[0].message.content;
    
    console.log('Security scan completed successfully');

    // Try to parse JSON from the response
    let scanResults;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      scanResults = JSON.parse(jsonContent);
    } catch (e) {
      console.log('Could not parse JSON response, returning raw content');
      scanResults = {
        summary: {
          totalVulnerabilities: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          overallRiskScore: 0
        },
        rawAnalysis: content,
        vulnerabilities: [],
        recommendations: []
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
