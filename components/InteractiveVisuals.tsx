"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const visuals = [
  { id: 1, src: "/purple-room.jpg", alt: "BLUCID Studio" },
  { id: 2, src: "/car-shot.jpg", alt: "BLUCID Booking" },
];

export default function InteractiveVisuals() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Scroll Parallax: The image moves inside its wrapper as you scroll down
      wrapperRefs.current.forEach((wrapper, i) => {
        const image = imageRefs.current[i];
        if (!wrapper || !image) return;

        gsap.to(image, {
          yPercent: 20, // Pushes the image down slightly as you scroll past
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 2. Mouse 3D Tilt Interaction
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const wrapper = wrapperRefs.current[index];
    const image = imageRefs.current[index];
    if (!wrapper || !image) return;

    const { left, top, width, height } = wrapper.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the image
    const x = (e.clientX - left - width / 2) / 25; // 25 is the sensitivity divider
    const y = -(e.clientY - top - height / 2) / 25;

    // Tilt the image based on mouse position
    gsap.to(image, {
      rotateY: x,
      rotateX: y,
      duration: 0.8,
      ease: "power3.out",
      transformPerspective: 900,
    });
  };

  const handleMouseLeave = (index: number) => {
    const image = imageRefs.current[index];
    if (!image) return;

    // Snap back to flat when mouse leaves
    gsap.to(image, {
      rotateY: 0,
      rotateX: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <section ref={containerRef} className="w-full bg-black py-32 flex flex-col items-center gap-32">
      {visuals.map((vis, i) => (
        <div 
          key={vis.id}
          ref={(el) => { wrapperRefs.current[i] = el; }}
          onMouseMove={(e) => handleMouseMove(e, i)}
          onMouseLeave={() => handleMouseLeave(i)}
          className="relative w-[90vw] md:w-[70vw] h-[60vh] md:h-[80vh] overflow-hidden cursor-crosshair group"
          style={{ perspective: "1000px" }}
        >
          {/* 
            The image is scaled to 115% so that when it parallaxes and tilts, 
            you don't see the black background behind the edges. 
          */}
          <div 
            ref={(el) => { imageRefs.current[i] = el; }}
            className="absolute inset-[-10%] w-[120%] h-[120%] will-change-transform"
          >
            <Image
              src={vis.src}
              alt={vis.alt}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            />
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>
        </div>
      ))}
    </section>
  );
}