import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LocationMap from '@/components/LocationMap';
import StoreList from '@/components/StoreList';
import SearchForm from '@/components/SearchForm';
import { Store, Location } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORE_SEARCHES = [
  { type: 'Kroger', search: 'Kroger' },
  { type: 'Albertsons', search: 'Albertsons' },
  { type: 'Publix', search: 'Publix' },
  { type: 'Safeway', search: 'Safeway' },
  { type: 'Food Lion', search: 'Food Lion' },
  { type: 'Dollar Tree', search: 'Dollar Tree' },
  { type: 'Dollar General', search: 'Dollar General' },
  { type: 'Family Dollar', search: 'Family Dollar' },
  { type: 'Five Below', search: 'Five Below' },
  { type: '99 Cents Only', search: '99 Cents Only' },
  { type: 'Walmart', search: 'Walmart' },
  { type: 'Michaels', search: 'Michaels' },
  { type: 'CVS', search: 'CVS' }
];

const EXCLUDED_STORE_NAMES = [
  'cvs pharmacy',
  'cvs photo',
  'minuteclinic cvs',
  'kroger fuel',
  'kroger deli',
  'kroger pharmacy',
  'safeway lending',
  'safeway bakery',
  'safeway pharmacy',
  'walmart money center',
  'walmart business center',
  'walmart vision',
  'walmart glasses',
  'walmart patio',
  'walmart garden',
  'walmart baby',
  'walmart nursery'
];

const calculateBoundingBox = (latitude: number, longitude: number, radiusMiles: number) => {
  const degreesPerMile = 1 / 69;
  const latDelta = radiusMiles * degreesPerMile;
  const lonDelta = radiusMiles * degreesPerMile / Math.cos(latitude * Math.PI / 180);

  return {
    minLon: longitude - lonDelta,
    minLat: latitude - latDelta,
    maxLon: longitude + lonDelta,
    maxLat: latitude + latDelta
  };
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const searchStore = async (
  type: string,
  search: string,
  latitude: number,
  longitude: number,
  radiusMiles: number,
  mapboxToken: string
): Promise<Store[]> => {
  try {
    const bbox = calculateBoundingBox(latitude, longitude, radiusMiles);
    const searchUrl = new URL('https://api.mapbox.com/search/searchbox/v1/forward');
    
    searchUrl.searchParams.set('q', search);
    searchUrl.searchParams.set('proximity', `${longitude},${latitude}`);
    searchUrl.searchParams.set('bbox', `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}`);
    searchUrl.searchParams.set('limit', '5');
    searchUrl.searchParams.set('types', 'poi');
    searchUrl.searchParams.set('access_token', mapboxToken);

    console.log(`Searching for ${type}`);

    const response = await fetch(searchUrl.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.features?.length) {
      console.log(`No results found for ${type}`);
      return [];
    }

    return data.features
      .filter((feature: any) => {
        const name = feature.properties.name?.toLowerCase() || '';
        const searchTerm = search.toLowerCase();
        
        // First check if it matches the search term
        if (!name.includes(searchTerm)) {
          return false;
        }
        
        // Then check if it contains any excluded terms
        return !EXCLUDED_STORE_NAMES.some(excluded => name.includes(excluded));
      })
      .map((feature: any) => ({
        id: feature.id,
        name: feature.properties.name,
        address: feature.properties.full_address || feature.place_name,
        phone: "(Call store for details)",
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        type: type as Store['type']
      }));
  } catch (error) {
    console.error(`Error searching for ${type}:`, error);
    return [];
  }
};

const SearchResults = () => {
  const { zipCode } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(5);
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>();

  useEffect(() => {
    const initializeSearch = async () => {
      if (!zipCode) return;

      try {
        setLoading(true);
        
        const { data: { MAPBOX_TOKEN }, error: secretError } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'MAPBOX_TOKEN' }
        });

        if (secretError || !MAPBOX_TOKEN) {
          throw new Error('Could not retrieve Mapbox token');
        }
        
        const geocodingUrl = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json`);
        geocodingUrl.searchParams.set('country', 'US');
        geocodingUrl.searchParams.set('types', 'postcode');
        geocodingUrl.searchParams.set('access_token', MAPBOX_TOKEN);
        
        const geocodingResponse = await fetch(geocodingUrl.toString());
        if (!geocodingResponse.ok) {
          throw new Error('Failed to geocode ZIP code');
        }
        
        const geocodingData = await geocodingResponse.json();
        
        if (!geocodingData.features?.length) {
          throw new Error('ZIP code not found');
        }

        const [longitude, latitude] = geocodingData.features[0].center;
        const placeName = geocodingData.features[0].place_name;
        const [city, stateZip] = placeName.split(', ').slice(0, 2);
        const state = stateZip.split(' ')[0];

        setLocation({
          latitude,
          longitude,
          city,
          state,
          zipCode: zipCode,
        });

        const storeResults = await Promise.all(
          STORE_SEARCHES.map(({ type, search }) =>
            searchStore(type, search, latitude, longitude, searchRadius, MAPBOX_TOKEN)
          )
        );
        
        // Flatten and sort the results by distance
        const sortedStores = storeResults
          .flat()
          .map(store => ({
            ...store,
            distance: calculateDistance(latitude, longitude, store.latitude, store.longitude)
          }))
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setStores(sortedStores);

        // Log the search results to Supabase
        const { error: insertError } = await supabase
          .from('searches')
          .insert({
            zip_code: zipCode,
            first_result: sortedStores[0]?.name || null,
            second_result: sortedStores[1]?.name || null,
            third_result: sortedStores[2]?.name || null
          });

        if (insertError) {
          console.error('Error logging search:', insertError);
        }

      } catch (error) {
        console.error('Error in search initialization:', error);
        toast.error('Error finding stores. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeSearch();
  }, [zipCode, searchRadius]);

  if (loading || !location) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-balloon-red"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Helium Balloons in {location?.city}, {location?.state} | Balloon Finder</title>
        <meta 
          name="description" 
          content={`Find stores that sell and fill helium balloons in ${location?.city}, ${location?.state}. Compare prices and services at Walmart, Party City, Dollar Tree, and more locations near ${zipCode}.`}
        />
        <meta 
          name="keywords" 
          content={`helium balloons ${location?.city}, balloon stores ${location?.state}, party supplies ${zipCode}, balloon filling services`} 
        />
        <meta 
          property="og:title" 
          content={`Helium Balloons in ${location?.city}, ${location?.state} | Balloon Finder`} 
        />
        <meta 
          property="og:description" 
          content={`Discover the best places to buy and fill helium balloons in ${location?.city}. Compare local stores and find the perfect balloon supplier near you.`} 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="md:hidden mb-4">
              <Link to="/">
                <ChevronLeft className="h-6 w-6 text-gray-500" />
              </Link>
            </div>
            
            <div className="hidden md:flex justify-between items-center mb-8">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <SearchForm />
            </div>

            <div className="md:hidden mb-8">
              <SearchForm />
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">
                Helium Balloons in {location?.city}, {location?.state}
              </h1>
              <p className="text-gray-600">
                Find local stores that sell and fill helium balloons near {zipCode}. Compare prices, services, and locations to find the perfect balloon supplier for your needs.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <LocationMap 
                  stores={stores} 
                  center={[location?.longitude || 0, location?.latitude || 0]}
                  selectedStoreId={selectedStoreId}
                />
              </div>
              <div>
                <StoreList 
                  stores={stores} 
                  searchRadius={searchRadius}
                  onRadiusChange={setSearchRadius}
                  onStoreSelect={setSelectedStoreId}
                />
              </div>
            </div>

            <div className="mt-12 text-left">
              <h2 className="text-2xl font-semibold mb-6">About Balloon Services in {location?.city}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">Local Balloon Options</h3>
                  <p className="text-gray-600">
                    Stores in {location?.city} offer a variety of balloon services, from basic helium filling to elaborate balloon arrangements. Many locations provide both latex and foil balloons, with options for custom designs and professional decoration services.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">Pricing Information</h3>
                  <p className="text-gray-600">
                    Balloon prices vary by store and type. Basic helium filling services typically start around $1-2 per balloon, while specialty arrangements and custom designs may cost more. Contact stores directly for current pricing and package deals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;