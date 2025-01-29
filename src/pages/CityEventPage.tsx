import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { cities, eventTypes } from '@/data/content';
import { Card } from '@/components/ui/card';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CityEventPage = () => {
  const { eventType, citySlug } = useParams();
  const event = eventTypes.find(e => e.slug === eventType);
  const city = cities.find(c => c.slug === citySlug);

  if (!event || !city) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <h1>Page not found</h1>
          <Link to="/">Return home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event.name} Helium Balloons in {city.name} | Balloon Finder</title>
        <meta 
          name="description" 
          content={`Find the perfect helium balloons for your ${event.name.toLowerCase()} in ${city.name}. Compare local balloon suppliers, prices, and services for your special event.`}
        />
        <meta 
          name="keywords" 
          content={`helium balloons ${city.name}, ${event.name.toLowerCase()}, balloon decorations ${city.name}, party supplies ${city.state}`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Link to={`/events/${event.slug}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back to {event.name}
                </Button>
              </Link>
              <SearchForm />
            </div>

            <h1 className="text-4xl font-bold mb-6">
              {event.name} Helium Balloons in {city.name}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Find the perfect balloon suppliers for your {event.name.toLowerCase()} in {city.name}. 
              Compare local services, prices, and balloon options to make your event unforgettable.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Popular Areas in {city.name}</h2>
                <ul className="space-y-2">
                  {city.popularAreas.map(area => (
                    <li key={area} className="text-gray-600">
                      Find {event.name.toLowerCase()} balloon suppliers in {area}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Popular Balloon Types</h2>
                <ul className="space-y-2">
                  {event.popularBalloonTypes.map(type => (
                    <li key={type} className="text-gray-600">{type}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="prose max-w-none">
              <h2>Planning Your {event.name} in {city.name}</h2>
              <p>
                Make your {event.name.toLowerCase()} in {city.name} extra special with professional balloon decorations. 
                Local suppliers offer:
              </p>
              <ul>
                <li>Custom balloon arrangements and designs</li>
                <li>Professional setup and installation</li>
                <li>Delivery throughout {city.name}</li>
                <li>Coordination with your event theme and colors</li>
                <li>Expert advice on balloon selection and care</li>
              </ul>

              <h2>Tips for {event.name} Balloon Decorations</h2>
              <ul>
                {event.tips.map(tip => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityEventPage;