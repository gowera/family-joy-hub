import { useState, useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Facebook, Twitter, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";

interface WordPressPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({ name: "", email: "", message: "" });
  const contentRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Root[]>([]);

  useEffect(() => {
    if (!post || !contentRef.current) return;
    // Cleanup previous roots
    rootsRef.current.forEach((r) => {
      try { r.unmount(); } catch { /* noop */ }
    });
    rootsRef.current = [];

    const container = contentRef.current;
    const videos = Array.from(container.querySelectorAll("video"));
    videos.forEach((vid) => {
      const sourceEl = vid.querySelector("source");
      const src = vid.getAttribute("src") || sourceEl?.getAttribute("src") || "";
      const type = vid.getAttribute("type") || sourceEl?.getAttribute("type") || undefined;
      if (!src) return;
      const wrapper = document.createElement("div");
      wrapper.className = "my-6 max-w-full";
      vid.parentNode?.replaceChild(wrapper, vid);
      const root = createRoot(wrapper);
      root.render(<CustomVideoPlayer src={src} type={type} />);
      rootsRef.current.push(root);
    });

    return () => {
      rootsRef.current.forEach((r) => {
        try { r.unmount(); } catch { /* noop */ }
      });
      rootsRef.current = [];
    };
  }, [post]);


  useEffect(() => {
    if (slug) {
      fetchPost(slug);
      fetchRecentPosts();
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const response = await fetch(
        `https://happynesscomefirst.com/wp-json/wp/v2/posts?slug=${postSlug}&_embed`
      );
      const data = await response.json();
      if (data.length > 0) {
        setPost(data[0]);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch(
        "https://happynesscomefirst.com/wp-json/wp/v2/posts?_embed&per_page=3"
      );
      const data = await response.json();
      setRecentPosts(data);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Comment Submitted!",
      description: "Thank you for your comment. It will be reviewed shortly.",
    });
    setComment({ name: "", email: "", message: "" });
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${window.location.href}&text=${post?.title.rendered}`,
      "_blank"
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${post?.title.rendered}&body=${window.location.href}`;
  };

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(post?.title.rendered || "")} ${window.location.href}`,
      "_blank"
    );
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Link to="/news">
            <Button>Back to News</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Article Content */}
      <article className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/news" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>

            {/* Featured Image */}
            {post._embedded?.["wp:featuredmedia"]?.[0] && (
              <div className="rounded-2xl overflow-hidden shadow-card mb-8">
                <img
                  src={post._embedded["wp:featuredmedia"][0].source_url}
                  alt={post._embedded["wp:featuredmedia"][0].alt_text || post.title.rendered}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-heading font-bold mb-6"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b">
              <Button variant="outline" size="sm" onClick={shareOnFacebook}>
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnTwitter}>
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={shareViaWhatsApp}>
                <Share2 className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={shareViaEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div
                  className="prose prose-lg max-w-none mb-12 break-words overflow-hidden
                    [&_*]:max-w-full
                    [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:shadow-card [&_img]:mx-auto [&_img]:my-6
                    [&_iframe]:max-w-full [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:rounded-xl
                    [&_video]:max-w-full [&_video]:h-auto [&_video]:rounded-xl
                    [&_figure]:max-w-full [&_figure]:my-6
                    [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:block
                    [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-foreground/90
                    [&>h1]:mt-10 [&>h1]:mb-6 [&>h1]:font-heading [&>h1]:text-2xl md:[&>h1]:text-3xl [&>h1]:font-bold
                    [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:font-heading [&>h2]:text-xl md:[&>h2]:text-2xl [&>h2]:font-semibold
                    [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:font-heading [&>h3]:text-lg md:[&>h3]:text-xl [&>h3]:font-semibold
                    [&>h4]:mt-6 [&>h4]:mb-3 [&>h4]:font-heading [&>h4]:text-base md:[&>h4]:text-lg [&>h4]:font-medium
                    [&_.wp-block-image]:my-6 [&_.wp-block-image]:max-w-full [&_.wp-block-image_img]:rounded-xl [&_.wp-block-image_img]:shadow-card [&_.wp-block-image_img]:max-w-full [&_.wp-block-image_img]:h-auto
                    [&_.wp-block-embed]:max-w-full [&_.wp-block-embed]:my-6
                    [&_.wp-block-embed__wrapper]:relative [&_.wp-block-embed__wrapper]:w-full [&_.wp-block-embed__wrapper]:aspect-video
                    [&_.wp-block-embed__wrapper>iframe]:absolute [&_.wp-block-embed__wrapper>iframe]:inset-0 [&_.wp-block-embed__wrapper>iframe]:w-full [&_.wp-block-embed__wrapper>iframe]:h-full
                    [&>ul]:my-6 [&>ul]:pl-6 [&>ul>li]:mb-3
                    [&>ol]:my-6 [&>ol]:pl-6 [&>ol>li]:mb-3
                    [&>blockquote]:my-8 [&>blockquote]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:italic [&>blockquote]:text-muted-foreground
                    [&_figure_img]:rounded-xl [&_figure_img]:shadow-card [&_figure_img]:mx-auto [&_figure_figcaption]:text-center [&_figure_figcaption]:text-sm [&_figure_figcaption]:text-muted-foreground [&_figure_figcaption]:mt-3
                    [&_a]:text-primary [&_a]:underline [&_a]:break-words [&_a:hover]:text-primary/80
                    [&>strong]:font-semibold [&>strong]:text-foreground
                    [&_.aligncenter]:mx-auto [&_.aligncenter]:block
                    [&_pre]:overflow-x-auto [&_pre]:max-w-full
                    [&_code]:break-words"
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />

                {/* Comment Form */}
                <Card className="shadow-card">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-heading font-bold mb-6">Leave a Comment</h2>
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name *
                          </label>
                          <Input
                            id="name"
                            value={comment.name}
                            onChange={(e) => setComment({ ...comment, name: e.target.value })}
                            required
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email *
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={comment.email}
                            onChange={(e) => setComment({ ...comment, email: e.target.value })}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Comment *
                        </label>
                        <Textarea
                          id="message"
                          value={comment.message}
                          onChange={(e) => setComment({ ...comment, message: e.target.value })}
                          required
                          rows={5}
                          placeholder="Share your thoughts..."
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Submit Comment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Sticky */}
              <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
                {/* Recent Posts */}
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heading font-semibold mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {recentPosts.map((recentPost) => (
                        <Link
                          key={recentPost.id}
                          to={`/news/${recentPost.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            {recentPost._embedded?.["wp:featuredmedia"]?.[0] && (
                              <img
                                src={recentPost._embedded["wp:featuredmedia"][0].source_url}
                                alt={recentPost.title.rendered}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div>
                              <h4
                                className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors"
                                dangerouslySetInnerHTML={{ __html: recentPost.title.rendered }}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(recentPost.date)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="bg-primary/5 border-primary">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heading font-semibold mb-3">Join Our Community</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pre-book your spot and become part of our inclusive family hub!
                    </p>
                    <Link to="/contact">
                      <Button className="w-full">Contact Us</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default NewsArticle;
