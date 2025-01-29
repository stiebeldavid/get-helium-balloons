import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LocationMap from '@/components/LocationMap';
import StoreList from '@/components/StoreList';
import SearchForm from '@/components/SearchForm';
import { Store, Location } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

// More specific search terms for better results
const STORE_SEARCHES = [
  { type: 'Kroger', search: 'Kroger Grocery Store' },
  { type: 'Albertsons', search: 'Albertsons Grocery Store' },
  { type: 'Publix', search: 'Publix Super Market' },
  { type: 'Safeway', search: 'Safeway Grocery Store' },
  { type: 'Food Lion', search: 'Food Lion Grocery Store' },
  { type: 'Dollar Tree', search: 'Dollar Tree Store' },
  { type: 'Dollar General', search: 'Dollar General Store' },
  { type: 'Walmart', search: 'Walmart Supercenter' },
  { type: 'Michaels', search: 'Michaels Arts and Crafts' },
  { type: 'CVS', search: 'CVS Pharmacy' }
];

const SearchResults = () => {
  const { zipCode } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(20);

  // Separate function to handle individual store search
  const searchStore = async (
    type: string,
    search: string,
    latitude: number,
    longitude: number,
    radiusMeters: number,
    mapboxToken: string
  ): Promise<Store[]> => {
    try {
      const searchUrl = new URL('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(search) + '.json');
      searchUrl.searchParams.set('proximity', `${longitude},${latitude}`);
      searchUrl.searchParams.set('types', 'poi');
      searchUrl.searchParams.set('limit', '5');
      searchUrl.searchParams.set('radius', radiusMeters.toString());
      searchUrl.searchParams.set('fuzzyMatch', 'true');
      searchUrl.searchParams.set('access_token', mapboxToken);

      const response = await fetch(searchUrl.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features?.length) {
        console.log(`No results found for ${type}`);
        return [];
      }

      // Filter results to ensure they match our search term more closely
      return data.features
        .filter((feature: any) => {
          const name = feature.text.toLowerCase();
          const searchTerms = search.toLowerCase().split(' ');
          return searchTerms.some(term => name.includes(term.toLowerCase()));
        })
        .map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          address: feature.place_name,
          phone: "(Call store for details)",
          latitude: feature.center[1],
          longitude: feature.center[0],
          type: type as Store['type']
        }));
    } catch (error) {
      console.error(`Error searching for ${type}:`, error);
      return [];
    }
  };

  const fetchStores = async (latitude: number, longitude: number, radius: number, mapboxToken: string) => {
    const radiusMeters = radius * 1609.34; // Convert miles to meters
    
    try {
      const results = await Promise.all(
        STORE_SEARCHES.map(({ type, search }) =>
          searchStore(type, search, latitude, longitude, radiusMeters, mapboxToken)
        )
      );
      
      return results.flat();
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  };

  useEffect(() => {
    const initializeSearch = async () => {
      if (!zipCode) return;

      try {
        setLoading(true);
        
        // Get Mapbox token from Supabase
        const { data: { MAPBOX_TOKEN }, error: secretError } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'MAPBOX_TOKEN' }
        });

        if (secretError || !MAPBOX_TOKEN) {
          throw new Error('Could not retrieve Mapbox token');
        }
        
        // Convert ZIP code to coordinates
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

        // Search for stores
        const storeResults = await fetchStores(latitude, longitude, searchRadius, MAPBOX_TOKEN);
        setStores(storeResults);
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
          content={`Find stores that sell and fill helium balloons in ${location?.city}, ${location?.state}. Locations include Walmart, CVS, Party City, and more.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <SearchForm />
            </div>

            <h1 className="text-3xl font-bold mb-6">
              Helium Balloon Stores in {location?.city}, {location?.state}
            </h1>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <LocationMap 
                  stores={stores} 
                  center={[location?.longitude || 0, location?.latitude || 0]} 
                />
              </div>
              <div>
                <StoreList 
                  stores={stores} 
                  searchRadius={searchRadius}
                  onRadiusChange={setSearchRadius}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;