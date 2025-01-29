import { Helmet } from 'react-helmet';
import SearchForm from '@/components/SearchForm';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Find Helium Balloons Near You | Balloon Finder</title>
        <meta name="description" content="Locate stores that sell and fill helium balloons near you. Find Walmart, CVS, Party City, and more locations that offer helium balloon services." />
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
                <h2 className="text-xl font-semibold mb-4">Popular Stores</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>Walmart</li>
                  <li>Party City</li>
                  <li>Dollar Tree</li>
                  <li>CVS</li>
                  <li>Michaels</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Perfect For</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>Birthday Parties</li>
                  <li>Celebrations</li>
                  <li>Special Events</li>
                  <li>Decorations</li>
                  <li>Gifts</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;