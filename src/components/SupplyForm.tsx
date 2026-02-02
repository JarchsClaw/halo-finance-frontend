"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useUSDCBalance, useUSDCAllowance, useApproveUSDC, useSupply, useWithdraw, useUserPosition } from "@/hooks/useHalo";

export function SupplyForm() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"supply" | "withdraw">("supply");
  
  const { balance, refetch: refetchBalance } = useUSDCBalance();
  const { allowanceRaw, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving, isSuccess: approveSuccess, isError: approveError, error: appError, reset: resetApprove, hash: approveHash } = useApproveUSDC();
  const { supply, isPending: isSupplying, isSuccess: supplySuccess, isError: supplyError, error: suppError, reset: resetSupply, hash: supplyHash } = useSupply();
  const { withdraw, isPending: isWithdrawing, isSuccess: withdrawSuccess, isError: withdrawError, error: withError, reset: resetWithdraw, hash: withdrawHash } = useWithdraw();
  const { position, refetch: refetchPosition } = useUserPosition();

  // Check if needs approval (using raw values for precision)
  const needsApproval = mode === "supply" && allowanceRaw === BigInt(0);
  const isLoading = isApproving || isSupplying || isWithdrawing;

  // Validation
  const validation = useMemo(() => {
    const amountNum = parseFloat(amount || "0");
    const balanceNum = parseFloat(balance);
    const collateralNum = parseFloat(position?.totalCollateral || "0");
    
    if (!amount || amount === "") {
      return { valid: false, error: null };
    }
    
    if (amountNum <= 0) {
      return { valid: false, error: "Amount must be greater than 0" };
    }
    
    if (mode === "supply" && amountNum > balanceNum) {
      return { valid: false, error: `Insufficient balance. You have ${balanceNum.toLocaleString()} USDC` };
    }
    
    if (mode === "withdraw" && amountNum > collateralNum) {
      return { valid: false, error: `Cannot withdraw more than supplied (${collateralNum.toLocaleString()})` };
    }
    
    return { valid: true, error: null };
  }, [amount, balance, mode, position?.totalCollateral]);

  // Handle success toasts
  useEffect(() => {
    if (approveSuccess && approveHash) {
      toast.success("✨ USDC Approved!", {
        description: "You can now supply USDC to Halo Finance",
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
    if (supplySuccess && supplyHash) {
      toast.success("✨ Supply Successful!", {
        description: `You supplied ${amount} USDC`,
        action: {
          label: "View TX",
          onClick: () => window.open(`https://basescan.org/tx/${supplyHash}`, "_blank"),
        },
      });
      refetchBalance();
      refetchPosition();
      setAmount("");
      resetSupply();
    }
  }, [supplySuccess, supplyHash, amount, refetchBalance, refetchPosition, resetSupply]);

  useEffect(() => {
    if (withdrawSuccess && withdrawHash) {
      toast.success("💰 Withdrawal Successful!", {
        description: `You withdrew ${amount} USDC`,
        action: {
          label: "View TX",
          onClick: () => window.open(`https://basescan.org/tx/${withdrawHash}`, "_blank"),
        },
      });
      refetchBalance();
      refetchPosition();
      setAmount("");
      resetWithdraw();
    }
  }, [withdrawSuccess, withdrawHash, amount, refetchBalance, refetchPosition, resetWithdraw]);

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
    if (supplyError && suppError) {
      toast.error("Supply Failed", {
        description: suppError.message?.slice(0, 100) || "Transaction was rejected",
      });
      resetSupply();
    }
  }, [supplyError, suppError, resetSupply]);

  useEffect(() => {
    if (withdrawError && withError) {
      toast.error("Withdrawal Failed", {
        description: withError.message?.slice(0, 100) || "Transaction was rejected",
      });
      resetWithdraw();
    }
  }, [withdrawError, withError, resetWithdraw]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.valid) return;
    
    if (needsApproval) {
      approve();
    } else if (mode === "supply") {
      supply(amount);
    } else {
      withdraw(amount);
    }
  };

  const handleMaxClick = () => {
    if (mode === "supply") {
      setAmount(balance);
    } else {
      setAmount(position?.totalCollateral || "0");
    }
  };

  return (
    <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-gold/30 glow-gold">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("supply")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "supply" 
              ? "bg-gradient-to-r from-treasure-gold to-amber-500 text-treasure-navy shadow-gold" 
              : "bg-treasure-navy/60 text-magic-400 hover:bg-treasure-navy/80 border border-magic-800/30"
          }`}
        >
          ✨ Supply
        </button>
        <button
          onClick={() => setMode("withdraw")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mode === "withdraw" 
              ? "bg-gradient-to-r from-treasure-gold to-amber-500 text-treasure-navy shadow-gold" 
              : "bg-treasure-navy/60 text-magic-400 hover:bg-treasure-navy/80 border border-magic-800/30"
          }`}
        >
          💰 Withdraw
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-magic-400">Amount (USDC)</label>
            <span className="text-magic-500">
              {mode === "supply" 
                ? `Balance: ${parseFloat(balance).toLocaleString()} USDC`
                : `Supplied: ${parseFloat(position?.totalCollateral || "0").toLocaleString()} USDC`
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
                  : "border-magic-800/50 focus:border-treasure-gold/50 focus:shadow-gold"
              }`}
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-treasure-gold text-sm hover:text-amber-400 font-medium"
            >
              MAX
            </button>
          </div>
          {validation.error && (
            <p className="mt-2 text-sm text-treasure-ruby flex items-center gap-1">
              <span>⚠️</span> {validation.error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !validation.valid}
          className="w-full bg-gradient-to-r from-treasure-gold to-amber-500 hover:from-amber-400 hover:to-yellow-400 disabled:from-magic-800 disabled:to-magic-700 disabled:cursor-not-allowed text-treasure-navy font-semibold py-3 px-4 rounded-lg transition shadow-gold disabled:shadow-none"
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
            "✨ Approve USDC"
          ) : mode === "supply" ? (
            "✨ Supply USDC"
          ) : (
            "💰 Withdraw USDC"
          )}
        </button>
      </form>
    </div>
  );
}
