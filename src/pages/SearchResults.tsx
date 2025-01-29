import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LocationMap from '@/components/LocationMap';
import StoreList from '@/components/StoreList';
import SearchForm from '@/components/SearchForm';
import { Store, Location } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const STORE_TYPES = ['Kroger', 'Albertsons', 'Publix', 'Safeway', 'Food Lion', 'Dollar Tree', 'Dollar General', 'Walmart', 'Michaels', 'CVS'];

const SearchResults = () => {
  const { zipCode } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
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

        // Now search for stores near this location
        const storePromises = STORE_TYPES.map(async (type) => {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${type}.json?proximity=${longitude},${latitude}&types=poi&limit=2&access_token=${MAPBOX_TOKEN}`
          );
          const data = await response.json();
          return data.features.map((feature: any) => ({
            id: feature.id,
            name: feature.text,
            address: feature.place_name,
            phone: "(Call store for details)", // Mapbox doesn't provide phone numbers
            latitude: feature.center[1],
            longitude: feature.center[0],
            type: type as Store['type']
          }));
        });

        const storeResults = await Promise.all(storePromises);
        setStores(storeResults.flat());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Error finding stores. Please try again.');
        setLoading(false);
      }
    };

    if (zipCode) {
      fetchStores();
    }
  }, [zipCode]);

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
        <title>Helium Balloons in {location.city}, {location.state} | Balloon Finder</title>
        <meta 
          name="description" 
          content={`Find stores that sell and fill helium balloons in ${location.city}, ${location.state}. Locations include Walmart, CVS, Party City, and more.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <SearchForm />
            </div>

            <h1 className="text-3xl font-bold mb-6">
              Helium Balloon Stores in {location.city}, {location.state}
            </h1>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <LocationMap 
                  stores={stores} 
                  center={[location.longitude, location.latitude]} 
                />
              </div>
              <div>
                <StoreList stores={stores} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;