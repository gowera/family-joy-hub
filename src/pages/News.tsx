import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroNews from "@/assets/hero-news.jpg";

interface WordPressPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface NewsProps { categorySlug?: string; title?: string; subtitle?: string }

const News = ({ categorySlug, title = "News & Updates", subtitle = "Stay informed about our latest activities and community stories" }: NewsProps = {}) => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [categorySlug]);

  const fetchPosts = async () => {
    try {
      const base = "https://happynesscomefirst.com/wp-json/wp/v2";
      let catParam = "";
      if (categorySlug) {
        const cr = await fetch(`${base}/categories?slug=${categorySlug}`);
        const cats = await cr.json();
        if (!Array.isArray(cats) || !cats[0]) { setPosts([]); return; }
        catParam = `&categories=${cats[0].id}`;
      }
      const response = await fetch(`${base}/posts?_embed&per_page=${categorySlug ? 100 : 12}${catParam}`);
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="py-32 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroNews})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in text-white">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-lg"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No articles found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className="overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {post._embedded?.["wp:featuredmedia"]?.[0] && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post._embedded["wp:featuredmedia"][0].source_url}
                        alt={
                          post._embedded["wp:featuredmedia"][0].alt_text ||
                          post.title.rendered
                        }
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h3
                      className="text-xl font-heading font-semibold mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {stripHtml(post.excerpt.rendered)}
                    </p>
                    <Link to={`/news/${post.slug}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Read More <ArrowRight className="w-3 h-3 ml-1" />
                      </Badge>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
