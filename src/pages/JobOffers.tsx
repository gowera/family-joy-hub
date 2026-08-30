import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

interface WordPressPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  date: string;
  categories?: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

const JOB_CATEGORY_SLUGS = [
  "offers",
  "offres-demploi",
  "offres-d-emploi",
  "offres-demploi",
  "jobs",
  "job-opportunities",
];

const JobOffers = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobOffers();
  }, []);

  const fetchJobOffers = async () => {
    try {
      const categoryRequest = fetch(
        "https://happynesscomefirst.com/wp-json/wp/v2/categories?per_page=100"
      );
      const postsRequest = fetch(
        "https://happynesscomefirst.com/wp-json/wp/v2/posts?_embed&per_page=12"
      );
      const jobListingsRequest = fetch(
        "https://happynesscomefirst.com/wp-json/wp/v2/job-listings?_embed&per_page=12"
      );

      const [categoriesResult, postsResult, jobListingsResult] = await Promise.allSettled([
        categoryRequest,
        postsRequest,
        jobListingsRequest,
      ]);

      const categories = categoriesResult.status === "fulfilled"
        ? await categoriesResult.value.json()
        : [];

      const matchingCategoryIds = new Set(
        categories
          .filter((category: { slug?: string }) =>
            category.slug && JOB_CATEGORY_SLUGS.includes(category.slug.toLowerCase())
          )
          .map((category: { id: number }) => category.id)
      );

      const regularPosts = postsResult.status === "fulfilled"
        ? await postsResult.value.json()
        : [];

      const jobListings = jobListingsResult.status === "fulfilled"
        ? await jobListingsResult.value.json()
        : [];

      const categoryPosts = Array.isArray(regularPosts)
        ? regularPosts.filter((post: WordPressPost) =>
            post.categories && post.categories.some((categoryId) => matchingCategoryIds.has(categoryId))
          )
        : [];

      const merged = [...categoryPosts, ...jobListings].filter((post, index, array) => {
        const key = `${post.id}-${post.slug}`;
        return array.findIndex((item) => `${item.id}-${item.slug}` === key) === index;
      });

      setPosts(merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Error fetching job offers:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

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

      <section className="py-24 bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wide">Career</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Job Opportunities</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Discover current openings and opportunities with Happiness Comes First.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading job opportunities...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="max-w-2xl mx-auto rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <h2 className="text-2xl font-heading font-semibold mb-3">Job opportunities coming soon</h2>
              <p className="text-muted-foreground">
                This section will publish the organisation’s vacancies under the “Offers” / “offres d’emploi” category.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden shadow-card hover:shadow-warm transition-all duration-300">
                  {post._embedded?.["wp:featuredmedia"]?.[0] && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post._embedded["wp:featuredmedia"][0].source_url}
                        alt={post._embedded["wp:featuredmedia"][0].alt_text || post.title.rendered}
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
                      {stripHtml(post.excerpt?.rendered || "") || "Job opportunity details available in the listing."}
                    </p>
                    <Link to={`/poste/${post.slug}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        View opening <ArrowRight className="w-3 h-3 ml-1" />
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

export default JobOffers;
