"use client";

import dynamic from "next/dynamic";

const RegisterPage = dynamic(() => import("@/components/RegisterPage"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  ),
});

export default function Register() {
  return <RegisterPage />;
}
