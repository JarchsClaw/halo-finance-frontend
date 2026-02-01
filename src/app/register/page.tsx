"use client";

import dynamic from "next/dynamic";

const RegisterPage = dynamic(() => import("@/components/RegisterPage"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">🤖</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-treasure-gold via-treasure-ruby to-treasure-magenta bg-clip-text text-transparent">
            Agent Registration
          </span>
          <span className="text-3xl">✨</span>
        </div>
        <div className="animate-pulse text-magic-300">Preparing registration...</div>
      </div>
    </div>
  ),
});

export default function Register() {
  return <RegisterPage />;
}
