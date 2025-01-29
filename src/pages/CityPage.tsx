import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { cities, eventTypes } from '@/data/content';
import { Card } from '@/components/ui/card';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CityPage = () => {
  const { citySlug } = useParams();
  const city = cities.find(c => c.slug === citySlug);

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <h1>City not found</h1>
          <Link to="/">Return home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Helium Balloons in {city.name} | Balloon Finder</title>
        <meta 
          name="description" 
          content={`Find helium balloon suppliers in ${city.name}. Compare prices and services for balloon delivery, filling, and custom arrangements for all occasions.`}
        />
        <meta 
          name="keywords" 
          content={`helium balloons ${city.name}, balloon stores ${city.state}, party supplies ${city.name}, balloon delivery ${city.name}`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <SearchForm />
            </div>

            <h1 className="text-4xl font-bold mb-6">
              Helium Balloons in {city.name}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              {city.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Popular Areas We Serve</h2>
                <ul className="space-y-2">
                  {city.popularAreas.map(area => (
                    <li key={area} className="text-gray-600">
                      Find balloon suppliers in {area}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Event Types</h2>
                <ul className="space-y-2">
                  {eventTypes.map(event => (
                    <li key={event.slug}>
                      <Link 
                        to={`/events/${event.slug}/${city.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {event.name} in {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="prose max-w-none">
              <h2>Finding Balloon Suppliers in {city.name}</h2>
              <p>
                Whether you're planning a birthday party, wedding, corporate event, or any other celebration in {city.name}, 
                finding the right balloon supplier is crucial. Our directory helps you locate stores that offer:
              </p>
              <ul>
                <li>Professional balloon filling services</li>
                <li>Custom balloon arrangements and decorations</li>
                <li>Delivery options throughout {city.name}</li>
                <li>Balloon arches, columns, and other party decorations</li>
                <li>Expert advice on balloon selection and care</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityPage;