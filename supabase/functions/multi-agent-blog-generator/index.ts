import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface Agent {
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
}

const agents: Agent[] = [
  {
    name: "research_agent",
    role: "Research Specialist",
    model: "anthropic/claude-3.5-sonnet",
    systemPrompt: `You are a research specialist focused on finding current trends, topics, and data relevant to cybersecurity and business technology. Your job is to:
    1. Identify trending topics in the cybersecurity industry
    2. Find relevant statistics and data points
    3. Suggest timely angles for blog content
    4. Provide sources and references
    
    Return your findings in JSON format with: trending_topics, key_statistics, content_angles, sources.`
  },
  {
    name: "strategist_agent",
    role: "Content Strategist",
    model: "openai/gpt-4-turbo",
    systemPrompt: `You are a content strategist who creates comprehensive blog post outlines with SEO optimization. Your job is to:
    1. Create detailed blog post structures
    2. Identify target keywords and SEO opportunities
    3. Plan content sections and flow
    4. Suggest internal/external linking strategies
    
    Return your strategy in JSON format with: title, meta_description, keywords, outline, seo_recommendations.`
  },
  {
    name: "writer_agent",
    role: "Content Writer",
    model: "anthropic/claude-3.5-sonnet",
    systemPrompt: `You are an expert cybersecurity content writer who creates engaging, informative blog posts. Your job is to:
    1. Write compelling, well-researched content
    2. Use a professional but approachable tone
    3. Include actionable insights and practical advice
    4. Structure content for readability and engagement
    
    Write in markdown format and return the complete blog post content.`
  },
  {
    name: "editor_agent",
    role: "Content Editor",
    model: "openai/gpt-4-turbo",
    systemPrompt: `You are a professional editor specializing in cybersecurity content. Your job is to:
    1. Review and refine content for clarity and flow
    2. Ensure technical accuracy and consistency
    3. Optimize for readability and engagement
    4. Check grammar, style, and tone
    
    Return the edited content along with a summary of changes made.`
  },
  {
    name: "seo_agent",
    role: "SEO Specialist",
    model: "openai/gpt-4-turbo",
    systemPrompt: `You are an SEO specialist who optimizes content for search engines. Your job is to:
    1. Finalize meta descriptions and titles
    2. Identify and optimize keyword density
    3. Suggest internal linking opportunities
    4. Create alt text for images
    5. Calculate SEO score and provide recommendations
    
    Return your optimization in JSON format with: meta_title, meta_description, keywords, seo_score, recommendations.`
  }
];

async function callOpenRouter(agent: Agent, prompt: string, context: any = null): Promise<any> {
  const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
  
  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key not found');
  }

  const messages = [
    { role: 'system', content: agent.systemPrompt },
    { role: 'user', content: context ? `Context: ${JSON.stringify(context)}\n\nTask: ${prompt}` : prompt }
  ];

  console.log(`Calling ${agent.name} with model ${agent.model}`);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openRouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://cesiumcyber.com',
      'X-Title': 'CesiumCyber Blog Generator'
    },
    body: JSON.stringify({
      model: agent.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenRouter API error for ${agent.name}:`, errorText);
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateWeeklyBlog(topic?: string): Promise<any> {
  const results: any = {};
  
  try {
    // Step 1: Research Agent
    console.log("Starting research phase...");
    const researchPrompt = topic 
      ? `Research current trends and information about: ${topic}` 
      : "Research current trending topics in cybersecurity, data privacy, and business technology for this week.";
    
    const researchResult = await callOpenRouter(agents[0], researchPrompt);
    results.research = researchResult;
    
    // Parse research results (try to parse as JSON, fallback to text)
    let researchData;
    try {
      researchData = JSON.parse(researchResult);
    } catch {
      researchData = { summary: researchResult };
    }

    // Step 2: Content Strategist
    console.log("Starting strategy phase...");
    const strategyPrompt = "Based on the research findings, create a comprehensive blog post strategy with SEO optimization.";
    const strategyResult = await callOpenRouter(agents[1], strategyPrompt, researchData);
    results.strategy = strategyResult;

    // Parse strategy results
    let strategyData;
    try {
      strategyData = JSON.parse(strategyResult);
    } catch {
      strategyData = { summary: strategyResult };
    }

    // Step 3: Content Writer
    console.log("Starting writing phase...");
    const writingPrompt = "Write a complete, engaging blog post based on the research and strategy.";
    const writingResult = await callOpenRouter(agents[2], writingPrompt, {
      research: researchData,
      strategy: strategyData
    });
    results.content = writingResult;

    // Step 4: Content Editor
    console.log("Starting editing phase...");
    const editingPrompt = "Review and refine this blog post content for clarity, flow, and engagement.";
    const editingResult = await callOpenRouter(agents[3], editingPrompt, writingResult);
    results.edited_content = editingResult;

    // Step 5: SEO Optimization
    console.log("Starting SEO optimization phase...");
    const seoPrompt = "Optimize this blog post for SEO and provide final metadata.";
    const seoResult = await callOpenRouter(agents[4], seoPrompt, editingResult);
    results.seo = seoResult;

    // Parse SEO results
    let seoData;
    try {
      seoData = JSON.parse(seoResult);
    } catch {
      seoData = { summary: seoResult };
    }

    // Prepare final blog post data
    const finalBlogPost = {
      title: strategyData.title || "Generated Blog Post",
      content: editingResult,
      meta_description: seoData.meta_description || strategyData.meta_description,
      meta_title: seoData.meta_title || strategyData.title,
      keywords: seoData.keywords || strategyData.keywords,
      seo_score: seoData.seo_score || 75,
      ai_generated_summary: researchData.summary || "AI-generated blog post",
      slug: (strategyData.title || "generated-post").toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'draft',
      ai_keywords: seoData.keywords || strategyData.keywords
    };

    results.final_post = finalBlogPost;
    
    return results;

  } catch (error) {
    console.error("Error in multi-agent blog generation:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, save_to_db = false, author_id } = await req.json();

    console.log("Starting multi-agent blog generation process...");
    
    // Generate the blog post using multiple agents
    const blogResults = await generateWeeklyBlog(topic);

    // Optionally save to database
    if (save_to_db && author_id) {
      console.log("Saving blog post to database...");
      
      const { data: blogPost, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          ...blogResults.final_post,
          author_id: author_id
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error saving blog post:", insertError);
        throw new Error(`Failed to save blog post: ${insertError.message}`);
      }

      blogResults.saved_post = blogPost;
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...blogResults,
        agents_used: agents.map(a => ({
          name: a.name,
          role: a.role,
          model: a.model
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in multi-agent-blog-generator function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Multi-agent blog generation failed"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});