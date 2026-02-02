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

// Loading skeleton component
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-magic-800/50 rounded ${className || ""}`} />
  );
}

export function PositionCard() {
  const { position, isLoading, isError, error } = useUserPosition();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
        <h2 className="text-xl font-bold mb-4 text-treasure-gold flex items-center gap-2">
          <span>💎</span> Your Position
        </h2>
        <div className="space-y-4">
          {/* Skeleton for each stat row */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="border-t border-magic-800/30 pt-4">
            <div className="flex justify-between items-center mb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-ruby/30 glow-ruby">
        <h2 className="text-xl font-bold mb-4 text-treasure-gold flex items-center gap-2">
          <span>💎</span> Your Position
        </h2>
        <div className="text-center py-4">
          <span className="text-2xl mb-2">⚠️</span>
          <p className="text-treasure-ruby text-sm mt-2">Failed to load position data</p>
          <p className="text-magic-500 text-xs mt-1">{error?.message?.slice(0, 50)}</p>
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
        <div className="text-center py-6">
          <span className="text-4xl mb-3 block">✨</span>
          <p className="text-magic-400">No active position</p>
          <p className="text-magic-500 text-sm mt-1">Supply assets to get started</p>
        </div>
      </div>
    );
  }

  const healthFactor = parseFloat(position.healthFactor);
  const hasDebt = parseFloat(position.totalDebt) > 0;

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
            <span className={`font-mono text-2xl font-bold ${hasDebt ? getHealthColor(healthFactor) : 'text-treasure-gold'}`}>
              {!hasDebt ? "∞" : healthFactor > 100 ? "∞" : healthFactor.toFixed(2)}
            </span>
          </div>
          
          {hasDebt && (
            <>
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
            </>
          )}
          
          {!hasDebt && (
            <p className="text-magic-500 text-sm mt-2">
              No debt - your position is safe ✨
            </p>
          )}
        </div>

        {/* LTV Info */}
        {hasDebt && (
          <div className="flex justify-between text-sm pt-2 border-t border-magic-800/20">
            <span className="text-magic-500">Current LTV</span>
            <span className="font-mono text-magic-300">
              {position.ltv.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
