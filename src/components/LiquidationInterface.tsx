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
  if (healthFactor >= 1) return "text-yellow-400";
  if (healthFactor >= 0.9) return "text-orange-400";
  return "text-red-400";
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
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4">Liquidations</h3>
        <p className="text-gray-400 text-sm">Connect wallet to view liquidation opportunities</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Liquidation Opportunities</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Bonus:</span>
          <span className="text-green-400 font-medium">5%</span>
        </div>
      </div>

      {/* Liquidatable Positions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase">
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
                className={`border-t border-gray-800 ${selectedPosition?.id === position.id ? 'bg-gray-800/50' : ''}`}
              >
                <td className="py-3 font-mono text-xs">{position.id}</td>
                <td className="py-3 text-right">${position.collateral}</td>
                <td className="py-3 text-right">${position.debt}</td>
                <td className={`py-3 text-right font-mono ${getHealthColor(position.healthFactor)}`}>
                  {position.healthFactor.toFixed(2)}
                </td>
                <td className="py-3 text-right text-green-400">${position.maxLiquidatable}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => setSelectedPosition(position)}
                    className="text-violet-400 hover:text-violet-300 text-xs"
                  >
                    Select
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
          <p className="text-gray-400 text-sm">No liquidatable positions available</p>
        </div>
      )}

      {/* Liquidation Form */}
      {selectedPosition && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Liquidate Position</h4>
            <button 
              onClick={() => setSelectedPosition(null)}
              className="text-gray-500 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Position:</span>
              <span className="ml-2 font-mono">{selectedPosition.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Health Factor:</span>
              <span className={`ml-2 ${getHealthColor(selectedPosition.healthFactor)}`}>
                {selectedPosition.healthFactor.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Max Liquidatable:</span>
              <span className="ml-2 text-green-400">${selectedPosition.maxLiquidatable}</span>
            </div>
            <div>
              <span className="text-gray-500">Bonus:</span>
              <span className="ml-2 text-green-400">{selectedPosition.bonus}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Amount to Liquidate (USDC)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 font-mono focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() => setAmount(selectedPosition.maxLiquidatable.replace(/,/g, ''))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 text-sm hover:text-violet-300"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Profit estimation */}
          {amount && parseFloat(amount) > 0 && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-800 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Profit:</span>
                <span className="text-green-400 font-medium">
                  +${(parseFloat(amount) * 0.05).toFixed(2)} USDC
                </span>
              </div>
            </div>
          )}

          {isSuccess && hash && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
              <p className="text-green-400 text-sm">
                ✓ Liquidation successful!{" "}
                <a 
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View transaction →
                </a>
              </p>
            </div>
          )}

          <button
            onClick={handleLiquidate}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition"
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
              "Execute Liquidation"
            )}
          </button>

          <p className="mt-3 text-xs text-gray-500 text-center">
            You will receive the collateral + 5% bonus
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-400">
          <span className="text-yellow-400">⚠️</span> Liquidation targets positions with health factor below 1.0. 
          You repay part of their debt and receive their collateral + 5% bonus.
        </p>
      </div>
    </div>
  );
}
