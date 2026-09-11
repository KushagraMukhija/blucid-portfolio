// app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Hero from "@/components/Hero";
import DiscographyView from "@/components/DiscographyView";
import AboutView from "@/components/AboutView";
import ContactView from "@/components/ContactView";
import LinkTreeView from "@/components/LinkTreeView";
import MerchView from "@/components/MerchView";

type ViewState = "hero" | "discography" | "about" | "contact" | "linktree" | "merch";

import { useGlobalAudio } from "@/components/GlobalAudioProvider";

export default function Home() {
  const { startAudio } = useGlobalAudio();
  const [viewState, setViewState] = useState<ViewState>("hero");
  const [splashPlayed, setSplashPlayed] = useState(false);
  const [heroScroll, setHeroScroll] = useState(0);

  useEffect(() => {
    if (splashPlayed) {
      startAudio();
    }
  }, [splashPlayed, startAudio]);

  const handleNavigate = (viewName: string) => {
    const normalized = viewName.toLowerCase().trim();
    let target: ViewState | null = null;

    if (normalized === "about") target = "about";
    else if (normalized === "discography") target = "discography";
    else if (normalized === "contact") target = "contact";
    else if (normalized === "link tree" || normalized === "linktree") target = "linktree";
    else if (normalized === "merch") target = "merch";

    if (!target) return;

    const currentScroll = window.scrollY;

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setHeroScroll(currentScroll);
          setViewState(target);
          window.scrollTo(0, 0);
        });
      });
    } else {
      setHeroScroll(currentScroll);
      setViewState(target);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => setViewState("hero"));
      });
    } else {
      setViewState("hero");
    }
  };

  return (
    <main className="w-full bg-black min-h-screen relative overflow-x-hidden">
      {viewState === "hero" && (
        <Hero
          onNavigate={handleNavigate}
          splashPlayed={splashPlayed}
          setSplashPlayed={setSplashPlayed}
          initialScroll={heroScroll}
        />
      )}
      {viewState === "discography" && (
        <DiscographyView onBack={handleBack} />
      )}
      {viewState === "about" && (
        <AboutView onBack={handleBack} />
      )}
      {viewState === "contact" && (
        <ContactView onBack={handleBack} />
      )}
      {viewState === "linktree" && (
        <LinkTreeView onBack={handleBack} />
      )}
      {viewState === "merch" && (
        <MerchView onBack={handleBack} />
      )}
    </main>
  );
}