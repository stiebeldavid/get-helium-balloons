import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LocationMap from '@/components/LocationMap';
import StoreList from '@/components/StoreList';
import SearchForm from '@/components/SearchForm';
import { Store, Location } from '@/types';

const SearchResults = () => {
  const { zipCode } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would:
    // 1. Convert ZIP to lat/lng using a geocoding service
    // 2. Fetch nearby stores from our database/API
    // For now, we'll use mock data
    setLocation({
      latitude: 42.3314,
      longitude: -83.0458,
      city: "Detroit",
      state: "MI",
      zipCode: zipCode || "",
    });

    setStores([
      {
        id: "1",
        name: "Walmart Supercenter",
        address: "123 Main St, Detroit, MI",
        phone: "(313) 555-0123",
        latitude: 42.3314,
        longitude: -83.0458,
        type: "Walmart",
      },
      // Add more mock stores here
    ]);

    setLoading(false);
  }, [zipCode]);

  if (loading || !location) {
    return <div>Loading...</div>;
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