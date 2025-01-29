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

// New helper function to calculate distance between two points
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
        const searchTerms = search.toLowerCase().split(' ');
        return searchTerms.some(term => name.includes(term.toLowerCase()));
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
