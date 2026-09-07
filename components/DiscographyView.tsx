"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FastAverageColor } from 'fast-average-color';
import GridGallery from "./GridGallery";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface DiscographyViewProps {
  onBack: () => void;
}

export default function DiscographyView({ onBack }: DiscographyViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  
  const navRef = useRef<HTMLElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const [activeVideoId, setActiveVideoId] = useState<string>("PLeKIag4eOk4Y");
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>("Gulabi Aasman");
  const [renderedIds, setRenderedIds] = useState<string[]>(["PLeKIag4eOk4Y"]);
  const [themeColor, setThemeColor] = useState<string>("#d65c22");

  // Automatically extract dominant color from the video thumbnail
  useEffect(() => {
    // Avoid running on the initial playlist ID
    if (!activeVideoId || activeVideoId === "PLeKIag4eOk4Y") return;

    const fac = new FastAverageColor();
    
    // Using our own bulletproof local API route to proxy the image and set CORS headers
    const proxyUrl = `/api/thumbnail?videoId=${activeVideoId}`;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = proxyUrl;
    
    img.onload = () => {
      try {
        // Crop out the top and bottom 15% to avoid YouTube's black letterboxing bars
        const cropY = Math.floor(img.height * 0.15);
        const cropHeight = Math.floor(img.height * 0.70);
        
        const color = fac.getColor(img, { 
          algorithm: 'dominant',
          top: cropY,
          height: cropHeight,
          ignoredColor: [0, 0, 0, 255, 15] // Ignore pure black pixels
        });
        
        const [r, g, b] = color.value;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        const avg = (r + g + b) / 3;
        
        // Check if it's actually black and white footage (Filthy)
        // If the difference between RGB channels is very low across the board, AND it's not just a pure black/dark frame
        if (diff < 15 && avg > 20 && avg < 235) {
          setThemeColor("#D4AF37"); // Golden Yellow for B&W footage
        } else {
          // It's a colored video, but we need to ensure it's bright enough to read/glow
          if (max < 200 && max > 0) {
            const factor = 200 / max;
            const newR = Math.min(255, Math.floor(r * factor));
            const newG = Math.min(255, Math.floor(g * factor));
            const newB = Math.min(255, Math.floor(b * factor));
            const toHex = (c: number) => c.toString(16).padStart(2, '0');
            setThemeColor(`#${toHex(newR)}${toHex(newG)}${toHex(newB)}`);
          } else {
            setThemeColor(color.hex);
          }
        }
      } catch (err) {
        console.error("Color extraction failed:", err);
        setThemeColor("#d65c22");
      }
    };
    img.onerror = (e) => {
      console.error("Image load failed for color extraction", e);
      setThemeColor("#d65c22");
    };

    return () => { fac.destroy(); };
  }, [activeVideoId]);

  // Pre-load video IDs into the background stack as they are played so they are always instant
  useEffect(() => {
    if (!renderedIds.includes(activeVideoId)) {
      setRenderedIds(prev => [...prev, activeVideoId]);
    }
  }, [activeVideoId, renderedIds]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 }); 
      
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0)
        .fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
        .fromTo(subtextRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.4)
        .fromTo(galleryRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.5);

      gsap.to(waveRef.current, {
        scaleY: 2.5,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1.5,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onBack });
      
      tl.to([galleryRef.current, subtextRef.current, navRef.current], {
        opacity: 0, y: 20, duration: 0.3, stagger: 0.05, ease: "power2.in"
      }, 0);
      tl.to(bgRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.2);
    });
  };

  return (
    <div ref={viewRef} className="w-full min-h-screen relative text-white selection:bg-[#FF007F] selection:text-white z-50">
      
      <style>{`
        @keyframes wave-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .analog-wave {
          display: flex;
          width: 200%;
          animation: wave-flow 12s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* FULL-SCREEN IMMERSIVE GLASS VIDEO BACKGROUND (MULTI-STACKED ZERO-FLASH CROSSFADE) */}
      <div ref={bgRef} className="fixed inset-0 bg-[#040303] z-[-1] opacity-0 overflow-hidden pointer-events-none">
        
        {/* Render stacked background layers for every visited video to eliminate flash */}
        {renderedIds.map((id) => (
          <div 
            key={id}
            className="absolute inset-[-20%] w-[140%] h-[140%] filter blur-[55px] saturate-150 scale-110 pointer-events-none transition-opacity duration-1000 ease-in-out"
            style={{ 
              opacity: id === activeVideoId ? 0.35 : 0,
              zIndex: id === activeVideoId ? 2 : 1 
            }}
          >
            <iframe 
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&disablekb=1&modestbranding=1&playsinline=1`}
              title={`Background Layer ${id}`}
              className="w-full h-full object-cover pointer-events-none"
              allow="autoplay"
            />
          </div>
        ))}

        {/* Signal Waves */}
        <div className="absolute top-1/2 left-0 w-full h-[30vh] -translate-y-1/2 mix-blend-screen opacity-15 overflow-hidden flex items-center justify-start z-30">
          <div ref={waveRef} className="analog-wave transform-origin-center will-change-transform">
            {[1, 2].map((i) => (
              <svg key={i} className="w-full h-full flex-shrink-0 transition-colors duration-1000" preserveAspectRatio="none" viewBox="0 0 1000 100" fill="none" stroke={themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0,50 Q25,10 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 T450,50 T500,50 T550,50 T600,50 T650,50 T700,50 T750,50 T800,50 T850,50 T900,50 T950,50 T1000,50" />
                <path d="M0,50 C30,90 70,-10 100,50 C130,110 170,-10 200,50 C230,110 270,-10 300,50 C330,110 370,-10 400,50 C430,110 470,-10 500,50 C530,110 570,-10 600,50 C630,110 670,-10 700,50 C730,110 770,-10 800,50 C830,110 870,-10 900,50 C930,110 970,-10 1000,50" opacity="0.5" />
              </svg>
            ))}
          </div>
        </div>

        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[25px] pointer-events-none z-40" />
        <div className="absolute inset-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none z-40" />
      </div>

      <nav ref={navRef} className="relative w-full max-w-7xl mx-auto px-8 py-8 flex justify-between items-center border-b border-white/5 opacity-0 z-10">
        <button 
          onClick={handleClose}
          style={{ '--theme-color': themeColor } as React.CSSProperties}
          className="group relative font-mono text-xs tracking-[0.4em] uppercase text-white/40 hover:text-[var(--theme-color)] transition-colors duration-300 bg-transparent border-none cursor-pointer pb-2"
        >
          ← Return to Portal
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--theme-color)] transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-100" style={{ boxShadow: `0 0 8px var(--theme-color)` }} />
        </button>
        <span className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase flex items-center gap-3 transition-colors duration-1000">
          <div 
            className="w-1.5 h-1.5 rounded-full animate-[pulse_3s_ease-in-out_infinite] transition-colors duration-1000" 
            style={{ backgroundColor: themeColor, boxShadow: `0 0 12px ${themeColor}, 0 0 4px rgba(255,255,255,0.3)` }} 
          />
          ANALOG CHAIN // ENGAGED
        </span>
      </nav>

      <header className="relative w-full max-w-7xl mx-auto px-8 pt-20 pb-16 z-10">
        <h1 
          className="text-5xl md:text-8xl font-black uppercase tracking-tight text-[#f4f0ec] mb-6 leading-none" 
          style={{ 
            margin: 0, 
            viewTransitionName: "discography-title",
            textShadow: "0px 10px 40px rgba(0,0,0,1)" 
          }}
        >
          Discography
        </h1>
        <p ref={subtextRef} className="text-white/40 font-mono text-xs md:text-sm tracking-[0.3em] uppercase max-w-2xl opacity-0 mt-6 leading-relaxed">
          Raw frequencies and visual chapters embedded within the first dimensional world. <br/>
          <span className="transition-all duration-1000" style={{ color: themeColor, textShadow: `0 0 15px ${themeColor}80` }}>Tubes warm. Master bus active.</span>
        </p>
      </header>

      <section ref={galleryRef} className="relative w-full max-w-7xl mx-auto px-8 pb-32 opacity-0 z-10">
        <GridGallery onVideoChange={(id, title) => {
          setActiveVideoId(id);
          setActiveVideoTitle(title);
        }} />
      </section>
    </div>
  );
}