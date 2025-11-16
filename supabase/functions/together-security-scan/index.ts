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

    // Call Together.ai API with tool calling for structured output
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
        max_tokens: 16000,
        tools: [{
          type: "function",
          function: {
            name: "report_security_vulnerabilities",
            description: "Report security vulnerabilities found during the scan",
            parameters: {
              type: "object",
              properties: {
                summary: {
                  type: "object",
                  properties: {
                    totalVulnerabilities: { type: "number" },
                    critical: { type: "number" },
                    high: { type: "number" },
                    medium: { type: "number" },
                    low: { type: "number" },
                    overallRiskScore: { type: "number" }
                  },
                  required: ["totalVulnerabilities", "critical", "high", "medium", "low", "overallRiskScore"]
                },
                vulnerabilities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      severity: { type: "string", enum: ["Critical", "High", "Medium", "Low"] },
                      category: { type: "string" },
                      description: { type: "string" },
                      impact: { type: "string" },
                      location: { type: "string" },
                      remediation: {
                        type: "object",
                        properties: {
                          steps: { type: "array", items: { type: "string" } },
                          codeExample: { type: "string" },
                          references: { type: "array", items: { type: "string" } }
                        }
                      }
                    },
                    required: ["id", "title", "severity", "category", "description", "impact", "location", "remediation"]
                  }
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" }
                },
                complianceStatus: {
                  type: "object",
                  properties: {
                    owasp: { type: "string" },
                    pci: { type: "string" },
                    gdpr: { type: "string" }
                  }
                }
              },
              required: ["summary", "vulnerabilities", "recommendations"]
            }
          }
        }],
        tool_choice: {
          type: "function",
          function: { name: "report_security_vulnerabilities" }
        }
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

    // Extract structured results from tool call
    let scanResults;
    try {
      const toolCall = data.choices[0].message.tool_calls?.[0];
      if (toolCall && toolCall.function) {
        scanResults = JSON.parse(toolCall.function.arguments);
      } else {
        // Fallback to parsing content if tool call not used
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonContent = jsonMatch ? jsonMatch[1] : content;
        scanResults = JSON.parse(jsonContent);
      }
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
        recommendations: ["Unable to complete detailed scan. Please try again or contact support."]
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
