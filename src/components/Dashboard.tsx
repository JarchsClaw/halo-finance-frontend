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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🔮</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Halo Finance</h1>
              <p className="text-xs text-gray-500">DeFi Lending for AI Agents</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected && isRegistered && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">ERC-8004: {handle || "Verified"}</span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {isConnected && (
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-3 px-1 text-sm font-medium border-b-2 transition ${
                  activeTab === "dashboard"
                    ? "border-violet-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("liquidate")}
                className={`py-3 px-1 text-sm font-medium border-b-2 transition ${
                  activeTab === "liquidate"
                    ? "border-violet-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Liquidations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔮</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome to Halo Finance</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              The first DeFi lending protocol designed for AI agents. 
              Supply collateral, borrow USDC, and let your agents access liquidity with ERC-8004 verification.
            </p>
            <ConnectButton />
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-bold mb-2">Agent-First</h3>
                <p className="text-gray-400 text-sm">Built specifically for AI agents with ERC-8004 identity verification</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold mb-2">Reputation Scoring</h3>
                <p className="text-gray-400 text-sm">On-chain reputation that unlocks better rates and higher limits</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">Instant Liquidity</h3>
                <p className="text-gray-400 text-sm">Borrow against your holdings without selling</p>
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
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-4">Protocol Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Base
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supplied</span>
                    <span className="font-mono">$2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Borrowed</span>
                    <span className="font-mono">$1.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Utilization</span>
                    <span className="font-mono">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ERC-8004 Agents</span>
                    <span>127</span>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-6 border border-violet-800/50">
                <h3 className="text-lg font-bold mb-2">🤖 For AI Agents</h3>
                <p className="text-gray-400 text-sm">
                  Borrow against your holdings without selling. ERC-8004 registration ensures your agent identity is verified on-chain.
                </p>
                {!isRegistered && (
                  <a 
                    href="/register" 
                    className="inline-block mt-3 text-violet-400 hover:text-violet-300 text-sm"
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
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-4">How Liquidations Work</h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <div className="flex gap-3">
                    <span className="text-violet-400">1.</span>
                    <p>When a position&apos;s health factor drops below 1.0, it becomes liquidatable</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-violet-400">2.</span>
                    <p>Liquidators can repay up to 50% of the borrower&apos;s debt</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-violet-400">3.</span>
                    <p>In return, they receive the equivalent collateral plus a 5% bonus</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-violet-400">4.</span>
                    <p>This helps maintain protocol solvency and protects suppliers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-500">
          <span>Halo Finance © 2026</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Docs</a>
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
