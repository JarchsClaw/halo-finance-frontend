"use client";

import { useState, useEffect } from "react";
import { useUSDCBalance, useUSDCAllowance, useApproveUSDC, useSupply, useWithdraw, useUserPosition } from "@/hooks/useHalo";

export function SupplyForm() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"supply" | "withdraw">("supply");
  
  const { balance, refetch: refetchBalance } = useUSDCBalance();
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useApproveUSDC();
  const { supply, isPending: isSupplying, isSuccess: supplySuccess } = useSupply();
  const { withdraw, isPending: isWithdrawing, isSuccess: withdrawSuccess } = useWithdraw();
  const { refetch: refetchPosition } = useUserPosition();

  const needsApproval = mode === "supply" && parseFloat(amount || "0") > parseFloat(allowance);
  const isLoading = isApproving || isSupplying || isWithdrawing;

  useEffect(() => {
    if (approveSuccess) refetchAllowance();
    if (supplySuccess || withdrawSuccess) {
      refetchBalance();
      refetchPosition();
      setAmount("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveSuccess, supplySuccess, withdrawSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    
    if (needsApproval) {
      approve(amount);
    } else if (mode === "supply") {
      supply(amount);
    } else {
      withdraw(amount);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("supply")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "supply" ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Supply
        </button>
        <button
          onClick={() => setMode("withdraw")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "withdraw" ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Withdraw
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-gray-400">Amount (USDC)</label>
            <span className="text-gray-500">Balance: {parseFloat(balance).toLocaleString()} USDC</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-lg font-mono focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => setAmount(balance)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 text-sm hover:text-violet-300"
            >
              MAX
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isApproving ? "Approving..." : mode === "supply" ? "Supplying..." : "Withdrawing..."}
            </span>
          ) : needsApproval ? (
            "Approve USDC"
          ) : mode === "supply" ? (
            "Supply USDC"
          ) : (
            "Withdraw USDC"
          )}
        </button>
      </form>
    </div>
  );
}
