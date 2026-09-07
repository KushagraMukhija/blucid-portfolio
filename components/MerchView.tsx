// blucid-world/components/MerchView.tsx
"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface MerchViewProps {
  onBack: () => void;
}

export default function MerchView({ onBack }: MerchViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0)
        .fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
        .fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.4)
        .fromTo(contentRef.current?.querySelectorAll('.stagger-item') || [], { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" }, 0.4);
    });

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onBack });

      tl.to([contentRef.current, navRef.current], {
        opacity: 0, y: 20, duration: 0.3, stagger: 0.05, ease: "power2.in",
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

  return (
    <div 
      ref={viewRef} 
      className="w-full min-h-screen relative text-white selection:bg-[#C49B66] selection:text-white z-50 overflow-x-hidden"
      style={{ '--theme-color': '#C49B66' } as React.CSSProperties}
    >
      <style>{`
        @keyframes slow-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.15); opacity: 0.05; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* BASE BLACK */}
      <div className="fixed inset-0 bg-[#040404] z-[-3] pointer-events-none" />

      {/* FULL-SCREEN BACKGROUND IMAGE — low opacity, blurred, with parallax */}
      <div
        ref={bgRef}
        className="fixed inset-[-5%] w-[110%] h-[110%] z-[-2] pointer-events-none opacity-0 will-change-transform"
      >
        <video 
          src="/aarzoo.mp4" 
          poster="/aarzoo-poster.jpg"
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-full grayscale-[0.3] contrast-[1.1] brightness-[0.6]"
          style={{ filter: "blur(6px)" }}
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      </div>

      {/* VIGNETTE & GRADIENT OVERLAYS for depth */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#040404_85%)]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/90" />

      {/* NOISE TEXTURE */}
      <div className="fixed inset-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[-1] pointer-events-none" />

      {/* TOP NAVIGATION */}
      <nav ref={navRef} className="relative w-full max-w-7xl mx-auto px-6 md:px-8 py-8 flex justify-between items-center border-b border-white/10 opacity-0 z-10">
        <button 
          onClick={handleClose}
          className="group relative font-mono text-xs tracking-[0.4em] uppercase text-white/50 hover:text-[#C49B66] transition-colors duration-300 bg-transparent border-none cursor-pointer pb-2"
        >
          ← Return to Portal
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C49B66] transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_#C49B66]" />
        </button>
        <span className="text-[10px] font-mono text-white/30 border border-white/10 px-2.5 py-1 rounded">
          2026
        </span>
      </nav>

      {/* CENTERED "COMING SOON" CONTENT */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center text-center px-8 opacity-0" style={{ minHeight: "calc(100vh - 100px)" }}>
        <span className="stagger-item text-[#C49B66] font-mono text-xs tracking-[0.5em] uppercase mb-6 block">
          BLUCID SUPPLY
        </span>

        <h1
          className="stagger-item text-5xl md:text-8xl font-black uppercase tracking-tight text-white mb-6 leading-none"
          style={{
            viewTransitionName: "merch-title",
            textShadow: "0px 10px 40px rgba(0,0,0,1)",
          }}
        >
          Merch
        </h1>

        {/* Divider line */}
        <div className="stagger-item w-16 h-[1px] bg-white/20 mb-8" />

        <p className="stagger-item font-mono text-sm md:text-base tracking-[0.3em] uppercase text-white/60 mb-4">
          Coming Soon
        </p>

        <p className="stagger-item text-white/30 font-mono text-xs tracking-wider uppercase max-w-md leading-relaxed">
          Heavyweight drops, analog pressings, and studio hardware. <br />
          Frequencies are being calibrated.
        </p>

        <div className="stagger-item flex flex-col items-center max-w-sm w-full mt-8">
          <p className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase mb-3">
            Notify me when supply drops
          </p>
          <div className="flex w-full">
            <input 
              type="email" 
              placeholder="ENTER FREQUENCY (EMAIL)" 
              className="flex-1 bg-black border border-white/20 border-r-0 rounded-l-md px-4 py-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#C49B66] transition-colors"
            />
            <button className="bg-[#C49B66] text-black font-mono font-bold text-[10px] tracking-widest uppercase px-4 py-2 rounded-r-md hover:bg-white hover:text-black transition-colors">
              Tap In
            </button>
          </div>
        </div>

        {/* Subtle animated signal dot */}
        <div className="mt-10 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#C49B66] animate-pulse shadow-[0_0_12px_rgba(196,155,102,0.6)]" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
            Signal Pending
          </span>
        </div>
      </div>
    </div>
  );
}
