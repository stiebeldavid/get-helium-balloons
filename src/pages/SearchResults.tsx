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

  const fetchStores = async (latitude: number, longitude: number, radius: number, mapboxToken: string) => {
    const storePromises = STORE_SEARCHES.map(async ({ type, search }) => {
      // Convert radius from miles to meters (1 mile ≈ 1609.34 meters)
      const radiusMeters = radius * 1609.34;
      
      // Enhanced search URL with better parameters
      const url = new URL('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(search) + '.json');
      url.searchParams.append('proximity', `${longitude},${latitude}`);
      url.searchParams.append('types', 'poi');
      url.searchParams.append('limit', '5');
      url.searchParams.append('radius', radiusMeters.toString());
      url.searchParams.append('fuzzyMatch', 'true');
      url.searchParams.append('access_token', mapboxToken);
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.features) {
          console.error('No features returned for type:', type);
          return [];
        }

        // Filter results to ensure they match our search term more closely
        const filteredFeatures = data.features.filter((feature: any) => {
          const name = feature.text.toLowerCase();
          const searchTerms = search.toLowerCase().split(' ');
          return searchTerms.some(term => name.includes(term.toLowerCase()));
        });

        return filteredFeatures.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          address: feature.place_name,
          phone: "(Call store for details)", // Mapbox doesn't provide phone numbers
          latitude: feature.center[1],
          longitude: feature.center[0],
          type: type as Store['type']
        }));
      } catch (error) {
        console.error(`Error fetching ${type} stores:`, error);
        return [];
      }
    });

    const storeResults = await Promise.all(storePromises);
    return storeResults.flat();
  };

  useEffect(() => {
    const initializeSearch = async () => {
      try {
        setLoading(true);
        
        // Get Mapbox token from Supabase
        const { data: { MAPBOX_TOKEN }, error: secretError } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'MAPBOX_TOKEN' }
        });

        if (secretError || !MAPBOX_TOKEN) {
          throw new Error('Could not retrieve Mapbox token');
        }
        
        // First, convert ZIP code to coordinates using Mapbox Geocoding API
        const geocodingResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?country=US&types=postcode&access_token=${MAPBOX_TOKEN}`
        );
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
          zipCode: zipCode || "",
        });

        // Search for stores with current radius
        const storeResults = await fetchStores(latitude, longitude, searchRadius, MAPBOX_TOKEN);
        setStores(storeResults);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Error finding stores. Please try again.');
        setLoading(false);
      }
    };

    if (zipCode) {
      initializeSearch();
    }
  }, [zipCode, searchRadius]);

  const handleRadiusChange = (value: number[]) => {
    setSearchRadius(value[0]);
  };

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