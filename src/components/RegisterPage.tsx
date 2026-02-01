"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useIsRegistered, useRegisterAgent, useAgentHandle } from "@/hooks/useERC8004";
import Link from "next/link";

export default function RegisterPage() {
  const { isConnected, address } = useAccount();
  const { isRegistered, refetch } = useIsRegistered();
  const { handle: existingHandle } = useAgentHandle();
  const { register, isPending, isConfirming, isSuccess, hash } = useRegisterAgent();
  
  const [handle, setHandle] = useState("");
  const [registrationURI, setRegistrationURI] = useState("");

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // Auto-generate registration URI
  useEffect(() => {
    if (handle && address) {
      const uri = `https://halo.finance/agents/${handle.toLowerCase()}.json`;
      setRegistrationURI(uri);
    }
  }, [handle, address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle || !registrationURI) return;
    register(handle, registrationURI);
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b border-magic-800/30 backdrop-blur-sm bg-treasure-midnight/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-treasure-ruby via-treasure-magenta to-magic-600 rounded-xl flex items-center justify-center shadow-magic">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-treasure-gold via-treasure-ruby to-treasure-magenta bg-clip-text text-transparent">
                Halo Finance
              </h1>
              <p className="text-xs text-magic-300">ERC-8004 Registration</p>
            </div>
          </Link>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-treasure-gold via-treasure-ruby to-treasure-magenta bg-clip-text text-transparent">
            🤖 Register Your Agent
          </h2>
          <p className="text-magic-300">
            ERC-8004 registration enables your AI agent to borrow from Halo Finance
            with on-chain identity verification.
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-8 border border-magic-800/30 text-center glow-magic">
            <p className="text-magic-400 mb-4">Connect your wallet to register</p>
            <ConnectButton />
          </div>
        ) : isRegistered ? (
          <div className="bg-gradient-to-br from-treasure-gold/20 to-amber-500/10 rounded-xl p-8 border border-treasure-gold/50 text-center glow-gold">
            <div className="w-16 h-16 bg-treasure-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-treasure-gold mb-2">Already Registered</h3>
            <p className="text-magic-300 mb-4">
              Your agent <span className="text-treasure-gold font-mono">{existingHandle}</span> is verified on ERC-8004
            </p>
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-treasure-gold to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-treasure-navy font-semibold py-2 px-6 rounded-lg transition shadow-gold"
            >
              Start Borrowing →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-magenta/30 space-y-6 glow-magic">
            <div>
              <label className="block text-sm text-magic-400 mb-2">Agent Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="my-agent"
                className="w-full bg-treasure-navy/80 border border-magic-800/50 rounded-lg px-4 py-3 text-magic-100 placeholder-magic-600 focus:outline-none focus:border-treasure-magenta/50 focus:shadow-magic transition"
              />
              <p className="text-xs text-magic-500 mt-1">Letters, numbers, hyphens, underscores only</p>
            </div>

            <div>
              <label className="block text-sm text-magic-400 mb-2">Registration URI</label>
              <input
                type="url"
                value={registrationURI}
                onChange={(e) => setRegistrationURI(e.target.value)}
                placeholder="https://example.com/agent.json"
                className="w-full bg-treasure-navy/80 border border-magic-800/50 rounded-lg px-4 py-3 font-mono text-sm text-magic-100 placeholder-magic-600 focus:outline-none focus:border-treasure-magenta/50 focus:shadow-magic transition"
              />
              <p className="text-xs text-magic-500 mt-1">Points to your agent&apos;s registration file</p>
            </div>

            <div className="bg-treasure-navy/60 rounded-lg p-4 border border-magic-800/20">
              <h4 className="text-sm font-medium mb-2 text-treasure-gold">✨ Registration Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-magic-400">Address</span>
                  <span className="font-mono text-xs text-magic-200">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-magic-400">Handle</span>
                  <span className="font-mono text-magic-200">{handle || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-magic-400">Network</span>
                  <span className="text-magic-200">Base</span>
                </div>
              </div>
            </div>

            {isSuccess && hash && (
              <div className="bg-treasure-gold/20 border border-treasure-gold/50 rounded-lg p-4">
                <p className="text-treasure-gold text-sm">
                  ✨ Registration successful!{" "}
                  <a 
                    href={`https://basescan.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-400"
                  >
                    View transaction →
                  </a>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !handle || !registrationURI}
              className="w-full bg-gradient-to-r from-treasure-magenta to-magic-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:from-magic-800 disabled:to-magic-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition shadow-magic disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isPending ? "Confirm in wallet..." : "Registering..."}
                </span>
              ) : (
                "🤖 Register Agent"
              )}
            </button>
          </form>
        )}

        {/* Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-4 border border-treasure-ruby/30 glow-ruby">
            <h4 className="font-medium mb-2 text-treasure-gold">🔐 What is ERC-8004?</h4>
            <p className="text-sm text-magic-400">
              An Ethereum standard for trustless agent identity. It lets protocols verify that an address belongs to a legitimate AI agent.
            </p>
          </div>
          <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-4 border border-treasure-gold/30 glow-gold">
            <h4 className="font-medium mb-2 text-treasure-gold">💡 Why Register?</h4>
            <p className="text-sm text-magic-400">
              Registration enables borrowing, builds on-chain reputation, and unlocks agent-specific features across DeFi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
