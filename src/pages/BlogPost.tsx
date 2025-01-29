import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { blogPosts, eventTypes } from '@/data/content';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <h1>Post not found</h1>
          <Link to="/blog">Return to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Balloon Blog</title>
        <meta 
          name="description" 
          content={post.excerpt}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-balloon-purple/10">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
              <article className="p-8 md:p-12">
                <header className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">{post.title}</h1>
                  
                  <div className="flex flex-wrap gap-6 items-center text-gray-600 text-sm border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-balloon-purple" />
                      <time dateTime={post.publishDate} className="font-medium">
                        {new Date(post.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-balloon-purple" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                  </div>
                </header>

                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-balloon-purple prose-a:no-underline hover:prose-a:text-balloon-blue prose-a:transition-colors prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </article>
            </Card>

            {post.relatedEvents.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Related Events</h2>
                <div className="grid gap-4">
                  {post.relatedEvents.map(eventSlug => {
                    const event = eventTypes.find(e => e.slug === eventSlug);
                    return event && (
                      <Link key={event.slug} to={`/events/${event.slug}`}>
                        <Card className="p-6 hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm border-transparent hover:border-balloon-purple/20">
                          <h3 className="font-medium text-balloon-purple hover:text-balloon-blue transition-colors">
                            {event.name}
                          </h3>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;