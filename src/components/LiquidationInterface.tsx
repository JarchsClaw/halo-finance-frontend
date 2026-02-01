"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { HALO_CONTRACT, USDC_BASE } from "@/lib/contracts";

// Mock liquidatable positions
const MOCK_LIQUIDATABLE_POSITIONS = [
  {
    id: "0x1a2b...3c4d",
    address: "0x1a2b3c4d5e6f7890abcdef1234567890abcd3c4d",
    collateral: "45,230",
    debt: "42,100",
    healthFactor: 0.92,
    maxLiquidatable: "21,050",
    bonus: "5%",
  },
  {
    id: "0x5e6f...7a8b",
    address: "0x5e6f7a8b9c0d1e2f3456789012345678901a7a8b",
    collateral: "12,500",
    debt: "11,800",
    healthFactor: 0.88,
    maxLiquidatable: "5,900",
    bonus: "5%",
  },
  {
    id: "0x9c0d...1e2f",
    address: "0x9c0d1e2f3a4b5c6d789012345678901234561e2f",
    collateral: "78,900",
    debt: "75,200",
    healthFactor: 0.95,
    maxLiquidatable: "37,600",
    bonus: "5%",
  },
];

// Liquidation ABI
const LIQUIDATION_ABI = [
  {
    name: "liquidationCall",
    type: "function",
    inputs: [
      { name: "collateralAsset", type: "address" },
      { name: "debtAsset", type: "address" },
      { name: "user", type: "address" },
      { name: "debtToCover", type: "uint256" },
      { name: "receiveAToken", type: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

function getHealthColor(healthFactor: number): string {
  if (healthFactor >= 1) return "text-amber-400";
  if (healthFactor >= 0.9) return "text-orange-400";
  return "text-treasure-ruby";
}

export function LiquidationInterface() {
  const { isConnected, address } = useAccount();
  const [selectedPosition, setSelectedPosition] = useState<typeof MOCK_LIQUIDATABLE_POSITIONS[0] | null>(null);
  const [amount, setAmount] = useState("");
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleLiquidate = () => {
    if (!selectedPosition || !amount || !address) return;
    
    writeContract({
      address: HALO_CONTRACT,
      abi: LIQUIDATION_ABI,
      functionName: "liquidationCall",
      args: [
        USDC_BASE, // collateral asset
        USDC_BASE, // debt asset
        selectedPosition.address as `0x${string}`,
        parseUnits(amount, 6),
        false, // receive underlying, not aToken
      ],
    });
  };

  const isLoading = isPending || isConfirming;

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-magic-800/30 glow-magic">
        <h3 className="text-lg font-bold mb-4 text-treasure-gold flex items-center gap-2">
          <span>⚔️</span> Liquidations
        </h3>
        <p className="text-magic-400 text-sm">Connect wallet to view liquidation opportunities</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-ruby/30 glow-ruby">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-treasure-gold flex items-center gap-2">
          <span>⚔️</span> Liquidation Opportunities
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-magic-500">Bonus:</span>
          <span className="text-treasure-gold font-medium">+5%</span>
        </div>
      </div>

      {/* Liquidatable Positions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-magic-500 text-xs uppercase">
              <th className="text-left py-2">Position</th>
              <th className="text-right py-2">Collateral</th>
              <th className="text-right py-2">Debt</th>
              <th className="text-right py-2">Health</th>
              <th className="text-right py-2">Max Liquidate</th>
              <th className="text-right py-2"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LIQUIDATABLE_POSITIONS.map((position) => (
              <tr 
                key={position.id} 
                className={`border-t border-magic-800/30 ${selectedPosition?.id === position.id ? 'bg-treasure-navy/50' : ''}`}
              >
                <td className="py-3 font-mono text-xs text-magic-300">{position.id}</td>
                <td className="py-3 text-right text-magic-200">${position.collateral}</td>
                <td className="py-3 text-right text-treasure-ruby">${position.debt}</td>
                <td className={`py-3 text-right font-mono ${getHealthColor(position.healthFactor)}`}>
                  {position.healthFactor.toFixed(2)}
                </td>
                <td className="py-3 text-right text-treasure-gold">${position.maxLiquidatable}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => setSelectedPosition(position)}
                    className="text-treasure-magenta hover:text-magic-400 text-xs font-medium"
                  >
                    Select ✨
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {MOCK_LIQUIDATABLE_POSITIONS.length === 0 && (
        <div className="text-center py-8">
          <span className="text-3xl mb-2">✨</span>
          <p className="text-magic-400 text-sm">No liquidatable positions available</p>
        </div>
      )}

      {/* Liquidation Form */}
      {selectedPosition && (
        <div className="mt-6 p-4 bg-treasure-navy/60 rounded-lg border border-treasure-ruby/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-treasure-gold">⚔️ Liquidate Position</h4>
            <button 
              onClick={() => setSelectedPosition(null)}
              className="text-magic-500 hover:text-magic-200 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-magic-500">Position:</span>
              <span className="ml-2 font-mono text-magic-300">{selectedPosition.id}</span>
            </div>
            <div>
              <span className="text-magic-500">Health Factor:</span>
              <span className={`ml-2 ${getHealthColor(selectedPosition.healthFactor)}`}>
                {selectedPosition.healthFactor.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-magic-500">Max Liquidatable:</span>
              <span className="ml-2 text-treasure-gold">${selectedPosition.maxLiquidatable}</span>
            </div>
            <div>
              <span className="text-magic-500">Bonus:</span>
              <span className="ml-2 text-treasure-gold">{selectedPosition.bonus}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-magic-400 mb-2">Amount to Liquidate (USDC)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-treasure-navy/80 border border-magic-800/50 rounded-lg px-4 py-3 font-mono text-magic-100 placeholder-magic-600 focus:outline-none focus:border-treasure-ruby/50 focus:shadow-ruby transition"
              />
              <button
                type="button"
                onClick={() => setAmount(selectedPosition.maxLiquidatable.replace(/,/g, ''))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-treasure-ruby text-sm hover:text-red-400 font-medium"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Profit estimation */}
          {amount && parseFloat(amount) > 0 && (
            <div className="mb-4 p-3 bg-treasure-gold/10 border border-treasure-gold/30 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-magic-400">Estimated Profit:</span>
                <span className="text-treasure-gold font-medium">
                  +${(parseFloat(amount) * 0.05).toFixed(2)} USDC ✨
                </span>
              </div>
            </div>
          )}

          {isSuccess && hash && (
            <div className="mb-4 p-3 bg-treasure-gold/20 border border-treasure-gold/50 rounded-lg">
              <p className="text-treasure-gold text-sm">
                ✨ Liquidation successful!{" "}
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
            onClick={handleLiquidate}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-treasure-ruby to-red-600 hover:from-red-500 hover:to-red-700 disabled:from-magic-800 disabled:to-magic-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition shadow-ruby disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isPending ? "Confirm in wallet..." : "Liquidating..."}
              </span>
            ) : (
              "⚔️ Execute Liquidation"
            )}
          </button>

          <p className="mt-3 text-xs text-magic-500 text-center">
            You will receive the collateral + 5% bonus ✨
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-treasure-navy/60 rounded-lg border border-magic-800/20">
        <p className="text-xs text-magic-400">
          <span className="text-treasure-gold">⚠️</span> Liquidation targets positions with health factor below 1.0. 
          You repay part of their debt and receive their collateral + 5% bonus.
        </p>
      </div>
    </div>
  );
}
