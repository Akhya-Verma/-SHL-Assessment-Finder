import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, query_type = 'natural_language' } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing ${query_type} query: ${query.substring(0, 100)}...`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all assessments
    const { data: assessments, error: dbError } = await supabase
      .from('assessments')
      .select('*');

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to fetch assessments');
    }

    const assessmentList = assessments?.map(a => ({
      name: a.name,
      description: a.description,
      test_type: a.test_type,
      duration: a.duration
    }));
    
    // Keyword-based matching to rank assessments by relevance to the query
    const keywords = query.toLowerCase().split(/\s+/);
    const scored = assessments?.map(a => {
      let score = 0;
      const searchText = `${a.name} ${a.description || ''} ${(a.test_type || []).join(' ')}`.toLowerCase();
      keywords.forEach((kw: string) => {
        if (searchText.includes(kw)) score++;
      });
      return { ...a, score };
    }).sort((a, b) => b.score - a.score).slice(0, 10);

    const recommended = (scored && scored.length > 0 ? scored : assessments?.slice(0, 10))?.map(a => ({
      url: a.url,
      name: a.name,
      adaptive_support: a.adaptive_support,
      description: a.description || '',
      duration: a.duration || 0,
      remote_support: a.remote_support,
      test_type: a.test_type || [],
    }));

    // Log query
    await supabase.from('query_logs').insert({
      query,
      query_type,
      recommendations: recommended,
    });

    console.log(`Returning ${recommended?.length} recommendations`);

    return new Response(JSON.stringify({ recommended_assessments: recommended }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in recommend function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});