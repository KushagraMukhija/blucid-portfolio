"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BookingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The image moves inside its container to create physical depth
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // The text physically pushes up at a different speed than the image
      gsap.to(textRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[80vh] bg-black overflow-hidden flex items-center justify-center mt-20">
      
      {/* Parallax Image Mask */}
      <div className="absolute inset-0 z-0 scale-[1.15]">
        <Image
          ref={imageRef}
          src="/car-shot.jpg"
          alt="BLUCID Live Booking"
          fill
          className="object-cover opacity-60 grayscale"
        />
        {/* Shadow gradients to blend with the black website */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90" />
      </div>

      {/* Cinematic Typography */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center text-center">
        <span className="text-white/40 tracking-[0.4em] text-xs uppercase mb-4">Live Performances</span>
        <h2 className="text-6xl md:text-8xl font-black text-white tracking-widest uppercase mb-8">
          Book Blucid
        </h2>
        
        <a 
          href="mailto:blucidworld@gmail.com"
          className="group relative px-8 py-4 bg-white text-black font-bold tracking-[0.2em] text-sm uppercase overflow-hidden"
        >
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Contact Management
          </span>
          <div className="absolute inset-0 bg-[#FF007F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </a>
      </div>
    </section>
  );
}