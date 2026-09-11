"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const TARGET_PLAYLIST_ID = "PLeKIag4eOk4Y"; 

interface VideoItem {
  id: string;
  title: string;
}

interface GridGalleryProps {
  onVideoChange?: (videoId: string, videoTitle: string) => void;
}

import { useGlobalAudio } from "@/components/GlobalAudioProvider";

export default function GridGallery({ onVideoChange }: GridGalleryProps) {
  const { pauseForVideo, resumeFromVideo } = useGlobalAudio();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [currentCaption, setCurrentCaption] = useState("[ STREAM INITIALIZING ]");
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    if (isMuted) {
      resumeFromVideo();
    } else {
      pauseForVideo();
    }
    return () => {
      resumeFromVideo();
    };
  }, [isMuted, pauseForVideo, resumeFromVideo]);
  
  const playerRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const subtitlesRef = useRef<{ start: number; dur: number; text: string }[]>([]);

  const activeVideo = videos[activeIndex];
  const gridVideos = videos.filter((_, i) => i !== activeIndex);
  
  const maxVisible = 2; 
  const showMoreButton = gridVideos.length > maxVisible;
  const visibleVideos = gridVideos.slice(0, maxVisible);
  
  // Notify parent view whenever active song changes so background video updates
  useEffect(() => {
    if (activeVideo && onVideoChange) {
      onVideoChange(activeVideo.id, activeVideo.title);
    }
  }, [activeVideo, onVideoChange]);

  useEffect(() => {
    const fetchYouTubePlaylist = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!API_KEY) {
        // Fallback to static data if API key is missing (e.g. deployed without env variable)
        setVideos([
          { id: "T2VET_NP924", title: "Aarzoo" },
          { id: "-inrJVsJHuk", title: "Gulabi Aasman" },
          { id: "hmqcpsEooPA", title: "Intezaar" },
          { id: "LKuzs6O6VDU", title: "Filthy" }
        ]);
        setIsLoading(false);
        return;
      }
      try {
        const videosRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${TARGET_PLAYLIST_ID}&part=snippet&maxResults=25`
        );
        const videosData = await videosRes.json();
        if (videosData.items?.length > 0) {
          const formatted: VideoItem[] = videosData.items.map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title.split('|')[0].trim(),
          }));
          setVideos(formatted);
        }
      } catch (err) {
        console.error("Fetch Failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchYouTubePlaylist();
  }, []);

  useEffect(() => {
    if (!activeVideo) return;
    setCurrentCaption("[ FETCHING AUTOMATED CAPTIONS ]");
    subtitlesRef.current = [];

    const fetchLiveCaptions = async () => {
      try {
        let targetUrl = `https://www.youtube.com/api/timedtext?v=${activeVideo.id}&lang=hi&fmt=json3`;
        let res = await fetch(`https://corsproxy.io/?` + encodeURIComponent(targetUrl));
        if (!res.ok) {
          targetUrl = `https://www.youtube.com/api/timedtext?v=${activeVideo.id}&lang=en&fmt=json3`;
          res = await fetch(`https://corsproxy.io/?` + encodeURIComponent(targetUrl));
        }
        if (!res.ok) throw new Error("No accessible caption tracks");
        const data = await res.json();

        if (data?.events) {
          subtitlesRef.current = data.events
            .filter((ev: any) => ev.segs)
            .map((ev: any) => ({
              start: ev.tStartMs / 1000,
              dur: (ev.dDurationMs || 3000) / 1000,
              text: ev.segs.map((s: any) => s.utf8).join("").trim()
            }));
        } else throw new Error("Empty track data");
      } catch (e) {
        subtitlesRef.current = [{ start: 0, dur: 9999, text: activeVideo.title + " // ARCHIVE STREAM ACTIVE" }];
      }
    };
    fetchLiveCaptions();
  }, [activeVideo?.id]);

  useEffect(() => {
    if (!activeVideo) return;
    setCurrentCaption("[ MUSIC ]");
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
    if ((window as any).YT?.Player) buildOrUpdatePlayer(activeVideo.id);
    else (window as any).onYouTubeIframeAPIReady = () => buildOrUpdatePlayer(activeVideo.id);

    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, activeVideo?.id]);

  const buildOrUpdatePlayer = (videoId: string) => {
    if (playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(videoId);
      updateMute(isMuted); return;
    }
    playerRef.current = new (window as any).YT.Player("blucid-yt-engine", {
      videoId: videoId,
      playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0, showinfo: 0, iv_load_policy: 3, fs: 0, playsinline: 1, enablejsapi: 1, cc_load_policy: 0 },
      events: {
        onReady: (event: any) => { updateMute(isMuted); event.target.playVideo(); startZeroLatencySync(); },
      },
    });
  };

  const updateMute = (muted: boolean) => {
    if (playerRef.current?.mute) muted ? playerRef.current.mute() : playerRef.current.unMute();
  };

  const startZeroLatencySync = () => {
    const updateLoop = () => {
      if (playerRef.current?.getCurrentTime) {
        try {
          const time = playerRef.current.getCurrentTime();
          const activeSub = subtitlesRef.current.find(sub => time >= sub.start && time <= (sub.start + sub.dur + 0.5));
          setCurrentCaption(activeSub?.text ? activeSub.text.replace(/\n/g, " ") : "[ MUSIC ]");
        } catch (e) {}
      }
      requestRef.current = requestAnimationFrame(updateLoop);
    };
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(updateLoop);
  };

  const handleSwapTransition = (originalIndex: number, vidId: string) => {
    const stage = document.getElementById("stage-video-wrapper");
    const thumb = document.getElementById(`thumb-${vidId}`);
    
    if (!stage || !thumb) {
      setActiveIndex(originalIndex); setIsMuted(false); return;
    }

    const sRect = stage.getBoundingClientRect();
    const tRect = thumb.getBoundingClientRect();
    const xDist = tRect.left - sRect.left, yDist = tRect.top - sRect.top;
    const scaleX = tRect.width / sRect.width, scaleY = tRect.height / sRect.height;

    const tl = gsap.timeline();
    tl.to(stage, {
      x: xDist, y: yDist, scaleX, scaleY, transformOrigin: "top left", opacity: 0, duration: 0.45, ease: "power3.inOut",
      onComplete: () => {
        setActiveIndex(originalIndex); setIsMuted(false);
        gsap.set(stage, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
        gsap.fromTo(stage, 
          { x: xDist, y: yDist, scaleX, scaleY, opacity: 0, transformOrigin: "top left" },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    }, 0);
    tl.to(thumb, { scale: 1.15, opacity: 0, duration: 0.45, ease: "power3.inOut", onComplete: () => gsap.set(thumb, { scale: 1, opacity: 1 }) }, 0);
  };

  if (apiKeyMissing) return <div className="w-full h-[400px] bg-[#0A0A0A] rounded-xl flex items-center justify-center text-[#FF007F] text-xs uppercase font-mono border border-[#FF007F]/20 p-8">[ SYSTEM OFFLINE : AWAITING YOUTUBE API KEY ]</div>;
  if (isLoading || videos.length === 0) return <div className="w-full h-[400px] bg-[#0A0A0A] rounded-xl flex items-center justify-center text-white/40 text-xs uppercase font-mono animate-pulse">Syncing Archive Data...</div>;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 relative">
      
      <div className="flex-1 flex flex-col gap-4">
        <div id="stage-video-wrapper" className="relative w-full aspect-video bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] will-change-transform">
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none z-10" />
          <div className="absolute inset-0 w-full h-full"><div id="blucid-yt-engine" className="w-full h-full pointer-events-none" /></div>
          <div className="absolute inset-0 z-20 bg-transparent cursor-default" />
          <div className="absolute top-4 left-6 z-30 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse shadow-[0_0_10px_#FF007F]" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/70 uppercase">Signal Active</span>
          </div>
          <button 
            onClick={() => { setIsMuted(!isMuted); updateMute(!isMuted); }}
            className="absolute bottom-6 right-6 z-30 px-5 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white/90 hover:bg-white hover:text-black tracking-[0.2em] text-[10px] uppercase transition-all duration-300"
          >
            {isMuted ? "Sound Off" : "Sound On"}
          </button>
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        <div className="w-full p-6 md:p-8 bg-[#0A0A0A] rounded-xl border border-white/5 relative overflow-hidden min-h-[160px] flex flex-col justify-between shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF007F]/10 blur-[60px] pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-4"><div className="h-[1px] w-8 bg-white/20" /><span className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase">Current Stream</span></div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.9] line-clamp-2">{activeVideo.title}</h2>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#FF007F] uppercase mt-6 drop-shadow-[0_0_8px_rgba(255,0,127,0.4)]">{currentCaption}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full">
          {visibleVideos.map((vid) => {
            const originalIndex = videos.findIndex(v => v.id === vid.id);
            return (
              <button
                id={`thumb-${vid.id}`} key={vid.id} onClick={() => handleSwapTransition(originalIndex, vid.id)}
                className="group relative w-full aspect-square bg-[#050505] rounded-xl overflow-hidden border border-white/5 hover:border-[#FF007F]/40 hover:shadow-[0_0_20px_rgba(255,0,127,0.1)] transition-all duration-500 will-change-transform shrink-0"
              >
                <Image src={`https://img.youtube.com/vi/${vid.id}/maxresdefault.jpg`} alt={vid.title} fill className="object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-70" />
                <div className="absolute bottom-3 left-0 w-full text-center z-20 px-2 translate-y-1 opacity-60 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white font-bold drop-shadow-md">{vid.title.substring(0, 15)}{vid.title.length > 15 ? '...' : ''}</span>
                </div>
              </button>
            );
          })}
          
          {showMoreButton && (
            <button onClick={() => setShowArchive(true)} className="group relative w-full aspect-square bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-[#FF007F]/50 flex flex-col items-center justify-center gap-2 transition-all duration-500 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-[#FF007F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-6 h-[1px] bg-[#FF007F] opacity-50 group-hover:w-10 group-hover:opacity-100 transition-all duration-500" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 group-hover:text-white uppercase transition-colors">+{gridVideos.length - maxVisible} More</span>
              <div className="w-6 h-[1px] bg-[#FF007F] opacity-50 group-hover:w-10 group-hover:opacity-100 transition-all duration-500" />
            </button>
          )}
        </div>
      </div>

      {showArchive && (
        <JackpotArchiveOverlay 
          videos={gridVideos} 
          onSelect={(vidId) => {
            const idx = videos.findIndex(v => v.id === vidId);
            handleSwapTransition(idx, vidId);
            setShowArchive(false);
          }}
          onClose={() => setShowArchive(false)}
        />
      )}
    </div>
  );
}

// Jackpot Archive Slot Machine
function JackpotArchiveOverlay({ videos, onSelect, onClose }: { videos: VideoItem[], onSelect: (id: string) => void, onClose: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(0);
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const entranceVelocity = useRef(300); 
  
  const ITEM_HEIGHT = 160; 
  const totalOriginalHeight = videos.length * ITEM_HEIGHT;
  const displayVideos = [...videos, ...videos, ...videos];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      const deadzone = 0.15; 
      
      if (Math.abs(normalizedY) < deadzone) {
        speedRef.current = 0;
      } else {
        const sign = Math.sign(normalizedY);
        const intensity = (Math.abs(normalizedY) - deadzone) / (1 - deadzone);
        speedRef.current = sign * -1 * Math.pow(intensity, 1.5) * 45; 
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- Mobile Touch Swipe Logic ---
    let lastTouchY = 0;
    let touchVelocity = 0;

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
      touchVelocity = 0;
      speedRef.current = 0;
      entranceVelocity.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - lastTouchY;
      lastTouchY = currentY;
      touchVelocity = deltaY;
      targetYRef.current += deltaY * 1.5; 
    };

    const handleTouchEnd = () => {
      // Transfer finger swipe momentum into the decaying entrance velocity for smooth coasting
      entranceVelocity.current = -touchVelocity * 2.0;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    let raf: number;
    const tick = () => {
      entranceVelocity.current *= 0.94;
      targetYRef.current += speedRef.current - entranceVelocity.current;
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.1; 

      if (currentYRef.current <= -totalOriginalHeight * 2) {
        currentYRef.current += totalOriginalHeight;
        targetYRef.current += totalOriginalHeight;
      } else if (currentYRef.current >= -totalOriginalHeight) {
        currentYRef.current -= totalOriginalHeight;
        targetYRef.current -= totalOriginalHeight;
      }

      const velocity = speedRef.current - entranceVelocity.current;
      const stretch = 1 + Math.abs(velocity) * 0.004;

      if (trackRef.current) {
        gsap.set(trackRef.current, { y: currentYRef.current, scaleY: stretch });
      }
      raf = requestAnimationFrame(tick);
    };

    currentYRef.current = -totalOriginalHeight;
    targetYRef.current = -totalOriginalHeight;
    raf = requestAnimationFrame(tick);

    gsap.fromTo("#archive-wrapper", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(raf);
    };
  }, [totalOriginalHeight]);

  const triggerClose = () => {
    gsap.to("#archive-wrapper", { opacity: 0, duration: 0.4, ease: "power2.inOut", onComplete: onClose });
  };

  return (
    <div id="archive-wrapper" className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center overflow-hidden font-sans">
      
      <style>{`
        .archive-title {
          color: transparent;
          -webkit-text-stroke: 2px rgba(255,255,255,0.15);
          line-height: 1;
        }
        .archive-item:hover .archive-title {
          color: #FF007F;
          -webkit-text-stroke: 2px #FF007F;
          transform: scale(1.05);
        }
      `}</style>

      <div className="absolute top-0 w-full px-8 py-8 flex justify-between items-center z-50">
        <span className="text-xs font-mono tracking-[0.4em] text-[#FF007F] uppercase">Select a song</span>
        <button onClick={triggerClose} className="text-xs font-mono tracking-[0.3em] text-white/50 hover:text-white uppercase transition-colors">
          [ Close ]
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center opacity-30">
        <div className="w-[80vw] h-[1px] bg-white/20" />
        <div className="absolute w-[1px] h-[80vh] bg-white/20" />
        <div className="absolute w-24 h-12 border border-[#FF007F]/40" />
      </div>

      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black via-black/80 to-transparent z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none" />

      <div ref={trackRef} className="absolute top-0 left-0 flex flex-col items-center w-full will-change-transform z-10">
        {displayVideos.map((vid, i) => (
          <div key={`${vid.id}-${i}`} className="flex items-center justify-center cursor-pointer archive-item w-full" style={{ height: ITEM_HEIGHT }} onClick={() => onSelect(vid.id)}>
            <h2 className="text-5xl md:text-8xl lg:text-[7rem] font-black uppercase tracking-tighter transition-all duration-300 archive-title">
              {vid.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}