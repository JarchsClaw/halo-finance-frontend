"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-pulse text-gray-400">Loading Halo Finance...</div>
    </div>
  ),
});

export default function Home() {
  return <Dashboard />;
}
