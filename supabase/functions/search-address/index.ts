import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query) {
      throw new Error('Query is required')
    }

    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_TOKEN')
    if (!MAPBOX_TOKEN) {
      throw new Error('Mapbox token not configured')
    }

    // Use the Mapbox Search Box API
    const searchUrl = new URL(`https://api.mapbox.com/search/searchbox/v1/suggest`);
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('language', 'en');
    searchUrl.searchParams.set('country', 'US');
    searchUrl.searchParams.set('types', 'postcode');
    searchUrl.searchParams.set('access_token', MAPBOX_TOKEN);

    console.log('Searching with URL:', searchUrl.toString());

    const response = await fetch(searchUrl.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})