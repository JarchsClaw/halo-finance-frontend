"use client";

import { useState, useEffect } from "react";
import { useBorrow, useRepay, useUserPosition, useUSDCBalance, useUSDCAllowance, useApproveUSDC } from "@/hooks/useHalo";
import { useIsRegistered } from "@/hooks/useERC8004";

export function BorrowForm() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"borrow" | "repay">("borrow");
  
  const { position, refetch: refetchPosition } = useUserPosition();
  const { refetch: refetchBalance } = useUSDCBalance();
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useApproveUSDC();
  const { borrow, isPending: isBorrowing, isSuccess: borrowSuccess } = useBorrow();
  const { repay, isPending: isRepaying, isSuccess: repaySuccess } = useRepay();
  const { isRegistered, isLoading: checkingRegistration } = useIsRegistered();

  const needsApproval = mode === "repay" && parseFloat(amount || "0") > parseFloat(allowance);
  const isLoading = isApproving || isBorrowing || isRepaying;

  useEffect(() => {
    if (approveSuccess) refetchAllowance();
    if (borrowSuccess || repaySuccess) {
      refetchBalance();
      refetchPosition();
      setAmount("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveSuccess, borrowSuccess, repaySuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    if (needsApproval) {
      approve(amount);
    } else if (mode === "borrow") {
      borrow(amount);
    } else {
      repay(amount);
    }
  };

  // Agents need ERC-8004 registration to borrow
  const canBorrow = isRegistered || !checkingRegistration;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("borrow")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "borrow" ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Borrow
        </button>
        <button
          onClick={() => setMode("repay")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "repay" ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Repay
        </button>
      </div>

      {mode === "borrow" && !isRegistered && !checkingRegistration && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ Agent borrowing requires ERC-8004 registration. 
            <a href="/register" className="underline ml-1">Register your agent →</a>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-gray-400">Amount (USDC)</label>
            <span className="text-gray-500">
              {mode === "borrow" 
                ? `Available: $${position ? parseFloat(position.availableBorrows).toLocaleString() : "0"}`
                : `Debt: $${position ? parseFloat(position.totalDebt).toLocaleString() : "0"}`
              }
            </span>
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
              onClick={() => setAmount(mode === "borrow" ? (position?.availableBorrows || "0") : (position?.totalDebt || "0"))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 text-sm hover:text-violet-300"
            >
              MAX
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount || parseFloat(amount) <= 0 || (mode === "borrow" && !canBorrow)}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isApproving ? "Approving..." : mode === "borrow" ? "Borrowing..." : "Repaying..."}
            </span>
          ) : needsApproval ? (
            "Approve USDC"
          ) : mode === "borrow" ? (
            "Borrow USDC"
          ) : (
            "Repay USDC"
          )}
        </button>
      </form>
    </div>
  );
}
