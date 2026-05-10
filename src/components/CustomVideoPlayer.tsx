import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomVideoPlayerProps {
  src: string;
  type?: string;
  poster?: string;
  className?: string;
}

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const CustomVideoPlayer = ({ src, type, poster, className }: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [started, setStarted] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      setIsPortrait(v.videoHeight > v.videoWidth);
      setDuration(v.duration);
      setIsLoading(false);
    };
    const onTime = () => setCurrent(v.currentTime);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onEnd = () => setIsPlaying(false);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => {
        setIsPlaying(true);
        setStarted(true);
      }).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = Number(e.target.value);
    v.currentTime = t;
    setCurrent(t);
  };

  const goFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  const scheduleHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setShowControls(true);
    hideTimer.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={scheduleHide}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={cn(
        "relative w-full max-w-full overflow-hidden bg-black rounded-xl group select-none",
        isPortrait
          ? "mx-auto aspect-[9/16] max-h-[80vh] sm:max-w-[360px]"
          : "aspect-video",
        className
      )}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        playsInline
        preload="metadata"
        poster={poster}
        onClick={togglePlay}
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        // @ts-expect-error - non-standard attribute
        disableRemotePlayback
      >
        <source src={src} type={type} />
      </video>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {/* Big play button (initial / paused) */}
      {!isPlaying && !isLoading && (
        <button
          aria-label="Play"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black ml-1" fill="currentColor" />
          </span>
        </button>
      )}

      {/* Controls overlay */}
      {started && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 px-3 pb-3 pt-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity",
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          )}
        >
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={onSeek}
            className="w-full h-1 accent-primary cursor-pointer"
          />
          <div className="flex items-center gap-2 mt-2 text-white text-xs">
            <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
            </button>
            <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="tabular-nums">{formatTime(current)} / {formatTime(duration)}</span>
            <button onClick={goFullscreen} aria-label="Fullscreen" className="ml-auto">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
