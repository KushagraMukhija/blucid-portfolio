// blucid-world/app/discography/page.tsx

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import GridGallery from "@/components/GridGallery";

export default function DiscographyPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headerTextRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Sequential cascade for navigation, subtext, and gallery grid once title is morphed
      tl.fromTo(
        navRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "+=0.2"
      )
      .fromTo(
        subtextRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        galleryRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
        "-=0.4"
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="w-full min-h-screen bg-[#030303] text-white selection:bg-[#FF007F] selection:text-white">
      
      {/* Top Navigation Bar */}
      <nav ref={navRef} className="w-full max-w-7xl mx-auto px-8 py-8 flex justify-between items-center border-b border-white/10 opacity-0">
        <Link 
          href="/" 
          className="font-mono text-xs tracking-[0.4em] uppercase text-white/50 hover:text-[#FF007F] transition-colors duration-300"
        >
          ← BLUCIDWORLD
        </Link>
        <span className="text-xs font-mono text-[#FF007F] tracking-[0.3em] uppercase">
          BLUCID UNIVERSE // WORLD 001
        </span>
      </nav>

      {/* Page Header with Matching View Transition Name */}
      <header className="w-full max-w-7xl mx-auto px-8 pt-20 pb-12">
        <h1 
          ref={headerTextRef} 
          className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white mb-6"
          style={{ viewTransitionName: "discography-title" }}
        >
          Discography
        </h1>
        <p ref={subtextRef} className="text-white/50 font-light text-sm md:text-base tracking-[0.2em] uppercase max-w-xl opacity-0">
          Frequencies and visual chapters embedded within the first dimensional world.
        </p>
      </header>

      {/* Main Grid Gallery Section */}
      <section ref={galleryRef} className="w-full max-w-7xl mx-auto px-8 pb-32 opacity-0">
        <GridGallery />
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-12 text-center text-white/30 text-xs font-mono tracking-[0.3em] uppercase">
        Blucid Universe Architecture © 2026
      </footer>
    </main>
  );
}