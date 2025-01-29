import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, search, latitude, longitude, radiusMiles } = await req.json();
    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_TOKEN');

    if (!MAPBOX_TOKEN) {
      throw new Error('MAPBOX_TOKEN is not configured');
    }

    console.log('Search parameters:');
    console.log('- Type:', type);
    console.log('- Search term:', search);
    console.log('- Location:', `[${longitude}, ${latitude}]`);
    console.log('- Radius:', radiusMiles, 'miles');

    // Construct the URL with query parameters in the correct order
    const url = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(search)}&language=en&limit=5&proximity=${longitude},${latitude}&country=US&access_token=${MAPBOX_TOKEN}`;
    
    console.log('Making Mapbox API request:');
    console.log('- Endpoint: Search Box API v1 Forward');
    console.log('- Full URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Mapbox API error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Mapbox API Response:', JSON.stringify(data, null, 2));

    if (!data.features?.length) {
      console.log(`No results found for ${type}`);
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map the features to our Store type
    const stores = data.features
      .filter((feature: any) => {
        const name = feature.properties.name.toLowerCase();
        const searchTerms = search.toLowerCase().split(' ');
        return searchTerms.some(term => name.includes(term.toLowerCase()));
      })
      .map((feature: any) => ({
        id: feature.properties.mapbox_id,
        name: feature.properties.name,
        address: feature.properties.full_address || feature.properties.address,
        phone: "(Call store for details)",
        latitude: feature.properties.coordinates.latitude,
        longitude: feature.properties.coordinates.longitude,
        type: type
      }));

    console.log(`Found ${stores.length} stores for ${type}`);
    console.log('Processed store results:', JSON.stringify(stores, null, 2));
    
    return new Response(
      JSON.stringify(stores),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-stores function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})