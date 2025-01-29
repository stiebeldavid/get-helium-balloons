import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { blogPosts } from '@/data/content';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

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
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            <article className="prose max-w-none">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex gap-4 text-gray-600 mb-8">
                <span>{post.author}</span>
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>

              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;