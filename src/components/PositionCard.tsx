"use client";

import { useUserPosition } from "@/hooks/useHalo";

function getHealthColor(healthFactor: number): string {
  if (healthFactor >= 2) return "text-green-400";
  if (healthFactor >= 1.5) return "text-yellow-400";
  if (healthFactor >= 1) return "text-orange-400";
  return "text-red-400";
}

export function PositionCard() {
  const { position, isLoading } = useUserPosition();

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Your Position</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Your Position</h2>
        <p className="text-gray-400">Connect wallet to view position</p>
      </div>
    );
  }

  const healthFactor = parseFloat(position.healthFactor);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold mb-4">Your Position</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Total Collateral</span>
          <span className="font-mono">${parseFloat(position.totalCollateral).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Total Debt</span>
          <span className="font-mono">${parseFloat(position.totalDebt).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Available to Borrow</span>
          <span className="font-mono text-green-400">${parseFloat(position.availableBorrows).toLocaleString()}</span>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Health Factor</span>
            <span className={`font-mono text-2xl font-bold ${getHealthColor(healthFactor)}`}>
              {healthFactor > 100 ? "∞" : healthFactor.toFixed(2)}
            </span>
          </div>
          
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full ${healthFactor >= 2 ? 'bg-green-400' : healthFactor >= 1 ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{ width: `${Math.min(healthFactor * 50, 100)}%` }}
            />
          </div>
          
          {healthFactor < 1.5 && (
            <p className="text-orange-400 text-sm mt-2">
              ⚠️ Low health factor - consider repaying debt
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
