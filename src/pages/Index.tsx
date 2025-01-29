import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SearchForm from '@/components/SearchForm';
import { Card } from '@/components/ui/card';
import { cities, eventTypes, blogPosts } from '@/data/content';
import { BookOpen } from 'lucide-react';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Find Helium Balloons Near You | Balloon Finder</title>
        <meta 
          name="description" 
          content="Quickly locate stores that sell and fill helium balloons in your area. Find Party City, Dollar Tree, Walmart, CVS, and more locations offering balloon services. Perfect for birthdays, celebrations, and events." 
        />
        <meta name="keywords" content="helium balloons, balloon stores, party supplies, balloon filling, Party City, Dollar Tree, Walmart, CVS" />
        <meta property="og:title" content="Find Helium Balloons Near You | Balloon Finder" />
        <meta 
          property="og:description" 
          content="Instantly locate stores that sell and fill helium balloons in your area. Find the perfect balloon supplier for your next celebration." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-float mb-8">
              <span className="text-6xl">🎈</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-balloon-red to-balloon-purple bg-clip-text text-transparent">
              Find Helium Balloons Near You
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Instantly locate stores that sell and fill helium balloons in your area
            </p>

            <SearchForm />

            <div className="grid md:grid-cols-2 gap-6 mt-16">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Popular Balloon Retailers</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>Walmart - Large selection of balloons and filling services</li>
                  <li>Party City - Specialty balloon designs and custom orders</li>
                  <li>Dollar Tree - Affordable balloon options and basic filling</li>
                  <li>CVS - Convenient locations for quick balloon needs</li>
                  <li>Michaels - Unique balloon decorations and craft supplies</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Perfect For Every Occasion</h2>
                <ul className="space-y-2">
                  {eventTypes.map(event => (
                    <li key={event.slug} className="text-gray-600">
                      <Link to={`/events/${event.slug}`} className="hover:text-blue-600 hover:underline">
                        {event.name}
                      </Link>
                      {' '}- {event.description.split('.')[0]}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="mt-16">
              <div className="flex items-center justify-center gap-2 mb-8">
                <BookOpen className="w-6 h-6 text-balloon-purple" />
                <h2 className="text-2xl font-semibold">Latest from Our Blog</h2>
              </div>
              <div className="grid gap-6 max-w-2xl mx-auto">
                {blogPosts.slice(0, 2).map(post => (
                  <Link key={post.slug} to={`/blog/${post.slug}`}>
                    <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{post.excerpt}</p>
                    </Card>
                  </Link>
                ))}
                <Link 
                  to="/blog"
                  className="inline-flex items-center justify-center gap-2 text-balloon-purple hover:text-balloon-blue transition-colors"
                >
                  <span>Read more articles</span>
                  <BookOpen className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="mt-16 text-left space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-8">Your Guide to Finding Helium Balloons</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">Why Choose Local Balloon Stores?</h3>
                  <p className="text-gray-600">
                    Local balloon retailers offer convenience, expertise, and immediate service. Many stores provide professional filling services, ensuring your balloons are properly inflated and ready for your event. Plus, you can see the quality and colors in person before making your purchase.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Types of Balloon Services</h3>
                  <p className="text-gray-600">
                    Most stores offer latex and foil balloon options, custom balloon bouquets, and professional filling services. Some locations also provide balloon arches, columns, and other decorative arrangements for special events.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 border-t pt-8">
              <h2 className="text-2xl font-semibold mb-6">Popular Cities</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {cities.map(city => (
                  <Link
                    key={city.slug}
                    to={`/city/${city.slug}`}
                    className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
                  >
                    {city.name}, {city.state}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;