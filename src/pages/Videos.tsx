import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";

interface WPMedia {
  id: number;
  source_url: string;
  title: { rendered: string };
  date: string;
  mime_type: string;
  media_type: string;
  caption?: { rendered: string };
}

const Videos = () => {
  const [videos, setVideos] = useState<WPMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let page = 1;
        const all: WPMedia[] = [];
        while (page <= 10) {
          const res = await fetch(
            `https://happynesscomefirst.com/wp-json/wp/v2/media?media_type=video&per_page=100&page=${page}`
          );
          if (!res.ok) break;
          const data: WPMedia[] = await res.json();
          if (!Array.isArray(data) || data.length === 0) break;
          all.push(...data);
          if (data.length < 100) break;
          page++;
        }
        setVideos(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const stripHtml = (html: string) => {
    const t = document.createElement("div");
    t.innerHTML = html;
    return t.textContent || "";
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-16 bg-gradient-to-r from-secondary/90 to-primary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Videos</h1>
          <p className="text-lg md:text-xl text-white/90">Watch our latest community moments</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No videos yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v) => (
                <Card key={v.id} className="overflow-hidden shadow-card">
                  <div className="aspect-video bg-black w-full">
                    <video
                      controls
                      preload="metadata"
                      className="w-full h-full object-contain"
                    >
                      <source src={v.source_url} type={v.mime_type} />
                    </video>
                  </div>
                  <CardContent className="p-4">
                    <h3
                      className="font-heading font-semibold mb-1 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: v.title.rendered }}
                    />
                    <p className="text-xs text-muted-foreground mb-2">{formatDate(v.date)}</p>
                    {v.caption?.rendered && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {stripHtml(v.caption.rendered)}
                      </p>
                    )}
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

export default Videos;
