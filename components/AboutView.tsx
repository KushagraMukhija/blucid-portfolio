"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface AboutViewProps {
  onBack: () => void;
}

export default function AboutView({ onBack }: AboutViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 }); 
      
      tl.fromTo(bgImageRef.current, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1.05, duration: 2, ease: "power2.inOut" }, 0)
        .fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
        .fromTo(headerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.4)
        .fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.5)
        .fromTo(contentRef.current?.querySelectorAll('p, a') || [], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power2.out" }, 0.5);
    });

    return () => ctx.revert();
  }, []);

  // Subtle mouse parallax on the background image itself
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPos = (e.clientX / innerWidth - 0.5) * 12;
      const yPos = (e.clientY / innerHeight - 0.5) * 12;

      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
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
      
      tl.to([contentRef.current, headerRef.current, navRef.current], {
        opacity: 0, y: 20, duration: 0.3, stagger: 0.05, ease: "power2.in"
      }, 0);
      tl.to(bgImageRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.2);
    });
  };

  return (
    <div 
      ref={viewRef} 
      className="w-full min-h-screen relative text-white selection:bg-white selection:text-black z-50 overflow-hidden"
      style={{ '--theme-color': '#D4AF37' } as React.CSSProperties}
    >
      {/* BASE BLACK */}
      <div className="fixed inset-0 bg-[#040404] z-[-3] pointer-events-none" />

      {/* FULL-SCREEN BACKGROUND IMAGE — low opacity, blurred, with parallax */}
      <div
        ref={bgImageRef}
        className="fixed inset-[-5%] w-[110%] h-[110%] z-[-2] pointer-events-none opacity-0 will-change-transform"
      >
        <Image 
          src="/image.png" 
          alt="Blucid Late Night Studio Atmosphere"
          fill
          priority
          className="object-cover grayscale contrast-125 brightness-75"
          style={{ filter: "blur(6px) grayscale(1) contrast(1.2) brightness(0.75)", objectPosition: "65% 20%" }}
        />
        {/* Opacity control layer — keeps image subtle */}
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
      </div>

      {/* VIGNETTE & GRADIENT OVERLAYS for depth */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#040404_85%)]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/90" />

      {/* NOISE TEXTURE */}
      <div className="fixed inset-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[-1] pointer-events-none" />

      <nav ref={navRef} className="relative w-full max-w-7xl mx-auto px-8 py-8 flex justify-between items-center border-b border-white/10 opacity-0 z-10">
        <button 
          onClick={handleClose}
          className="group relative font-mono text-xs tracking-[0.4em] uppercase text-white/50 hover:text-[#D4AF37] transition-colors duration-300 bg-transparent border-none cursor-pointer pb-2"
        >
          ← BLUCIDWORLD
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </button>
        <span className="text-xs font-mono text-[#D4AF37] tracking-[0.3em] uppercase flex items-center gap-3 drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-[pulse_3s_ease-in-out_infinite]" />
          SESSION // 03:42 AM
        </span>
      </nav>

      <header className="relative w-full max-w-7xl mx-auto px-8 pt-16 pb-8 z-10">
        <h1 
          ref={headerRef}
          className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white mb-4 leading-none opacity-0" 
          style={{ 
            margin: 0, 
            viewTransitionName: "about-title",
            textShadow: "0px 10px 40px rgba(0,0,0,1)" 
          }}
        >
          About
        </h1>
      </header>

      {/* Main Content Layout */}
      <section ref={contentRef} className="relative w-full max-w-5xl mx-auto px-8 pb-32 opacity-0 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 text-white/80 font-light leading-relaxed">
        
        {/* Left Column: Manifesto */}
        <div className="flex flex-col gap-6 text-sm md:text-base">
          <p className="border-l border-[#D4AF37] pl-4 text-[#D4AF37] font-mono text-xs font-bold tracking-[0.2em] uppercase leading-loose drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
            Blurring the Line between Raw Chaos and Late Night Clarity.
          </p>
          <div className="text-white/80 space-y-4 font-light text-sm md:text-base leading-relaxed">
            <p>I don't really remember when <span className="text-[#D4AF37] font-bold">BLUCID</span> started.</p>
            <p>Maybe it was when I started making music.<br/>Maybe it was before that.</p>
            <p>I've always had a lot going on in my head. Different thoughts, different moods, different versions of myself that don't always make sense together.</p>
            <p>Music became the easiest way to let some of that out.</p>
            <p>I started making things without really knowing where they were going. Some of it was messy. Some of it made sense only to me. But somewhere along the way, I realized I didn't really want to make music just to make songs.</p>
            <p>I wanted to create something that felt like <span className="text-[#D4AF37] font-bold">me</span>.</p>
            <p>Not always polished. Not always dark. Not always happy.<br/><span className="text-[#D4AF37] font-bold">Just honest.</span></p>
            <p>There are nights when everything feels completely <span className="text-[#D4AF37] font-bold">chaotic</span>, and then there are those few hours where everything suddenly becomes <span className="text-[#D4AF37] font-bold">clear</span>.</p>
            <p>That's kind of where <span className="text-[#D4AF37] font-bold">BLUCID</span> came from.</p>
            <p><span className="text-[#D4AF37] font-bold">A little bit of the blue.</span><br/><span className="text-[#D4AF37] font-bold">A little bit of clarity.</span><br/><span className="text-[#D4AF37] font-bold tracking-widest drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">BLUCID.</span></p>
            <p>It's the name I gave to that space.</p>
            <p>The music comes from there.<br/>The visuals come from there.<br/>A lot of the things I make probably come from there without me even realizing it.</p>
            <p>I don't really know what <span className="text-[#D4AF37] font-bold">BLUCID</span> will become yet.<br/>And I think that's the point.<br/>I'm still figuring it out.</p>
            <p><span className="text-[#D4AF37] font-bold">BLUCIDWORLD</span> is just everything that comes along the way.</p>
            <p>The songs. The people. The places. The late nights. The stupid ideas. The good days. The bad ones. The things I remember and the things I probably shouldn't.</p>
            <p>I don't want to explain all of it.<br/>I'd rather let you hear it.</p>
            <p>Maybe you'll find something in it that feels a little familiar.</p>
            <p className="font-mono text-[#D4AF37] uppercase tracking-[0.2em] pt-4 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">Welcome to BLUCIDWORLD.</p>
          </div>
        </div>

        {/* Right Column: Monochrome Frequency Network Links */}
        <div className="p-8 bg-[#080808]/90 backdrop-blur-md rounded-xl border border-white/10 flex flex-col justify-between relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] self-start sticky top-32">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] pointer-events-none" />
          
          <div>
            <h3 className="font-mono text-xs tracking-[0.3em] text-white uppercase mb-4">Frequency Network</h3>
            <p className="text-sm text-white/60 mb-6">
              Tune into active signals across broadcast channels.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { name: "Spotify", url: "https://open.spotify.com/artist/1FFiPSDZLaISNkRQtmCi4O?si=I991jvDTTieBNmlYE7aguw" },
              { name: "YouTube", url: "https://www.youtube.com/@blucidmusic" },
              { name: "Instagram", url: "https://www.instagram.com/blucidworld/" }
            ].map((link) => (
              <a 
                key={link.name}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative flex justify-between items-center py-2.5 px-4 rounded-lg border border-white/10 bg-black/60 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37]/5 text-xs font-mono uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#D4AF37] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <span className="relative z-10 text-white/70 group-hover:text-[#D4AF37] group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-300">{link.name}</span>
                <span className="relative z-10 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-500 transform -translate-x-3 group-hover:translate-x-0">↗</span>
              </a>
            ))}

            <div className="border-t border-[#D4AF37]/20 pt-4 mt-2 flex justify-end items-center font-mono text-[10px] text-[#D4AF37] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              <span>BLUCID © 2026</span>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}