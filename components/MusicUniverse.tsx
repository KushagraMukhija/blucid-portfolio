"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tracks = [
  { id: "01", title: "INTEZAAR", subtitle: "Official Visualizer" },
  { id: "02", title: "GULABI AASMAN", subtitle: "Official Music Video" },
  { id: "03", title: "AARZOO", subtitle: "Official Music Video" },
];

export default function MusicUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const portalsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000", // Creates a long scroll area for the 3D depth effect
          scrub: 1,
          pin: true,
        },
      });

      // 1. Fade out the black overlay to reveal the purple room
      tl.to(overlayRef.current, {
        opacity: 0.4, // Keep it slightly dark for text legibility
        duration: 1,
      }, 0);

      // 2. Slowly push the background image inwards
      tl.to(bgRef.current, {
        scale: 1.15,
        duration: 4,
        ease: "none",
      }, 0);

      // 3. Z-Axis Fly-through for each track portal
      portalsRef.current.forEach((portal, index) => {
        // Start them tiny and faded out in the distance
        gsap.set(portal, { scale: 0.5, autoAlpha: 0, zIndex: 10 - index });

        const startTime = index * 0.8; // Stagger their appearances

        tl.to(portal, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        }, startTime)
        .to(portal, {
          scale: 4, // Fly past the camera
          autoAlpha: 0,
          filter: "blur(10px)", // Cinematic motion blur as it passes
          duration: 1,
          ease: "power2.in",
        }, startTime + 1);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center perspective-[1000px]">
      
      {/* Deep Environment Background */}
      <div ref={bgRef} className="absolute inset-0 z-0 origin-center">
        <Image
          src="/purple-room.jpg"
          alt="BLUCID Studio"
          fill
          className="object-cover"
        />
      </div>

      {/* Lighting Transition Overlay */}
      <div 
        ref={overlayRef} 
        className="absolute inset-0 z-10 bg-black opacity-100" // Starts pure black, fades to reveal purple
      />
      
      {/* Heavy Vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />

      {/* Floating Video Portals */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            ref={(el) => { portalsRef.current[i] = el; }}
            className="absolute flex flex-col items-center justify-center text-center will-change-transform"
          >
            <span className="text-[#FF007F] font-light tracking-[0.5em] text-xs mb-4 opacity-80">
              TRACK {track.id}
            </span>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-widest uppercase" style={{ textShadow: "0px 10px 30px rgba(0,0,0,0.8)" }}>
              {track.title}
            </h2>
            <span className="text-white/60 tracking-[0.2em] text-sm mt-4 uppercase">
              {track.subtitle}
            </span>
            
            {/* Minimal Play Button Placeholder */}
            <div className="mt-8 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}