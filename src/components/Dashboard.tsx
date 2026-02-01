"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { PositionCard } from "@/components/PositionCard";
import { SupplyForm } from "@/components/SupplyForm";
import { BorrowForm } from "@/components/BorrowForm";
import { ReputationScore } from "@/components/ReputationScore";
import { InterestRateChart } from "@/components/InterestRateChart";
import { LiquidationInterface } from "@/components/LiquidationInterface";
import { useIsRegistered, useAgentHandle } from "@/hooks/useERC8004";
import { useState } from "react";

type Tab = "dashboard" | "liquidate";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { isRegistered } = useIsRegistered();
  const { handle } = useAgentHandle();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b border-magic-800/30 backdrop-blur-sm bg-treasure-midnight/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-treasure-ruby via-treasure-magenta to-magic-600 rounded-xl flex items-center justify-center shadow-magic">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-treasure-gold via-treasure-ruby to-treasure-magenta bg-clip-text text-transparent">
                Halo Finance
              </h1>
              <p className="text-xs text-magic-300">DeFi Lending for AI Agents</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected && isRegistered && (
              <div className="bg-treasure-magenta/20 border border-treasure-magenta/50 rounded-lg px-3 py-1.5 flex items-center gap-2 glow-magic">
                <div className="w-2 h-2 bg-treasure-magenta rounded-full animate-pulse"></div>
                <span className="text-magic-300 text-sm">ERC-8004: {handle || "Verified"}</span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {isConnected && (
        <div className="border-b border-magic-800/30 backdrop-blur-sm bg-treasure-midnight/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-3 px-1 text-sm font-medium border-b-2 transition ${
                  activeTab === "dashboard"
                    ? "border-treasure-ruby text-treasure-gold"
                    : "border-transparent text-magic-400 hover:text-magic-200"
                }`}
              >
                ✨ Dashboard
              </button>
              <button
                onClick={() => setActiveTab("liquidate")}
                className={`py-3 px-1 text-sm font-medium border-b-2 transition ${
                  activeTab === "liquidate"
                    ? "border-treasure-ruby text-treasure-gold"
                    : "border-transparent text-magic-400 hover:text-magic-200"
                }`}
              >
                ⚔️ Liquidations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            {/* Hero Section */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-treasure-ruby via-treasure-magenta to-treasure-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-magic glow-magic animate-pulse-slow">
                <span className="text-5xl">✨</span>
              </div>
              {/* Decorative stars */}
              <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-treasure-star animate-twinkle" />
              <div className="absolute top-10 right-1/3 w-1 h-1 rounded-full bg-treasure-gold animate-twinkle" style={{ animationDelay: "0.5s" }} />
              <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 rounded-full bg-magic-400 animate-twinkle" style={{ animationDelay: "1s" }} />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-treasure-gold via-treasure-ruby to-treasure-magenta bg-clip-text text-transparent">
              Welcome to Halo Finance
            </h2>
            <p className="text-magic-300 mb-8 max-w-md mx-auto text-lg">
              The first DeFi lending protocol designed for AI agents. 
              Supply collateral, borrow USDC, and let your agents access liquidity with <span className="text-treasure-gold">ERC-8004</span> verification.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-ruby/30 hover:border-treasure-ruby/60 transition glow-ruby">
                <div className="w-12 h-12 bg-gradient-to-br from-treasure-ruby to-treasure-magenta rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-bold mb-2 text-treasure-gold">Agent-First</h3>
                <p className="text-magic-400 text-sm">Built specifically for AI agents with ERC-8004 identity verification</p>
              </div>
              <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-magenta/30 hover:border-treasure-magenta/60 transition glow-magic">
                <div className="w-12 h-12 bg-gradient-to-br from-treasure-magenta to-magic-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-bold mb-2 text-treasure-gold">Reputation Scoring</h3>
                <p className="text-magic-400 text-sm">On-chain reputation that unlocks better rates and higher limits</p>
              </div>
              <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-gold/30 hover:border-treasure-gold/60 transition glow-gold">
                <div className="w-12 h-12 bg-gradient-to-br from-treasure-gold to-amber-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-bold mb-2 text-treasure-gold">Instant Liquidity</h3>
                <p className="text-magic-400 text-sm">Borrow against your holdings without selling</p>
              </div>
            </div>

            {/* Treasure-style badge */}
            <div className="mt-16 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-treasure-midnight/60 rounded-full px-4 py-2 border border-magic-700/30">
                <span className="text-sm text-magic-400">Powered by</span>
                <span className="font-bold text-treasure-gold">$MAGIC</span>
                <span className="text-lg">✨</span>
              </div>
            </div>
          </div>
        ) : activeTab === "dashboard" ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Position & Reputation */}
            <div className="space-y-6">
              <PositionCard />
              <ReputationScore />
            </div>

            {/* Middle Column - Actions */}
            <div className="space-y-6">
              <SupplyForm />
              <BorrowForm />
            </div>

            {/* Right Column - Charts & Stats */}
            <div className="space-y-6">
              <InterestRateChart />
              
              {/* Protocol Stats */}
              <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
                <h3 className="text-lg font-bold mb-4 text-treasure-gold flex items-center gap-2">
                  <span>✨</span> Protocol Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-magic-400">Network</span>
                    <span className="flex items-center gap-2 text-magic-200">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Base
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-magic-400">Total Supplied</span>
                    <span className="font-mono text-treasure-gold">$2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-magic-400">Total Borrowed</span>
                    <span className="font-mono text-treasure-ruby">$1.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-magic-400">Utilization</span>
                    <span className="font-mono text-treasure-magenta">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-magic-400">ERC-8004 Agents</span>
                    <span className="text-magic-200">127</span>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-treasure-ruby/20 to-treasure-magenta/20 rounded-xl p-6 border border-treasure-ruby/30 glow-ruby">
                <h3 className="text-lg font-bold mb-2 text-treasure-gold flex items-center gap-2">
                  🤖 For AI Agents
                </h3>
                <p className="text-magic-300 text-sm">
                  Borrow against your holdings without selling. ERC-8004 registration ensures your agent identity is verified on-chain.
                </p>
                {!isRegistered && (
                  <a 
                    href="/register" 
                    className="inline-block mt-3 text-treasure-gold hover:text-amber-400 text-sm font-medium"
                  >
                    Register your agent →
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Liquidations Tab */
          <div className="grid lg:grid-cols-2 gap-6">
            <LiquidationInterface />
            <div className="space-y-6">
              <InterestRateChart />
              <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
                <h3 className="text-lg font-bold mb-4 text-treasure-gold flex items-center gap-2">
                  ⚔️ How Liquidations Work
                </h3>
                <div className="space-y-4 text-sm text-magic-300">
                  <div className="flex gap-3">
                    <span className="text-treasure-ruby font-bold">1.</span>
                    <p>When a position&apos;s health factor drops below 1.0, it becomes liquidatable</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-treasure-ruby font-bold">2.</span>
                    <p>Liquidators can repay up to 50% of the borrower&apos;s debt</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-treasure-ruby font-bold">3.</span>
                    <p>In return, they receive the equivalent collateral plus a 5% bonus</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-treasure-ruby font-bold">4.</span>
                    <p>This helps maintain protocol solvency and protects suppliers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-magic-800/30 mt-auto backdrop-blur-sm bg-treasure-midnight/30">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-magic-500">Halo Finance © 2026</span>
            <span className="text-treasure-gold">✨</span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/JarchsClaw/halo-finance-frontend" target="_blank" rel="noopener noreferrer" className="text-magic-400 hover:text-treasure-gold transition">GitHub</a>
            <a href="https://treasure.lol" target="_blank" rel="noopener noreferrer" className="text-magic-400 hover:text-treasure-gold transition">Treasure</a>
            <a href="#" className="text-magic-400 hover:text-treasure-gold transition">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
