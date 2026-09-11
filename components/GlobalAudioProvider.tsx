"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface GlobalAudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  pauseForVideo: () => void;
  resumeFromVideo: () => void;
  startAudio: () => void;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | null>(null);

export const useGlobalAudio = () => {
  const ctx = useContext(GlobalAudioContext);
  if (!ctx) throw new Error("useGlobalAudio must be used within GlobalAudioProvider");
  return ctx;
};

export const GlobalAudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initialize the audio element
    const audio = new Audio("/NIGHTZONED.mp3");
    audio.loop = true;
    audio.volume = 0; // start at 0 for fade in
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const startAudio = useCallback(() => {
    if (hasStarted) return;
    if (!audioRef.current) return;
    
    setHasStarted(true);
    
    // Always start from beginning if website is reloaded (implicit in fresh mount)
    // but we ensure it's at 0 anyway.
    audioRef.current.currentTime = 0;

    if (isMuted || isVideoPlaying) return;

    audioRef.current.play().then(() => {
      gsap.to(audioRef.current, { volume: 1, duration: 2, ease: "power2.inOut" });
    }).catch((e) => {
      console.log("Audio autoplay prevented by browser. Waiting for interaction.", e);
      // Fallback: wait for next click to start
      const onInteract = () => {
        if (!audioRef.current || isMuted || isVideoPlaying) return;
        audioRef.current.play().then(() => {
          gsap.to(audioRef.current, { volume: 1, duration: 2, ease: "power2.inOut" });
        });
        window.removeEventListener("click", onInteract);
        window.removeEventListener("touchstart", onInteract);
      };
      window.addEventListener("click", onInteract);
      window.addEventListener("touchstart", onInteract);
    });
  }, [hasStarted, isMuted, isVideoPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const pauseForVideo = useCallback(() => setIsVideoPlaying(true), []);
  const resumeFromVideo = useCallback(() => setIsVideoPlaying(false), []);

  useEffect(() => {
    if (!audioRef.current || !hasStarted) return;

    if (isMuted || isVideoPlaying) {
      // Fade out and pause
      gsap.to(audioRef.current, { 
        volume: 0, 
        duration: 1.5, 
        ease: "power2.inOut",
        onComplete: () => {
          if (audioRef.current) audioRef.current.pause();
        }
      });
    } else {
      // Fade in and play
      audioRef.current.play().then(() => {
        gsap.to(audioRef.current, { volume: 1, duration: 2, ease: "power2.inOut" });
      }).catch(e => console.log("Audio play prevented", e));
    }
  }, [isMuted, isVideoPlaying, hasStarted]);

  return (
    <GlobalAudioContext.Provider value={{ isMuted, toggleMute, pauseForVideo, resumeFromVideo, startAudio }}>
      {children}
      {/* Global Sound Toggle Button */}
      {hasStarted && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-[9999] px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-500 font-mono text-[10px] tracking-[0.2em] uppercase"
        >
          {isMuted ? "Sound Off" : "Sound On"}
        </button>
      )}
    </GlobalAudioContext.Provider>
  );
};
