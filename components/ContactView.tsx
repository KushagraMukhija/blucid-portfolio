// blucid-world/components/ContactView.tsx
"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface ContactViewProps {
  onBack: () => void;
}

export default function ContactView({ onBack }: ContactViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(bgRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" }, 0)
        .fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
        .fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.5)
        .fromTo(contentRef.current?.querySelectorAll('.stagger-item') || [], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 0.5);
    });

    return () => ctx.revert();
  }, []);

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

  const handleClose = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onBack });

      tl.to([contentRef.current, navRef.current], {
        opacity: 0, y: 20, duration: 0.3, stagger: 0.04, ease: "power2.in",
      }, 0);
      tl.to(bgRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.2);
    });
  };

  return (
    <div 
      ref={viewRef} 
      className="w-full min-h-screen relative text-white selection:bg-[#FF007F] selection:text-white z-50 overflow-x-hidden flex flex-col"
      style={{ '--theme-color': '#FF007F' } as React.CSSProperties}
    >
      {/* BASE BLACK */}
      <div className="fixed inset-0 bg-[#040404] z-[-3] pointer-events-none" />

      {/* FULL-SCREEN BACKGROUND IMAGE — low opacity, blurred, with parallax */}
      <div
        ref={bgRef}
        className="fixed inset-[-5%] w-[110%] h-[110%] z-[-2] pointer-events-none opacity-0 will-change-transform"
      >
        <Image 
          src="/car-depth.jpg" 
          alt="Contact Atmosphere"
          fill
          priority
          unoptimized={true}
          className="object-cover grayscale contrast-125 brightness-75"
          style={{ filter: "blur(4px) grayscale(1) contrast(1.3) brightness(0.7)", objectPosition: "center center" }}
        />
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
      </div>

      {/* VIGNETTE & GRADIENT OVERLAYS for depth */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#040404_85%)]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/90" />

      {/* NOISE TEXTURE */}
      <div className="fixed inset-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[-1] pointer-events-none" />

      {/* TOP NAVIGATION */}
      <nav ref={navRef} className="relative w-full max-w-7xl mx-auto px-6 md:px-8 py-8 flex justify-between items-center border-b border-white/10 opacity-0 z-10 shrink-0">
        <button 
          onClick={handleClose}
          className="group relative font-mono text-xs tracking-[0.4em] uppercase text-white/50 hover:text-[#FF007F] transition-colors duration-300 bg-transparent border-none cursor-pointer pb-2"
        >
          ← Return to Portal
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF007F] transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_#FF007F]" />
        </button>

        <span className="text-xs font-mono text-white/40 tracking-[0.3em] uppercase hidden sm:flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] shadow-[0_0_8px_#FF007F] animate-[pulse_2.5s_ease-in-out_infinite]" />
          OPEN FOR INQUIRIES
        </span>
      </nav>

      {/* MAIN CONTENT - 2 COLUMN SPLIT */}
      <div className="flex-1 flex items-center relative z-10 w-full py-12">
        <div ref={contentRef} className="w-full max-w-7xl mx-auto px-6 md:px-8 opacity-0">
          
          <div className="mb-12 stagger-item">
            <span className="text-[#FF007F] font-mono text-xs tracking-[0.5em] uppercase mb-4 block">
              Direct Line
            </span>
            <h1
              className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white mb-4 leading-none"
              style={{
                viewTransitionName: "contact-title",
                textShadow: "0px 10px 40px rgba(0,0,0,1)",
              }}
            >
              Contact
            </h1>
            <p className="text-white/50 font-mono text-xs tracking-[0.2em] uppercase max-w-lg leading-relaxed">
              For collaborations and artistic inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* LEFT COLUMN - IMAGE */}
            <div className="stagger-item relative w-full aspect-video max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden group shadow-[0_30px_100px_rgba(0,0,0,0.9)] bg-[#050505] self-center">
              {/* Image Container with Ken Burns effect */}
              <div className="absolute inset-0 overflow-hidden">
                <Image 
                  src="/car-shot.jpg" 
                  alt="Blucid Studio Automotive Shot" 
                  fill 
                  className="object-cover grayscale contrast-[1.1] brightness-[0.8] scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] origin-center" 
                />
              </div>

              {/* Overlays for depth and premium feel */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none transition-opacity duration-1000 group-hover:opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Premium Grain/Noise specifically for the photo */}
              <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

              {/* Inner ring for that glass/lens feel */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none mix-blend-overlay" />
              <div className="absolute inset-4 rounded-xl border border-white/[0.03] pointer-events-none" />
              
              {/* Cinematic typography & HUD elements */}
              <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                <span className="font-mono text-[9px] text-white/50 tracking-[0.4em] uppercase">Rec</span>
              </div>

              <div className="absolute bottom-8 left-8 right-8 font-mono text-white flex justify-between items-end pointer-events-none">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-white/30 tracking-[0.4em] uppercase mb-1">Archive // 004</span>
                  <span className="text-sm tracking-[0.3em] uppercase text-white/90 font-bold drop-shadow-lg">Late Night Clarity</span>
                  <div className="w-8 h-[1px] bg-[#FF007F] mt-2 transition-all duration-700 group-hover:w-16" />
                </div>
                <div className="flex gap-1 items-end h-4 opacity-50">
                  <span className="w-0.5 h-full bg-white/40" />
                  <span className="w-0.5 h-1/2 bg-white/40" />
                  <span className="w-0.5 h-3/4 bg-white/40" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - DIRECT LINKS */}
            <div className="stagger-item w-full p-8 lg:p-12 bg-[#090909]/90 backdrop-blur-xl rounded-xl border border-white/10 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col justify-center min-h-[400px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF007F]/5 blur-[100px] pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-12 text-center">
                
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white mb-4">Connect</h3>
                  <p className="text-xs font-mono tracking-widest text-white/40 uppercase leading-relaxed max-w-sm mx-auto">
                    Open channels for creative alignment and direct transmissions.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <a
                    href="mailto:blucidworld@gmail.com"
                    className="group relative w-full sm:w-auto py-5 px-10 border border-white/20 text-white font-mono tracking-[0.3em] text-xs uppercase overflow-hidden transition-all duration-500 hover:border-[#FF007F] hover:shadow-[0_0_30px_rgba(255,0,127,0.2)] rounded-lg"
                  >
                    <span className="relative z-10 group-hover:text-[#FF007F] transition-colors duration-300 flex items-center justify-center gap-3">
                      INITIATE EMAIL ↗
                    </span>
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </a>

                  <a
                    href="mailto:blucidworld@gmail.com"
                    className="font-mono text-[10px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase"
                  >
                    blucidworld@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
