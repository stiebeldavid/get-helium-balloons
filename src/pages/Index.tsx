import { Helmet } from 'react-helmet';
import SearchForm from '@/components/SearchForm';
import { Card } from '@/components/ui/card';

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
                <ul className="space-y-2 text-gray-600">
                  <li>Birthday Parties - Make celebrations extra special</li>
                  <li>Graduations - Mark academic achievements</li>
                  <li>Baby Showers - Create magical moments</li>
                  <li>Corporate Events - Add professional flair</li>
                  <li>Holiday Decorations - Enhance festive atmospheres</li>
                </ul>
              </Card>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;