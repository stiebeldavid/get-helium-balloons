import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { blogPosts } from '@/data/content';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const BlogIndex = () => {
  return (
    <>
      <Helmet>
        <title>Balloon Blog | Tips & Ideas for Your Events</title>
        <meta 
          name="description" 
          content="Expert tips and ideas for balloon decorations at parties and events. Learn how to make your celebration memorable with our balloon decoration guides."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>

            <h1 className="text-4xl font-bold mb-8">Balloon Blog</h1>
            
            <div className="grid gap-6">
              {blogPosts.map(post => (
                <Card key={post.slug} className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogIndex;