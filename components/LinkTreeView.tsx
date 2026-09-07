// blucid-world/components/LinkTreeView.tsx
"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface LinkTreeViewProps {
  onBack: () => void;
}

const STREAMING_LINKS = [
  {
    id: "spotify",
    title: "Spotify",
    handle: "Blucid // Verified Artist Profile",
    url: "https://open.spotify.com/artist/1FFiPSDZLaISNkRQtmCi4O?si=I991jvDTTieBNmlYE7aguw",
    badge: "PRIMARY",
  },
  {
    id: "ytmusic",
    title: "YT Music",
    handle: "@blucidmusic // Official Audio",
    url: "https://music.youtube.com/@blucidmusic",
    badge: "AUDIO",
  },
  {
    id: "youtube",
    title: "YouTube",
    handle: "@blucidmusic // Cinematic Visualizers",
    url: "https://www.youtube.com/@blucidmusic",
    badge: "VIDEO",
  },
  {
    id: "instagram",
    title: "Instagram",
    handle: "@blucidworld // Nocturnal Transmissions",
    url: "https://www.instagram.com/blucidworld/",
    badge: "SOCIAL",
  },
];

export default function LinkTreeView({ onBack }: LinkTreeViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(bgRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" }, 0)
        .fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
        .fromTo(headerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.4)
        .fromTo(listRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.5)
        .fromTo(listRef.current?.querySelectorAll('.link-item') || [], { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, 0.5);
    });

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onBack });

      tl.to([listRef.current, headerRef.current, navRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      }, 0);
      tl.to(bgRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.2);
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPos = (e.clientX / innerWidth - 0.5) * 12;
      const yPos = (e.clientY / innerHeight - 0.5) * 12;

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          x: xPos,
          y: yPos,
          duration: 1.4,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      ref={viewRef} 
      className="w-full min-h-screen relative text-white selection:bg-white selection:text-black z-50 overflow-x-hidden"
      style={{ '--theme-color': '#E2B4CD' } as React.CSSProperties}
    >
      {/* BASE BLACK */}
      <div className="fixed inset-0 bg-[#040404] z-[-3] pointer-events-none" />

      {/* FULL-SCREEN BACKGROUND VIDEO */}
      <div
        ref={bgRef}
        className="fixed inset-[-5%] w-[110%] h-[110%] z-[-2] pointer-events-none opacity-0 will-change-transform"
      >
        <video 
          src="/inte.mp4" 
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover contrast-100 brightness-[0.8] saturate-[1.3]"
          style={{ filter: "blur(12px)", objectPosition: "center 20%", opacity: 0.8 }}
        />
        {/* Soft pastel pink filter matching 2nd image */}
        <div className="absolute inset-0 bg-[#E2B4CD]/30 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-[#E2B4CD]/20 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* VIGNETTE & GRADIENT OVERLAYS for depth */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,#040404_90%)] opacity-70" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* NOISE TEXTURE */}
      <div className="fixed inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[-1] pointer-events-none" />

      {/* TOP NAVIGATION */}
      <nav ref={navRef} className="relative w-full max-w-7xl mx-auto px-8 py-8 flex justify-between items-center border-b border-white/10 opacity-0 z-10">
        <button 
          onClick={handleClose}
          className="group relative font-mono text-xs tracking-[0.4em] uppercase text-white/50 hover:text-[#E2B4CD] transition-colors duration-300 bg-transparent border-none cursor-pointer pb-2"
        >
          ← Return to Portal
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E2B4CD] transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(226,180,205,0.8)]" />
        </button>

        <button
          onClick={handleCopyLink}
          className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors bg-transparent border border-white/15 px-3 py-1.5 rounded cursor-pointer flex items-center gap-2"
        >
          <span>{copied ? "SIGNAL COPIED ✓" : "SHARE SIGNAL ↗"}</span>
        </button>
      </nav>

      {/* PROFILE HEADER */}
      <div ref={headerRef} className="relative w-full max-w-xl mx-auto px-6 pt-12 pb-8 flex flex-col items-center text-center opacity-0 z-10">
        <h1
          className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-2 leading-none"
          style={{
            margin: 0,
            viewTransitionName: "link-tree-title",
            textShadow: "0px 6px 30px rgba(0,0,0,0.9)",
          }}
        >
          Link Tree
        </h1>

        <span className="text-[#E2B4CD] font-mono text-xs tracking-[0.4em] uppercase mb-4 drop-shadow-[0_0_8px_rgba(226,180,205,0.4)]">
          BLUCID // DIRECT FREQUENCY RELAY
        </span>

        <p className="text-white/60 font-mono text-xs tracking-wider uppercase max-w-md leading-relaxed">
          Streaming releases, audiovisual chapters, and nocturnal broadcasts.
        </p>

        {/* Live Audio Equalizer Waveform Indicator */}
        <div className="flex items-center gap-1.5 mt-6 px-4 py-2 bg-black/40 border border-white/10 rounded-full">
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/50 uppercase mr-2">
            BROADCAST STATUS:
          </span>
          <div className="flex items-end gap-1 h-3">
            <span className="w-1 bg-[#E2B4CD] animate-[bounce_1.2s_ease-in-out_infinite] h-full shadow-[0_0_8px_rgba(226,180,205,0.6)]" />
            <span className="w-1 bg-[#E2B4CD] animate-[bounce_1.5s_ease-in-out_0.2s_infinite] h-2/3 shadow-[0_0_8px_rgba(226,180,205,0.6)]" />
            <span className="w-1 bg-[#E2B4CD] animate-[bounce_1.1s_ease-in-out_0.4s_infinite] h-full shadow-[0_0_8px_rgba(226,180,205,0.6)]" />
            <span className="w-1 bg-[#E2B4CD] animate-[bounce_1.4s_ease-in-out_0.1s_infinite] h-1/2 shadow-[0_0_8px_rgba(226,180,205,0.6)]" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-[#E2B4CD] ml-2 drop-shadow-[0_0_8px_rgba(226,180,205,0.4)]">
            LIVE 24/7
          </span>
        </div>
      </div>

      {/* LINK LIST — streaming only, no archive/newsletter */}
      <section ref={listRef} className="relative w-full max-w-md mx-auto px-6 pb-28 opacity-0 z-10 flex flex-col gap-4">
        {/* PRIMARY STREAMING LINKS */}
        <div className="flex flex-col gap-3">
          {STREAMING_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-item group relative flex justify-between items-center py-4 px-5 rounded-lg border border-white/10 bg-black/60 hover:border-[#E2B4CD]/50 hover:shadow-[0_0_15px_rgba(226,180,205,0.2)] hover:bg-black/80 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#E2B4CD] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-[0_0_8px_rgba(226,180,205,0.8)]" />
              
              <div className="relative z-10 flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/70 group-hover:text-[#E2B4CD] group-hover:drop-shadow-[0_0_8px_rgba(226,180,205,0.6)] transition-all duration-300">
                    {item.title}
                  </span>
                  <span className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded bg-black border border-white/10 text-white/40 group-hover:border-[#E2B4CD]/30 transition-colors">
                    {item.badge}
                  </span>
                </div>
                <span className="text-[10px] text-white/40 font-mono tracking-wider group-hover:text-white/60 transition-colors">
                  {item.handle}
                </span>
              </div>

              <span className="relative z-10 text-[#E2B4CD] opacity-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(226,180,205,0.6)] transition-all duration-500 transform -translate-x-3 group-hover:translate-x-0 font-mono text-lg">
                ↗
              </span>
            </a>
          ))}
        </div>

        {/* FOOTER */}
        <div className="pt-8 border-t border-[#E2B4CD]/20 flex justify-between items-center mt-4">
          <span className="font-mono text-[10px] text-[#E2B4CD] tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(226,180,205,0.4)]">
            STATUS: OPERATIONAL
          </span>
          <span className="font-mono text-[10px] text-[#E2B4CD] uppercase drop-shadow-[0_0_8px_rgba(226,180,205,0.4)]">
            BLUCID © 2026
          </span>
        </div>
      </section>
    </div>
  );
}
