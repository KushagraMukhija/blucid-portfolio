"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // QuickSetters for smooth high-performance tracking
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });
    
    // Initial position fix to prevent snapping from 0,0
    let isInitialized = false;

    const moveCursor = (e: MouseEvent) => {
      if (!isInitialized) {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        isInitialized = true;
      }
      xToCursor(e.clientX);
      yToCursor(e.clientY);
    };

    const handleHoverEnter = (target: HTMLElement) => {
      let color = getComputedStyle(target).getPropertyValue('--theme-color').trim();
      if (!color) {
        color = target.dataset.cursorColor || "#FF007F";
      }

      gsap.to(cursor, { 
        scale: 1.5, 
        borderWidth: "1px",
        borderColor: color,
        backgroundColor: "transparent",
        duration: 0.3, 
        ease: "power2.out" 
      });
    };

    const handleHoverLeave = () => {
      gsap.to(cursor, { 
        scale: 1, 
        borderColor: "rgba(255,255,255,0.4)",
        backgroundColor: "transparent",
        duration: 0.3, 
        ease: "power2.out" 
      });
    };

    window.addEventListener("mousemove", moveCursor);

    // Add event listeners to all interactive elements dynamically using event delegation on body
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("a, button, .menu-item, input, textarea") as HTMLElement;
      if (clickable) {
        handleHoverEnter(clickable);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .menu-item, input, textarea")) {
        handleHoverLeave();
      }
    };

    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-[99999] hidden md:flex items-center justify-center -ml-4 -mt-4 mix-blend-difference"
    />
  );
}
