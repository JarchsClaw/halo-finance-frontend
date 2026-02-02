"use client";

import { useAccount } from "wagmi";
import { useIsRegistered } from "@/hooks/useERC8004";

// Mock reputation data - in production would come from ERC-8004 reputation registry
function useReputationScore() {
  const { address } = useAccount();
  const { isRegistered, registryAvailable } = useIsRegistered();

  // Mock scores based on registration status
  // Note: Registry may not be available on Base mainnet yet
  if ((!registryAvailable || !isRegistered) && !address) {
    return { score: 0, level: "Unregistered", metrics: null };
  }

  // Generate deterministic mock scores from address
  const seed = address ? parseInt(address.slice(-4), 16) : 0;
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
  if (score >= 90) return "text-treasure-gold";
  if (score >= 75) return "text-treasure-magenta";
  if (score >= 60) return "text-amber-400";
  return "text-orange-400";
}

function getLevelBadge(level: string): { bg: string; text: string } {
  switch (level) {
    case "Elite":
      return { bg: "bg-treasure-gold/20 border-treasure-gold/50", text: "text-treasure-gold" };
    case "Trusted":
      return { bg: "bg-treasure-magenta/20 border-treasure-magenta/50", text: "text-treasure-magenta" };
    case "Verified":
      return { bg: "bg-amber-500/20 border-amber-500/50", text: "text-amber-400" };
    default:
      return { bg: "bg-magic-800/50 border-magic-700", text: "text-magic-400" };
  }
}

export function ReputationScore() {
  const { isConnected } = useAccount();
  const { score, level, metrics } = useReputationScore();
  const badge = getLevelBadge(level);

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
        <h3 className="text-lg font-bold mb-4 text-treasure-gold flex items-center gap-2">
          <span>⭐</span> Reputation Score
        </h3>
        <p className="text-magic-400 text-sm">Connect wallet to view reputation</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
        <h3 className="text-lg font-bold mb-4 text-treasure-gold flex items-center gap-2">
          <span>⭐</span> Reputation Score
        </h3>
        <div className="text-center py-4">
          <p className="text-magic-400 text-sm mb-3">No reputation yet</p>
          <a 
            href="/register" 
            className="text-treasure-gold hover:text-amber-400 text-sm underline"
          >
            Register as ERC-8004 agent →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-treasure-gold flex items-center gap-2">
          <span>⭐</span> Reputation Score
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
            Demo Data
          </span>
          <div className={`px-2 py-1 rounded border text-xs font-medium ${badge.bg} ${badge.text}`}>
            ✨ {level}
          </div>
        </div>
      </div>

      {/* Main Score */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-magic-500 text-sm mt-1">out of 100</div>
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
              className="text-treasure-navy"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score / 100) * 352} 352`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#C026D3" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </div>
      </div>

      {/* Metric Breakdown */}
      <div className="space-y-3">
        <div className="text-xs text-magic-500 uppercase tracking-wide mb-2">Metrics</div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-magic-400">Transaction History</span>
            <span className="font-mono text-magic-200">{metrics.transactionHistory}</span>
          </div>
          <div className="h-1.5 bg-treasure-navy rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-treasure-magenta to-magic-500 rounded-full" 
              style={{ width: `${metrics.transactionHistory}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-magic-400">On-Time Repayments</span>
            <span className="font-mono text-magic-200">{metrics.onTimeRepayments}</span>
          </div>
          <div className="h-1.5 bg-treasure-navy rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-treasure-gold to-amber-400 rounded-full" 
              style={{ width: `${metrics.onTimeRepayments}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-magic-400">Collateral Ratio</span>
            <span className="font-mono text-magic-200">{metrics.collateralRatio}</span>
          </div>
          <div className="h-1.5 bg-treasure-navy rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-treasure-ruby to-treasure-magenta rounded-full" 
              style={{ width: `${metrics.collateralRatio}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-magic-400">Account Age</span>
            <span className="font-mono text-magic-200">{metrics.accountAge}</span>
          </div>
          <div className="h-1.5 bg-treasure-navy rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-treasure-gold rounded-full" 
              style={{ width: `${metrics.accountAge}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
