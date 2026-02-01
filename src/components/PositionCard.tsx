"use client";

import { useUserPosition } from "@/hooks/useHalo";

function getHealthColor(healthFactor: number): string {
  if (healthFactor >= 2) return "text-treasure-gold";
  if (healthFactor >= 1.5) return "text-amber-400";
  if (healthFactor >= 1) return "text-orange-400";
  return "text-treasure-ruby";
}

function getHealthGradient(healthFactor: number): string {
  if (healthFactor >= 2) return "from-treasure-gold to-amber-500";
  if (healthFactor >= 1.5) return "from-amber-400 to-orange-400";
  if (healthFactor >= 1) return "from-orange-400 to-treasure-ruby";
  return "from-treasure-ruby to-red-600";
}

export function PositionCard() {
  const { position, isLoading } = useUserPosition();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
        <h2 className="text-xl font-bold mb-4 text-treasure-gold flex items-center gap-2">
          <span>💎</span> Your Position
        </h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-magic-800/50 rounded w-3/4"></div>
          <div className="h-4 bg-magic-800/50 rounded w-1/2"></div>
          <div className="h-4 bg-magic-800/50 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
        <h2 className="text-xl font-bold mb-4 text-treasure-gold flex items-center gap-2">
          <span>💎</span> Your Position
        </h2>
        <p className="text-magic-400">Connect wallet to view position</p>
      </div>
    );
  }

  const healthFactor = parseFloat(position.healthFactor);

  return (
    <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
      <h2 className="text-xl font-bold mb-4 text-treasure-gold flex items-center gap-2">
        <span>💎</span> Your Position
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-magic-400">Total Collateral</span>
          <span className="font-mono text-magic-100">${parseFloat(position.totalCollateral).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-magic-400">Total Debt</span>
          <span className="font-mono text-treasure-ruby">${parseFloat(position.totalDebt).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-magic-400">Available to Borrow</span>
          <span className="font-mono text-treasure-gold">${parseFloat(position.availableBorrows).toLocaleString()}</span>
        </div>

        <div className="border-t border-magic-800/30 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-magic-400">Health Factor</span>
            <span className={`font-mono text-2xl font-bold ${getHealthColor(healthFactor)}`}>
              {healthFactor > 100 ? "∞" : healthFactor.toFixed(2)}
            </span>
          </div>
          
          <div className="mt-2 h-2 bg-treasure-navy rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getHealthGradient(healthFactor)} transition-all duration-300`}
              style={{ width: `${Math.min(healthFactor * 50, 100)}%` }}
            />
          </div>
          
          {healthFactor < 1.5 && (
            <p className="text-treasure-ruby text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span> Low health factor - consider repaying debt
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
