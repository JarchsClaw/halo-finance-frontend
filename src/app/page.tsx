"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">✨</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-treasure-gold via-treasure-ruby to-treasure-magenta bg-clip-text text-transparent">
            Halo Finance
          </span>
          <span className="text-3xl">✨</span>
        </div>
        <div className="animate-pulse text-magic-300">Summoning the magic...</div>
        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-treasure-gold animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Dashboard />;
}
