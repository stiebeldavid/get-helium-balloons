import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
  latitude: number;
  longitude: number;
  radiusMiles: number;
  storeType: string;
  searchTerm: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { latitude, longitude, radiusMiles, storeType, searchTerm } = await req.json() as SearchParams
    
    // Calculate bounding box
    const degreesPerMile = 1 / 69;
    const latDelta = radiusMiles * degreesPerMile;
    const lonDelta = radiusMiles * degreesPerMile / Math.cos(latitude * Math.PI / 180);
    
    const bbox = {
      minLon: longitude - lonDelta,
      minLat: latitude - latDelta,
      maxLon: longitude + lonDelta,
      maxLat: latitude + latDelta
    };

    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_TOKEN');
    if (!MAPBOX_TOKEN) {
      throw new Error('Mapbox token not configured');
    }

    // Construct Mapbox API URL
    const searchUrl = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json`);
    searchUrl.searchParams.set('proximity', `${longitude},${latitude}`);
    searchUrl.searchParams.set('bbox', `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}`);
    searchUrl.searchParams.set('limit', '5');
    searchUrl.searchParams.set('types', 'poi');
    searchUrl.searchParams.set('access_token', MAPBOX_TOKEN);

    console.log(`Searching for ${storeType} with URL:`, searchUrl.toString());

    const response = await fetch(searchUrl.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.features?.length) {
      console.log(`No results found for ${storeType}`);
      return new Response(
        JSON.stringify({ stores: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map the features to our Store type
    const stores = data.features
      .filter((feature: any) => {
        const name = feature.text.toLowerCase();
        const terms = searchTerm.toLowerCase().split(' ');
        return terms.some(term => name.includes(term.toLowerCase()));
      })
      .map((feature: any) => ({
        id: feature.id,
        name: feature.text,
        address: feature.place_name,
        phone: "(Call store for details)",
        latitude: feature.center[1],
        longitude: feature.center[0],
        type: storeType
      }));

    return new Response(
      JSON.stringify({ stores }),
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