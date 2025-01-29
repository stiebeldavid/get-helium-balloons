import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { eventTypes, cities } from '@/data/content';
import { Card } from '@/components/ui/card';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const EventPage = () => {
  const { eventType } = useParams();
  const event = eventTypes.find(e => e.slug === eventType);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <h1>Event type not found</h1>
          <Link to="/">Return home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Helium Balloons for {event.name} | Balloon Finder</title>
        <meta 
          name="description" 
          content={`Find the perfect helium balloons for your ${event.name.toLowerCase()}. Compare balloon suppliers, prices, and services for your special event.`}
        />
        <meta 
          name="keywords" 
          content={`helium balloons ${event.name.toLowerCase()}, balloon decorations, party supplies, event planning`}
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
              Helium Balloons for {event.name}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              {event.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Planning Tips</h2>
                <ul className="space-y-2">
                  {event.tips.map(tip => (
                    <li key={tip} className="text-gray-600">
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Popular Cities</h2>
                <ul className="space-y-2">
                  {cities.map(city => (
                    <li key={city.slug}>
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
              <h2>Popular Balloon Types for {event.name}</h2>
              <ul>
                {event.popularBalloonTypes.map(type => (
                  <li key={type}>{type}</li>
                ))}
              </ul>

              <h2>Why Choose Professional Balloon Services?</h2>
              <p>
                Professional balloon services ensure your {event.name.toLowerCase()} decorations are:
              </p>
              <ul>
                <li>Properly inflated and secured</li>
                <li>Arranged beautifully for maximum impact</li>
                <li>Durable throughout your event</li>
                <li>Coordinated with your event theme and colors</li>
                <li>Set up and installed by experienced professionals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventPage;