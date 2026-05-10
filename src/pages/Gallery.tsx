import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  title: { rendered: string };
  media_type: string;
  mime_type: string;
  media_details?: {
    sizes?: {
      medium?: { source_url: string };
      large?: { source_url: string };
      thumbnail?: { source_url: string };
    };
  };
}

const Gallery = () => {
  const [items, setItems] = useState<WPMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WPMedia | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let page = 1;
        const all: WPMedia[] = [];
        while (page <= 10) {
          const res = await fetch(
            `https://happynesscomefirst.com/wp-json/wp/v2/media?media_type=image&per_page=100&page=${page}`
          );
          if (!res.ok) break;
          const data: WPMedia[] = await res.json();
          if (!Array.isArray(data) || data.length === 0) break;
          all.push(...data);
          if (data.length < 100) break;
          page++;
        }
        setItems(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-16 bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Gallery</h1>
          <p className="text-lg md:text-xl text-white/90">Moments captured from our community</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading gallery...</p>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No images yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {items.map((m) => {
                const thumb =
                  m.media_details?.sizes?.medium?.source_url ||
                  m.media_details?.sizes?.thumbnail?.source_url ||
                  m.source_url;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className="aspect-square overflow-hidden rounded-lg shadow-card group"
                  >
                    <img
                      src={thumb}
                      alt={m.alt_text || m.title.rendered}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-5xl p-2 bg-black/95 border-0">
          {selected && (
            <img
              src={selected.media_details?.sizes?.large?.source_url || selected.source_url}
              alt={selected.alt_text || selected.title.rendered}
              className="w-full h-auto max-h-[85vh] object-contain mx-auto"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
