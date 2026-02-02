"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useBorrow, useRepay, useUserPosition, useUSDCBalance, useUSDCAllowance, useApproveUSDC } from "@/hooks/useHalo";
import { useIsRegistered } from "@/hooks/useERC8004";

// Safety buffer for borrowing (95% of max to avoid liquidation risk)
const BORROW_SAFETY_FACTOR = 0.95;

export function BorrowForm() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"borrow" | "repay">("borrow");
  const [showSafetyTooltip, setShowSafetyTooltip] = useState(false);
  
  const { position, refetch: refetchPosition } = useUserPosition();
  const { refetch: refetchBalance } = useUSDCBalance();
  const { allowanceRaw, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving, isSuccess: approveSuccess, isError: approveError, error: appError, reset: resetApprove, hash: approveHash } = useApproveUSDC();
  const { borrow, isPending: isBorrowing, isSuccess: borrowSuccess, isError: borrowError, error: borError, reset: resetBorrow, hash: borrowHash } = useBorrow();
  const { repay, isPending: isRepaying, isSuccess: repaySuccess, isError: repayError, error: repError, reset: resetRepay, hash: repayHash } = useRepay();
  const { isRegistered, isLoading: checkingRegistration, registryAvailable } = useIsRegistered();

  const needsApproval = mode === "repay" && allowanceRaw === BigInt(0);
  const isLoading = isApproving || isBorrowing || isRepaying;

  // Calculate safe max borrow (95% of available)
  const safeBorrowAmount = useMemo(() => {
    const available = parseFloat(position?.availableBorrows || "0");
    return (available * BORROW_SAFETY_FACTOR).toFixed(2);
  }, [position?.availableBorrows]);

  // Validation
  const validation = useMemo(() => {
    const amountNum = parseFloat(amount || "0");
    const availableNum = parseFloat(position?.availableBorrows || "0");
    const safeAvailable = availableNum * BORROW_SAFETY_FACTOR;
    const debtNum = parseFloat(position?.totalDebt || "0");
    
    if (!amount || amount === "") {
      return { valid: false, error: null };
    }
    
    if (amountNum <= 0) {
      return { valid: false, error: "Amount must be greater than 0" };
    }
    
    if (mode === "borrow") {
      if (amountNum > safeAvailable) {
        return { 
          valid: false, 
          error: `Exceeds safe borrow limit. Max recommended: ${safeAvailable.toLocaleString()} USDC (95% of available)` 
        };
      }
      if (amountNum > availableNum) {
        return { 
          valid: false, 
          error: `Exceeds borrowing capacity. Maximum: ${availableNum.toLocaleString()} USDC` 
        };
      }
    }
    
    if (mode === "repay" && amountNum > debtNum) {
      return { valid: false, error: `Cannot repay more than your debt (${debtNum.toLocaleString()} USDC)` };
    }
    
    return { valid: true, error: null };
  }, [amount, mode, position?.availableBorrows, position?.totalDebt]);

  // Handle success toasts
  useEffect(() => {
    if (approveSuccess && approveHash) {
      toast.success("✨ USDC Approved!", {
        description: "You can now repay your loan",
        action: {
          label: "View TX",
          onClick: () => window.open(`https://basescan.org/tx/${approveHash}`, "_blank"),
        },
      });
      refetchAllowance();
      resetApprove();
    }
  }, [approveSuccess, approveHash, refetchAllowance, resetApprove]);

  useEffect(() => {
    if (borrowSuccess && borrowHash) {
      toast.success("🔮 Borrow Successful!", {
        description: `You borrowed ${amount} USDC`,
        action: {
          label: "View TX",
          onClick: () => window.open(`https://basescan.org/tx/${borrowHash}`, "_blank"),
        },
      });
      refetchBalance();
      refetchPosition();
      setAmount("");
      resetBorrow();
    }
  }, [borrowSuccess, borrowHash, amount, refetchBalance, refetchPosition, resetBorrow]);

  useEffect(() => {
    if (repaySuccess && repayHash) {
      toast.success("💸 Repayment Successful!", {
        description: `You repaid ${amount} USDC`,
        action: {
          label: "View TX",
          onClick: () => window.open(`https://basescan.org/tx/${repayHash}`, "_blank"),
        },
      });
      refetchBalance();
      refetchPosition();
      setAmount("");
      resetRepay();
    }
  }, [repaySuccess, repayHash, amount, refetchBalance, refetchPosition, resetRepay]);

  // Handle error toasts
  useEffect(() => {
    if (approveError && appError) {
      toast.error("Approval Failed", {
        description: appError.message?.slice(0, 100) || "Transaction was rejected",
      });
      resetApprove();
    }
  }, [approveError, appError, resetApprove]);

  useEffect(() => {
    if (borrowError && borError) {
      toast.error("Borrow Failed", {
        description: borError.message?.slice(0, 100) || "Transaction was rejected",
      });
      resetBorrow();
    }
  }, [borrowError, borError, resetBorrow]);

  useEffect(() => {
    if (repayError && repError) {
      toast.error("Repayment Failed", {
        description: repError.message?.slice(0, 100) || "Transaction was rejected",
      });
      resetRepay();
    }
  }, [repayError, repError, resetRepay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.valid) return;

    if (needsApproval) {
      approve();
    } else if (mode === "borrow") {
      borrow(amount);
    } else {
      repay(amount);
    }
  };

  const handleMaxClick = () => {
    if (mode === "borrow") {
      // Use 95% safe max for borrow
      setAmount(safeBorrowAmount);
    } else {
      // Use full debt for repay
      setAmount(position?.totalDebt || "0");
    }
  };

  // Agents need ERC-8004 registration to borrow (only if registry is available)
  const canBorrow = !registryAvailable || isRegistered || checkingRegistration;

  return (
    <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-ruby/30 glow-ruby">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("borrow")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "borrow" 
              ? "bg-gradient-to-r from-treasure-ruby to-treasure-magenta text-white shadow-ruby" 
              : "bg-treasure-navy/60 text-magic-400 hover:bg-treasure-navy/80 border border-magic-800/30"
          }`}
        >
          🔮 Borrow
        </button>
        <button
          onClick={() => setMode("repay")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "repay" 
              ? "bg-gradient-to-r from-treasure-ruby to-treasure-magenta text-white shadow-ruby" 
              : "bg-treasure-navy/60 text-magic-400 hover:bg-treasure-navy/80 border border-magic-800/30"
          }`}
        >
          💸 Repay
        </button>
      </div>

      {mode === "borrow" && registryAvailable && !isRegistered && !checkingRegistration && (
        <div className="bg-treasure-gold/10 border border-treasure-gold/50 rounded-lg p-4 mb-4">
          <p className="text-treasure-gold text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span>
              Agent borrowing requires ERC-8004 registration. 
              <a href="/register" className="underline ml-1 hover:text-amber-400">Register your agent →</a>
            </span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-magic-400">Amount (USDC)</label>
            <span className="text-magic-500">
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
              className={`w-full bg-treasure-navy/80 border rounded-lg px-4 py-3 text-lg font-mono text-magic-100 placeholder-magic-600 focus:outline-none transition ${
                validation.error 
                  ? "border-treasure-ruby/50 focus:border-treasure-ruby" 
                  : "border-magic-800/50 focus:border-treasure-ruby/50 focus:shadow-ruby"
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {mode === "borrow" && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSafetyTooltip(!showSafetyTooltip)}
                    className="text-magic-500 hover:text-magic-300 text-xs"
                    onMouseEnter={() => setShowSafetyTooltip(true)}
                    onMouseLeave={() => setShowSafetyTooltip(false)}
                  >
                    ⓘ
                  </button>
                  {showSafetyTooltip && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-treasure-midnight border border-magic-800/50 rounded-lg text-xs text-magic-300 shadow-lg z-10">
                      MAX uses 95% of available borrow to maintain a safety buffer and reduce liquidation risk.
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-treasure-ruby text-sm hover:text-red-400 font-medium"
              >
                {mode === "borrow" ? "SAFE MAX" : "MAX"}
              </button>
            </div>
          </div>
          {validation.error && (
            <p className="mt-2 text-sm text-treasure-ruby flex items-center gap-1">
              <span>⚠️</span> {validation.error}
            </p>
          )}
          {mode === "borrow" && !validation.error && amount && parseFloat(amount) > 0 && (
            <p className="mt-2 text-xs text-magic-500">
              💡 Safe limit: {safeBorrowAmount} USDC (95% of available)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !validation.valid || (mode === "borrow" && !canBorrow)}
          className="w-full bg-gradient-to-r from-treasure-ruby to-treasure-magenta hover:from-red-500 hover:to-fuchsia-500 disabled:from-magic-800 disabled:to-magic-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition shadow-ruby disabled:shadow-none"
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
            "🔮 Approve USDC"
          ) : mode === "borrow" ? (
            "🔮 Borrow USDC"
          ) : (
            "💸 Repay USDC"
          )}
        </button>
      </form>
    </div>
  );
}
