import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Music2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Plus,
  Bookmark,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-hcf.jpeg";

interface WPMedia {
  id: number;
  source_url: string;
  title: { rendered: string };
  date: string;
  mime_type: string;
  caption?: { rendered: string };
  description?: { rendered: string };
}

interface LocalComment {
  id: string;
  author: string;
  text: string;
  date: number;
}

const LIKES_KEY = "hcf:videos:likes:v1";
const SAVES_KEY = "hcf:videos:saves:v1";
const FOLLOW_KEY = "hcf:videos:follow:v1";
const COMMENTS_KEY = "hcf:videos:comments:v1";
const COUNTS_KEY = "hcf:videos:counts:v1";

const readJSON = <T,>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const stripHtml = (html: string) => {
  const t = document.createElement("div");
  t.innerHTML = html;
  return t.textContent || "";
};

const formatCount = (n: number) => {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
};

/** Deterministic pseudo-random base counts per video id */
const baseCounts = (id: number) => {
  const seed = (id * 9301 + 49297) % 233280;
  const rand = seed / 233280;
  return {
    likes: 200 + Math.floor(rand * 14_000),
    comments: 5 + Math.floor(rand * 400),
    shares: 2 + Math.floor(rand * 200),
    saves: 1 + Math.floor(rand * 150),
  };
};

const Videos = () => {
  const [videos, setVideos] = useState<WPMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState<Record<number, boolean>>(() => readJSON(LIKES_KEY, {}));
  const [saves, setSaves] = useState<Record<number, boolean>>(() => readJSON(SAVES_KEY, {}));
  const [follow, setFollow] = useState<boolean>(() => readJSON(FOLLOW_KEY, false));
  const [comments, setComments] = useState<Record<number, LocalComment[]>>(() =>
    readJSON(COMMENTS_KEY, {})
  );
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Counts cached so they look stable across refreshes
  const counts = useMemo(() => {
    const stored = readJSON<Record<number, ReturnType<typeof baseCounts>>>(COUNTS_KEY, {});
    const out: Record<number, ReturnType<typeof baseCounts>> = { ...stored };
    videos.forEach((v) => {
      if (!out[v.id]) out[v.id] = baseCounts(v.id);
    });
    writeJSON(COUNTS_KEY, out);
    return out;
  }, [videos]);

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

  // Intersection observer to autoplay the visible video and pause the rest
  useEffect(() => {
    if (!videos.length) return;
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActiveIdx(idx);
            vid.muted = muted;
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { root, threshold: [0, 0.6, 1] }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [videos, muted]);

  // Sync mute across all
  useEffect(() => {
    videoRefs.current.forEach((v) => v && (v.muted = muted));
  }, [muted]);

  const goTo = useCallback(
    (idx: number) => {
      const el = itemRefs.current[idx];
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openComments !== null) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(Math.min(activeIdx + 1, videos.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(Math.max(activeIdx - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        const v = videoRefs.current[activeIdx];
        if (v) v.paused ? v.play() : v.pause();
      } else if (e.key.toLowerCase() === "m") {
        setMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, videos.length, goTo, openComments]);

  const toggleLike = (id: number) => {
    setLikes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJSON(LIKES_KEY, next);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSaves((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJSON(SAVES_KEY, next);
      return next;
    });
    toast({ title: saves[id] ? "Removed from favorites" : "Added to favorites" });
  };

  const toggleFollow = () => {
    setFollow((f) => {
      writeJSON(FOLLOW_KEY, !f);
      return !f;
    });
  };

  const share = async (v: WPMedia) => {
    const url = window.location.origin + "/videos";
    const shareData = { title: "Happyness Come First", text: "Check out this video", url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard" });
      }
    } catch {}
  };

  const submitComment = (id: number) => {
    const text = commentDraft.trim();
    if (!text) return;
    const c: LocalComment = {
      id: crypto.randomUUID(),
      author: "You",
      text,
      date: Date.now(),
    };
    setComments((prev) => {
      const next = { ...prev, [id]: [c, ...(prev[id] || [])] };
      writeJSON(COMMENTS_KEY, next);
      return next;
    });
    setCommentDraft("");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white gap-4">
        <p>No videos yet.</p>
        <Link to="/" className="underline">Back home</Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white">
      {/* Top overlay header */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 pt-4 pb-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="opacity-60">Following</span>
          <span className="relative">
            For You
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full" />
          </span>
        </div>
        <button
          onClick={() => setMuted((m) => !m)}
          className="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Vertical snap feed */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {videos.map((v, idx) => {
          const c = counts[v.id] || baseCounts(v.id);
          const liked = !!likes[v.id];
          const saved = !!saves[v.id];
          const userComments = comments[v.id] || [];
          const totalComments = c.comments + userComments.length;
          const totalLikes = c.likes + (liked ? 1 : 0);
          const title = stripHtml(v.title.rendered);
          const caption = v.caption?.rendered ? stripHtml(v.caption.rendered) : "";

          return (
            <FeedItem
              key={v.id}
              index={idx}
              media={v}
              isActive={idx === activeIdx}
              muted={muted}
              itemRef={(el) => (itemRefs.current[idx] = el)}
              videoRef={(el) => (videoRefs.current[idx] = el)}
            >
              {/* Right action rail */}
              <div className="absolute right-2 bottom-24 sm:bottom-16 flex flex-col items-center gap-5 z-20">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full ring-2 ring-white overflow-hidden bg-white">
                    <img src={logo} alt="HCF" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={toggleFollow}
                    aria-label={follow ? "Unfollow" : "Follow"}
                    className={cn(
                      "absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white",
                      follow ? "bg-emerald-500" : "bg-primary"
                    )}
                  >
                    {follow ? <span className="text-[10px]">✓</span> : <Plus className="w-3 h-3" />}
                  </button>
                </div>

                <ActionButton
                  icon={
                    <Heart
                      className={cn("w-7 h-7 transition-transform", liked && "scale-110")}
                      fill={liked ? "#ef4444" : "none"}
                      stroke={liked ? "#ef4444" : "currentColor"}
                    />
                  }
                  label={formatCount(totalLikes)}
                  onClick={() => toggleLike(v.id)}
                />
                <ActionButton
                  icon={<MessageCircle className="w-7 h-7" />}
                  label={formatCount(totalComments)}
                  onClick={() => setOpenComments(v.id)}
                />
                <ActionButton
                  icon={
                    <Bookmark
                      className="w-7 h-7"
                      fill={saved ? "#facc15" : "none"}
                      stroke={saved ? "#facc15" : "currentColor"}
                    />
                  }
                  label={formatCount(c.saves + (saved ? 1 : 0))}
                  onClick={() => toggleSave(v.id)}
                />
                <ActionButton
                  icon={<Share2 className="w-7 h-7" />}
                  label={formatCount(c.shares)}
                  onClick={() => share(v)}
                />
              </div>

              {/* Bottom info */}
              <div className="absolute left-0 right-16 bottom-6 px-4 z-20 text-white">
                <p className="font-semibold text-base mb-1">@happynesscomefirst</p>
                {title && <p className="text-sm opacity-95 mb-1 line-clamp-2">{title}</p>}
                {caption && <p className="text-xs opacity-80 line-clamp-2">{caption}</p>}
                <div className="flex items-center gap-2 mt-2 text-xs opacity-90">
                  <Music2 className="w-3.5 h-3.5" />
                  <div className="overflow-hidden whitespace-nowrap">
                    <span className="inline-block animate-marquee">
                      Original sound — Happyness Come First Foundation
                    </span>
                  </div>
                </div>
              </div>
            </FeedItem>
          );
        })}
      </div>

      {/* Up / Down arrows (desktop only) */}
      <div className="hidden md:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={() => goTo(Math.max(activeIdx - 1, 0))}
          disabled={activeIdx === 0}
          aria-label="Previous"
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center disabled:opacity-40"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => goTo(Math.min(activeIdx + 1, videos.length - 1))}
          disabled={activeIdx === videos.length - 1}
          aria-label="Next"
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center disabled:opacity-40"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Comments sheet */}
      <Sheet open={openComments !== null} onOpenChange={(o) => !o && setOpenComments(null)}>
        <SheetContent
          side="bottom"
          className="h-[75vh] sm:h-[80vh] rounded-t-2xl p-0 flex flex-col bg-background"
        >
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-center">
              {openComments !== null
                ? formatCount(
                    (counts[openComments]?.comments || 0) +
                      (comments[openComments]?.length || 0)
                  )
                : 0}{" "}
              comments
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {openComments !== null && (comments[openComments]?.length ?? 0) === 0 && (
              <p className="text-center text-muted-foreground text-sm py-12">
                Be the first to comment!
              </p>
            )}
            {openComments !== null &&
              (comments[openComments] || []).map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold shrink-0">
                    {c.author[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{c.author}</p>
                    <p className="text-sm break-words">{c.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(c.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="border-t p-3 flex gap-2 items-center">
            <Input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && openComments !== null) submitComment(openComments);
              }}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={() => openComments !== null && submitComment(openComments)}
              disabled={!commentDraft.trim()}
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <span className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-active:scale-90 transition-transform">
      {icon}
    </span>
    <span className="text-xs font-semibold drop-shadow">{label}</span>
  </button>
);

interface FeedItemProps {
  index: number;
  media: WPMedia;
  isActive: boolean;
  muted: boolean;
  itemRef: (el: HTMLDivElement | null) => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  children: React.ReactNode;
}

const FeedItem = ({ index, media, isActive, muted, itemRef, videoRef, children }: FeedItemProps) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    const v = localRef.current;
    if (!v) return;
    videoRef(v);
    const onTime = () => setProgress(v.currentTime);
    const onLoaded = () => setDuration(v.duration);
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  const onTap = () => {
    const v = localRef.current;
    if (!v) return;
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // double tap = heart
      setShowHeart(true);
      window.setTimeout(() => setShowHeart(false), 700);
      lastTap.current = 0;
      return;
    }
    lastTap.current = now;
    window.setTimeout(() => {
      if (Date.now() - lastTap.current >= 280) {
        v.paused ? v.play() : v.pause();
      }
    }, 290);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = localRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
  };

  return (
    <div
      data-index={index}
      ref={itemRef}
      className="relative h-full w-full snap-start snap-always flex items-center justify-center overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <video
        ref={localRef}
        src={media.source_url}
        className="absolute inset-0 w-full h-full object-contain bg-black cursor-pointer"
        playsInline
        loop
        muted={muted}
        preload={Math.abs(index - 0) < 2 ? "auto" : "metadata"}
        onClick={onTap}
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
      />

      {/* Pause indicator */}
      {paused && isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Play className="w-20 h-20 text-white/80 drop-shadow-lg" fill="currentColor" />
        </div>
      )}

      {/* Heart on double tap */}
      {showHeart && (
        <Heart
          className="absolute w-32 h-32 text-red-500 animate-heart-pop pointer-events-none"
          fill="currentColor"
        />
      )}

      {children}

      {/* Progress scrubber */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={progress}
        onChange={onSeek}
        aria-label="Seek"
        className="absolute bottom-0 left-0 right-0 w-full appearance-none bg-transparent z-20 h-3 tiktok-scrubber"
      />
    </div>
  );
};

export default Videos;
