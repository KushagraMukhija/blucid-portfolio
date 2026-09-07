"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    id: "01",
    title: "FILTHY",
    type: "OFFICIAL MUSIC VIDEO",
    src: "/hero.mp4",
    mobileSrc: "/filthy-mobile.mp4",
    accent: "#ffffff",
  },
  {
    id: "02",
    title: "INTEZAAR",
    type: "OFFICIAL VISUALIZER",
    src: "/intezaar.mp4",
    mobileSrc: "/intezaar-mobile.mp4",
    accent: "#9d4edd",
  },
  {
    id: "03",
    title: "GULABI AASMAN",
    type: "OFFICIAL MUSIC VIDEO",
    src: "/gulabi.mp4",
    mobileSrc: "/gulbi-mobile.mp4",
    accent: "#ff007f",
  },
];

export default function FilmReel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the entire reel section while scrolling through the videos
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${chapters.length * 100}%`,
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * chapters.length),
              chapters.length - 1
            );
            setCurrentTrack(index);
          },
        },
      });

      // Cross-fade the video layers seamlessly as scroll progress increases
      chapters.forEach((_, i) => {
        if (i === 0) return;

        tl.to(slideRefs.current[i], {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        }, i);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Sync mute state across all video elements
  const toggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach((vid) => {
      if (vid) vid.muted = nextMuted;
    });
  };

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full bg-black overflow-hidden">
      
      {/* Full-Screen Video Layers */}
      {chapters.map((chap, i) => (
        <div
          key={chap.id}
          ref={(el) => { slideRefs.current[i] = el; }}
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ opacity: i === 0 ? 1 : 0, zIndex: i + 1 }}
        >
          <video
            ref={(el) => { videoRefs.current[i] = el; }}
            poster={chap.src.replace('.mp4', '-poster.jpg')}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={chap.mobileSrc} media="(max-width: 768px)" type="video/mp4" />
            <source src={chap.src} type="video/mp4" />
          </video>
          {/* Atmospheric Color Washes */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

          {/* Chapter Metadata */}
          <div className="absolute top-16 left-8 md:left-16 z-20">
            <span 
              className="text-xs font-bold tracking-[0.4em] uppercase"
              style={{ color: chap.accent }}
            >
              CHAPTER {chap.id}
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-widest uppercase mt-2">
              {chap.title}
            </h2>
            <p className="text-white/40 tracking-[0.25em] text-[10px] md:text-xs uppercase mt-2">
              {chap.type}
            </p>
          </div>
        </div>
      ))}

      {/* Global Cinematic HUD Controls */}
      <div className="absolute bottom-12 right-8 md:right-16 z-30 flex items-center gap-6">
        {/* Track Indicator Dots */}
        <div className="flex gap-2">
          {chapters.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentTrack === i ? "w-8 bg-white" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Unmute / Sound Toggle Button */}
        <button
          onClick={toggleAudio}
          className="px-5 py-2.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white font-mono text-xs tracking-widest uppercase hover:border-white transition-all flex items-center gap-2"
        >
          <span className={`w-2 h-2 rounded-full ${isMuted ? "bg-red-500" : "bg-green-400 animate-pulse"}`} />
          {isMuted ? "SOUND: OFF" : "SOUND: ON"}
        </button>
      </div>
    </section>
  );
}