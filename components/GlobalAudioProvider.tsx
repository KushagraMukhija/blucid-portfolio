"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface GlobalAudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  pauseForVideo: () => void;
  resumeFromVideo: () => void;
  startAudio: () => void;
  setThemeColor: (color: string) => void;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | null>(null);

export const useGlobalAudio = () => {
  const ctx = useContext(GlobalAudioContext);
  if (!ctx) throw new Error("useGlobalAudio must be used within GlobalAudioProvider");
  return ctx;
};

export const GlobalAudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isBlockedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [themeColor, setThemeColor] = useState<string>("#FF007F");
  const [isHovered, setIsHovered] = useState(false);

  const MAX_VOLUME = 0.25;

  const startAudio = useCallback(() => {
    if (!hasStarted) setHasStarted(true);
  }, [hasStarted]);

  // Start audio immediately when the website loads (component mounts)
  useEffect(() => {
    startAudio();
  }, [startAudio]);

  const toggleMute = useCallback(() => {
    if (isBlockedRef.current) {
      // If audio is currently blocked by browser policy, the click on the button 
      // will bubble up to the window listener and play it.
      // We must NOT toggle isMuted to true here, otherwise the window listener 
      // will instantly pause the audio it just started!
      return;
    }
    setIsMuted(prev => !prev);
  }, []);

  const pauseForVideo = useCallback(() => setIsVideoPlaying(true), []);
  const resumeFromVideo = useCallback(() => setIsVideoPlaying(false), []);

  useEffect(() => {
    if (!audioRef.current || !hasStarted) return;

    if (isMuted || isVideoPlaying) {
      gsap.to(audioRef.current, { 
        volume: 0, 
        duration: 1.5, 
        ease: "power2.inOut",
        onComplete: () => {
          if (audioRef.current) audioRef.current.pause();
        }
      });
    } else {
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        isBlockedRef.current = false;
        gsap.to(audioRef.current, { volume: MAX_VOLUME, duration: 2, ease: "power2.inOut" });
      }).catch((e) => {
        console.log("Audio autoplay prevented by browser. Waiting for interaction.", e);
        isBlockedRef.current = true;
        
        // Fallback interaction listener
        const onInteract = () => {
          isBlockedRef.current = false;
          if (!audioRef.current || isMuted || isVideoPlaying) return;
          audioRef.current.muted = false;
          audioRef.current.play().then(() => {
            gsap.to(audioRef.current, { volume: MAX_VOLUME, duration: 2, ease: "power2.inOut" });
          });
          window.removeEventListener("click", onInteract);
          window.removeEventListener("touchstart", onInteract);
        };
        window.addEventListener("click", onInteract);
        window.addEventListener("touchstart", onInteract);
      });
    }
  }, [isMuted, isVideoPlaying, hasStarted]);

  return (
    <GlobalAudioContext.Provider value={{ isMuted, toggleMute, pauseForVideo, resumeFromVideo, startAudio, setThemeColor }}>
      {children}
      
      {/* Set volume to 0 and explicitly use HTML muted property to guarantee ZERO audio output until play() resolves successfully */}
      <audio 
        ref={(el) => { 
          if (el) {
            el.volume = 0;
            audioRef.current = el;
          }
        }} 
        src="/NIGHTZONED.mp3?v=2" 
        preload="auto" 
        loop 
        muted={true}
      />

      {/* Global Sound Toggle Button */}
      {hasStarted && (
        <button
          onClick={toggleMute}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 right-6 z-[9999] px-4 py-2 rounded-full border bg-black/60 backdrop-blur-md transition-all duration-500 font-mono text-[10px] tracking-[0.2em] uppercase"
          style={{
            color: isHovered ? themeColor : "rgba(255, 255, 255, 0.5)",
            borderColor: isHovered ? `${themeColor}80` : "rgba(255, 255, 255, 0.1)",
            boxShadow: isHovered ? `0 0 15px ${themeColor}66` : "none"
          }}
        >
          {isMuted ? "Sound Off" : "Sound On"}
        </button>
      )}
    </GlobalAudioContext.Provider>
  );
};
