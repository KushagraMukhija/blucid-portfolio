// blucid-world/app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-black text-white flex flex-col justify-between p-8 md:p-16">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link href="/" className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 hover:text-[#FF007F] transition-colors">
          ← Back to World
        </Link>
        <span className="text-xs font-mono text-[#FF007F] tracking-widest uppercase">About Profile</span>
      </div>

      <div className="max-w-4xl mx-auto w-full py-20">
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 text-white">
          The Mind Behind The Sound
        </h1>
        <p className="text-white/60 font-light text-lg md:text-xl leading-relaxed tracking-wide">
          Blucid is an independent sonic architect exploring the intersection of alternative soundscapes, dark ambient aesthetics, and raw cinematic emotion.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto text-center text-white/30 text-xs font-mono tracking-widest uppercase">
        BLUCID ARCHIVES // 2026
      </div>
    </main>
  );
}