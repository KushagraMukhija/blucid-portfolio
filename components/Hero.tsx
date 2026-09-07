
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
  onNavigate: (viewName: string) => void;
  splashPlayed: boolean;
  setSplashPlayed: (val: boolean) => void;
  initialScroll: number;
}

export default function Hero({ onNavigate, splashPlayed, setSplashPlayed, initialScroll }: HeroProps) {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const signatureContainerRef = useRef<HTMLDivElement>(null);
  const bgFilthyRef = useRef<HTMLDivElement>(null);
  const textSolidRef = useRef<HTMLDivElement>(null);
  const portalLayerRef = useRef<HTMLDivElement>(null);
  const portalMaskRef = useRef<HTMLDivElement>(null);
  const bgGulabiFullRef = useRef<HTMLDivElement>(null);
  const menuBackdropRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const ambientWavesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textSolidRef.current || !outerWrapperRef.current) return;

    const setInitialTextPosition = () => {
      const el = textSolidRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const scale = 0.35;
      const targetX = 40 + (w * scale) / 2;
      const targetY = window.innerHeight - 40 - (h * scale) / 2;
      const currentX = window.innerWidth / 2;
      const currentY = window.innerHeight / 2;

      gsap.set(el, { x: targetX - currentX, y: targetY - currentY, scale: scale, transformOrigin: "center center" });
    };

    setInitialTextPosition();
    window.addEventListener("resize", setInitialTextPosition);

    const ctx = gsap.context(() => {

      const splashTl = gsap.timeline({
        onComplete: () => {
          if (!splashPlayed) setSplashPlayed(true);
        }
      });

      if (!splashPlayed && signatureContainerRef.current && splashRef.current) {
        const paths = signatureContainerRef.current.querySelectorAll("path");
        paths.forEach(path => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });

        splashTl.to(paths, { strokeDashoffset: 0, duration: 2.0, ease: "power2.inOut", stagger: 0.25 })
          .to(signatureContainerRef.current, { opacity: 0, duration: 0.8, delay: 1.5 })
          .to(splashRef.current, { opacity: 0, duration: 1.0, ease: "power2.inOut" }, "-=0.4")
          .set(splashRef.current, { display: "none" });
      } else if (splashRef.current) {
        gsap.set(splashRef.current, { display: "none" });
      }

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2500",
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      scrollTl.to(textSolidRef.current, { x: 0, y: 0, scale: 1, duration: 1.5, ease: "power2.inOut" })
        .to(textSolidRef.current, { opacity: 0, duration: 0.5 }, "+=0.2")
        .to(portalLayerRef.current, { opacity: 1, duration: 0.5 }, "<")
        .to(portalMaskRef.current, { scale: 150, x: "-5vw", duration: 2.5, ease: "power2.in", force3D: false }, "+=0.2")
        .to(bgGulabiFullRef.current, { opacity: 1, duration: 1.5 }, "<1.2")
        .to(menuBackdropRef.current, { opacity: 1, duration: 1.5, ease: "power2.inOut" }, "<0.5")
        .fromTo(menuRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<0.2")
        .fromTo(menuRef.current?.querySelectorAll(".menu-item") || [], { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1.5, stagger: 0.1, ease: "power3.out" }, "<0.2")
        .fromTo(ambientWavesRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 3, ease: "power2.inOut" }, "<0.5");

      if (initialScroll > 0) {
        requestAnimationFrame(() => {
          window.scrollTo(0, initialScroll);
          ScrollTrigger.refresh();
        });
      }

    }, outerWrapperRef);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", setInitialTextPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fade the menu naturally when returning from sub-views
  useEffect(() => {
    if (splashPlayed && menuRef.current) {
      const buttons = menuRef.current.querySelectorAll(".menu-item");
      gsap.to(menuRef.current, { opacity: 1, duration: 0.1 });

      gsap.fromTo(buttons,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [splashPlayed]);

  const handleMenuClick = (viewName: string) => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => onNavigate(viewName)
      });
    }
  };

  return (
    <div ref={outerWrapperRef} className="relative w-full bg-black overflow-x-hidden">

      {/* LAYER 1: Signature Splash Screen */}
      <div ref={splashRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-none">
        <div ref={signatureContainerRef} className="relative w-full max-w-[800px] px-8">
          <svg viewBox="100 90 750 290" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            <path d="M 200,90 L 160,320" />
            <path d="M 170,120 C 260,90 280,180 200,210 C 280,210 290,300 170,310" />
            <path d="M 240,300 C 270,100 310,100 290,300 C 285,315 300,310 310,290" />
            <path d="M 320,250 C 320,320 360,320 370,250 C 370,320 400,320 420,270" />
            <path d="M 460,240 C 430,220 410,250 420,290 C 430,320 460,320 480,280" />
            <path d="M 490,260 C 490,320 520,320 530,270" />
            <path d="M 505,210 L 515,210" strokeWidth="10" />
            <path d="M 540,280 L 570,100 C 720,100 750,310 500,310" />
            <path d="M 100,380 L 600,310 L 620,250 L 640,360 L 660,270 L 675,310 L 690,295 L 850,295" />
          </svg>
        </div>
      </div>

      <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">

        {/* LAYER 2: Filthy (B&W Base) */}
        <div ref={bgFilthyRef} className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
          <video 
            src="/hero.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[fade-in_2s_ease-in-out_1.5s_forwards]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)] z-10" />
        </div>

        {/* LAYER 3: Solid White Text */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <div ref={textSolidRef} className="flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl tracking-[0.4em] text-white/70 uppercase mb-2 whitespace-nowrap">Enter the world</span>
            <span className="text-6xl md:text-8xl font-black tracking-[0.2em] text-white uppercase leading-none whitespace-nowrap">BLUCID</span>
          </div>
        </div>

        {/* LAYER 4: The Blend-Mode Portal */}
        <div ref={portalLayerRef} className="absolute inset-0 z-20 mix-blend-screen bg-black overflow-hidden pointer-events-none opacity-0">
          <video 
            src="/gulabi.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[fade-in_2s_ease-in-out_1.5s_forwards]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#FF007F_150%)] opacity-40 mix-blend-screen z-10" />
          <div ref={portalMaskRef} className="absolute inset-0 z-20 bg-black text-white mix-blend-multiply flex flex-col items-center justify-center" style={{ transformStyle: "flat" }}>
            <span className="text-xl md:text-2xl tracking-[0.4em] uppercase mb-2 whitespace-nowrap">Enter the world</span>
            <span className="text-6xl md:text-8xl font-black tracking-[0.2em] uppercase leading-none whitespace-nowrap">BLUCID</span>
          </div>
        </div>

        {/* LAYER 5: Solid Full Screen Override */}
        <div ref={bgGulabiFullRef} className="absolute inset-0 z-30 bg-black opacity-0 pointer-events-none overflow-hidden">
          <video 
            src="/gulabi.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[fade-in_2s_ease-in-out_1.5s_forwards]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#FF007F_150%)] opacity-30 z-10" />
        </div>

        {/* LAYER 6: Separated Dark Blur Backdrop */}
        <div ref={menuBackdropRef} className="absolute inset-0 z-40 pointer-events-none opacity-0">
          <div className="absolute inset-[-20vw] bg-black/85 backdrop-blur-[60px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,127,0.2)_0%,transparent_70%)]" />
        </div>

        {/* LAYER 7: Harsh Luxury Editorial Menu */}
        <div ref={ambientWavesRef} className="absolute inset-0 z-40 pointer-events-none opacity-0 flex items-end">
          {/* Ambient Analog Audio Oscilloscope - Extremely Subtle */}
          <div className="w-full overflow-hidden flex items-end opacity-40 pointer-events-none h-32">
            <div className="w-[200%] min-w-[2000px] flex animate-[wave-pan_15s_linear_infinite]">
              {[1, 2].map((i) => (
                <svg key={i} viewBox="0 0 1000 100" className="w-1/2 h-full flex-shrink-0" preserveAspectRatio="none">
                  <path d="M0,50 Q125,20 250,50 T500,50 T750,50 T1000,50" fill="none" stroke="#FF007F" strokeWidth="0.5" opacity="0.3" />
                  <path d="M0,50 Q250,-10 500,50 T1000,50" fill="none" stroke="white" strokeWidth="0.3" opacity="0.15" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div ref={menuRef} className="absolute inset-0 z-50 flex items-center justify-center invisible pointer-events-none overflow-hidden">

          {/* ANALOG NOISE TEXTURE */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0 pointer-events-none" />

          {/* STUDIO / ANALOG BORDERS (Vignette) */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />

          {/* FILM SCRATCHES / ANALOG DUST */}
          <style>{`
            @keyframes film-scratch {
              0%, 100% { transform: translateX(0); opacity: 0; }
              10% { transform: translateX(-5px); opacity: 0.3; }
              20% { transform: translateX(15px); opacity: 0.1; }
              30% { transform: translateX(-10px); opacity: 0.5; }
              40% { transform: translateX(5px); opacity: 0; }
            }
          `}</style>
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 mix-blend-screen">
            <div className="absolute w-[1px] h-full bg-white/30 left-[25%] animate-[film-scratch_2.2s_infinite_steps(1)]" />
            <div className="absolute w-[2px] h-[40%] bg-white/10 left-[75%] top-[10%] animate-[film-scratch_3s_infinite_steps(1)]" />
            <div className="absolute w-[1px] h-[60%] bg-[#FF007F]/20 left-[45%] top-[30%] animate-[film-scratch_1.7s_infinite_steps(1)]" />
          </div>

          {/* VERTICAL ANALOG STUDIO METADATA */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[#FF007F]/30 font-mono text-[10px] tracking-[0.4em] uppercase pointer-events-none hidden md:block whitespace-nowrap">
            [ TAPE NOISE // ANALOG CHAIN ACTIVE ]
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[#FF007F]/30 font-mono text-[10px] tracking-[0.4em] uppercase pointer-events-none hidden md:block whitespace-nowrap">
            VU: +3dB // TAPE REC: 15 IPS
          </div>

          {/* MAIN MENU */}
          <div className="flex flex-col items-start w-full max-w-4xl px-8 pointer-events-auto z-10">
            <h2 className="text-[#FF007F] font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-12 drop-shadow-[0_2px_8px_rgba(255,0,127,0.6)] flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] mr-4 animate-pulse shadow-[0_0_10px_rgba(255,0,127,1)]" />
              Master Bus Active
            </h2>

            <div className="flex flex-col items-start gap-8 w-full">
              {[
                { name: "Discography" },
                { name: "About" },
                { name: "Merch" },
                { name: "Link Tree" },
                { name: "Contact" }
              ].map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  className="menu-item group relative flex items-center cursor-pointer bg-transparent border-none text-left w-full max-w-max py-1"
                >
                  <span className="text-white/20 font-mono text-[10px] md:text-xs tracking-widest mr-6 md:mr-10 transition-colors duration-500 group-hover:text-[#FF007F]">
                    CH.{index + 1}
                  </span>

                  <h3
                    className="font-light text-2xl md:text-4xl tracking-[0.2em] uppercase transition-all duration-500 ease-out will-change-transform transform group-hover:translate-x-4 text-white/40 group-hover:text-[#FF007F] group-hover:tracking-[0.4em] group-hover:drop-shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                    style={{
                      viewTransitionName:
                        item.name === "Discography" ? "discography-title" :
                          item.name === "About" ? "about-title" :
                            item.name === "Link Tree" ? "link-tree-title" :
                              item.name === "Merch" ? "merch-title" :
                                item.name === "Contact" ? "contact-title" : "none"
                    }}
                  >
                    {item.name}
                  </h3>

                  {/* Sliding Analog Glow Indicator */}
                  <div className="w-0 h-[2px] bg-[#FF007F] opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-500 ease-out ml-8 shadow-[0_0_15px_rgba(255,0,127,1)]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}