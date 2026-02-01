"use client";

import { useAccount } from "wagmi";
import { useIsRegistered } from "@/hooks/useERC8004";

// Mock reputation data - in production would come from ERC-8004 reputation registry
function useReputationScore() {
  const { address } = useAccount();
  const { isRegistered } = useIsRegistered();

  // Mock scores based on registration status
  if (!isRegistered || !address) {
    return { score: 0, level: "Unregistered", metrics: null };
  }

  // Generate deterministic mock scores from address
  const seed = parseInt(address.slice(-4), 16);
  const score = 65 + (seed % 35); // 65-100 range

  return {
    score,
    level: score >= 90 ? "Elite" : score >= 75 ? "Trusted" : "Verified",
    metrics: {
      transactionHistory: Math.min(100, 50 + (seed % 50)),
      onTimeRepayments: Math.min(100, 70 + (seed % 30)),
      collateralRatio: Math.min(100, 60 + (seed % 40)),
      accountAge: Math.min(100, 40 + (seed % 60)),
    },
  };
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 75) return "text-blue-400";
  if (score >= 60) return "text-yellow-400";
  return "text-orange-400";
}

function getLevelBadge(level: string): { bg: string; text: string } {
  switch (level) {
    case "Elite":
      return { bg: "bg-green-900/50 border-green-700", text: "text-green-400" };
    case "Trusted":
      return { bg: "bg-blue-900/50 border-blue-700", text: "text-blue-400" };
    case "Verified":
      return { bg: "bg-yellow-900/50 border-yellow-700", text: "text-yellow-400" };
    default:
      return { bg: "bg-gray-900/50 border-gray-700", text: "text-gray-400" };
  }
}

export function ReputationScore() {
  const { isConnected } = useAccount();
  const { score, level, metrics } = useReputationScore();
  const badge = getLevelBadge(level);

  if (!isConnected) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4">Reputation Score</h3>
        <p className="text-gray-400 text-sm">Connect wallet to view reputation</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4">Reputation Score</h3>
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-3">No reputation yet</p>
          <a 
            href="/register" 
            className="text-violet-400 hover:text-violet-300 text-sm underline"
          >
            Register as ERC-8004 agent →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Reputation Score</h3>
        <div className={`px-2 py-1 rounded border text-xs font-medium ${badge.bg} ${badge.text}`}>
          {level}
        </div>
      </div>

      {/* Main Score */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-gray-500 text-sm mt-1">out of 100</div>
      </div>

      {/* Score Ring Visual */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-800"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score / 100) * 352} 352`}
              className={getScoreColor(score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </div>
      </div>

      {/* Metric Breakdown */}
      <div className="space-y-3">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Metrics</div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Transaction History</span>
            <span className="font-mono">{metrics.transactionHistory}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-500 rounded-full" 
              style={{ width: `${metrics.transactionHistory}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">On-Time Repayments</span>
            <span className="font-mono">{metrics.onTimeRepayments}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${metrics.onTimeRepayments}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Collateral Ratio</span>
            <span className="font-mono">{metrics.collateralRatio}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${metrics.collateralRatio}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Account Age</span>
            <span className="font-mono">{metrics.accountAge}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${metrics.accountAge}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
