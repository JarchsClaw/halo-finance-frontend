"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSupplyCollateral, useWithdrawCollateral, useApproveToken, useTokenBalance, useTokenAllowance, useUserPosition } from "@/hooks/useHalo";
import { SUPPORTED_COLLATERAL } from "@/lib/contracts";

type CollateralAsset = typeof SUPPORTED_COLLATERAL[number];

export function CollateralForm() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"supply" | "withdraw">("supply");
  const [selectedAsset, setSelectedAsset] = useState<CollateralAsset>(SUPPORTED_COLLATERAL[0]);
  const { refetch: refetchPosition } = useUserPosition();
  
  // Get balance and allowance for selected asset
  const { balance, refetch: refetchBalance } = useTokenBalance(selectedAsset.address as `0x${string}`, selectedAsset.decimals);
  const { allowanceRaw, refetch: refetchAllowance } = useTokenAllowance(selectedAsset.address as `0x${string}`, selectedAsset.decimals);
  
  // Hooks for operations
  const { approve, isPending: isApproving, isSuccess: approveSuccess, isError: approveError, error: appError, reset: resetApprove, hash: approveHash } = useApproveToken(selectedAsset.address as `0x${string}`);
  const { supplyCollateral, isPending: isSupplying, isSuccess: supplySuccess, isError: supplyError, error: suppError, reset: resetSupply, hash: supplyHash } = useSupplyCollateral();
  const { withdrawCollateral, isPending: isWithdrawing, isSuccess: withdrawSuccess, isError: withdrawError, error: withError, reset: resetWithdraw, hash: withdrawHash } = useWithdrawCollateral();

  const needsApproval = mode === "supply" && allowanceRaw === BigInt(0);
  const isLoading = isApproving || isSupplying || isWithdrawing;

  // Validation
  const validation = useMemo(() => {
    const amountNum = parseFloat(amount || "0");
    const balanceNum = parseFloat(balance);
    
    if (!amount || amount === "") {
      return { valid: false, error: null };
    }
    
    if (amountNum <= 0) {
      return { valid: false, error: "Amount must be greater than 0" };
    }
    
    if (mode === "supply" && amountNum > balanceNum) {
      return { valid: false, error: `Insufficient ${selectedAsset.symbol} balance` };
    }
    
    return { valid: true, error: null };
  }, [amount, balance, mode, selectedAsset.symbol]);

  // Handle success toasts
  useEffect(() => {
    if (approveSuccess && approveHash) {
      toast.success(`✨ ${selectedAsset.symbol} Approved!`, {
        description: `You can now supply ${selectedAsset.symbol} as collateral`,
        action: {
          label: "View TX",
          onClick: () => window.open(`https://basescan.org/tx/${approveHash}`, "_blank"),
        },
      });
      refetchAllowance();
      resetApprove();
    }
  }, [approveSuccess, approveHash, selectedAsset.symbol, refetchAllowance, resetApprove]);

  useEffect(() => {
    if (supplySuccess && supplyHash) {
      toast.success("✨ Collateral Supplied!", {
        description: `You supplied ${amount} ${selectedAsset.symbol}`,
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
  }, [supplySuccess, supplyHash, amount, selectedAsset.symbol, refetchBalance, refetchPosition, resetSupply]);

  useEffect(() => {
    if (withdrawSuccess && withdrawHash) {
      toast.success("💰 Collateral Withdrawn!", {
        description: `You withdrew ${amount} ${selectedAsset.symbol}`,
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
  }, [withdrawSuccess, withdrawHash, amount, selectedAsset.symbol, refetchBalance, refetchPosition, resetWithdraw]);

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
      supplyCollateral(selectedAsset.address as `0x${string}`, amount, selectedAsset.decimals);
    } else {
      withdrawCollateral(selectedAsset.address as `0x${string}`, amount, selectedAsset.decimals);
    }
  };

  const handleAssetChange = (asset: CollateralAsset) => {
    setSelectedAsset(asset);
    setAmount("");
  };

  return (
    <div className="bg-gradient-to-br from-treasure-midnight/80 to-treasure-navy/90 rounded-xl p-6 border border-treasure-magenta/30 glow-magic">
      <h3 className="text-lg font-bold mb-4 text-treasure-gold flex items-center gap-2">
        <span>🏦</span> Collateral Management
      </h3>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("supply")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition text-sm ${
            mode === "supply" 
              ? "bg-gradient-to-r from-treasure-magenta to-magic-600 text-white shadow-magic" 
              : "bg-treasure-navy/60 text-magic-400 hover:bg-treasure-navy/80 border border-magic-800/30"
          }`}
        >
          ➕ Deposit
        </button>
        <button
          onClick={() => setMode("withdraw")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition text-sm ${
            mode === "withdraw" 
              ? "bg-gradient-to-r from-treasure-magenta to-magic-600 text-white shadow-magic" 
              : "bg-treasure-navy/60 text-magic-400 hover:bg-treasure-navy/80 border border-magic-800/30"
          }`}
        >
          ➖ Withdraw
        </button>
      </div>

      {/* Asset Selection */}
      <div className="mb-4">
        <label className="block text-sm text-magic-400 mb-2">Select Asset</label>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_COLLATERAL.map((asset) => (
            <button
              key={asset.symbol}
              onClick={() => handleAssetChange(asset)}
              className={`p-3 rounded-lg border transition text-left ${
                selectedAsset.symbol === asset.symbol
                  ? "border-treasure-magenta/50 bg-treasure-magenta/10"
                  : "border-magic-800/30 bg-treasure-navy/40 hover:border-magic-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {asset.symbol === "WETH" ? "Ξ" : "$"}
                </span>
                <div>
                  <div className="font-medium text-magic-100 text-sm">{asset.symbol}</div>
                  <div className="text-xs text-magic-500">LTV: {asset.ltv}%</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-magic-400">Amount ({selectedAsset.symbol})</label>
            <span className="text-magic-500">
              Balance: {parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedAsset.symbol}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="any"
              min="0"
              className={`w-full bg-treasure-navy/80 border rounded-lg px-4 py-3 text-lg font-mono text-magic-100 placeholder-magic-600 focus:outline-none transition ${
                validation.error 
                  ? "border-treasure-ruby/50 focus:border-treasure-ruby" 
                  : "border-magic-800/50 focus:border-treasure-magenta/50 focus:shadow-magic"
              }`}
            />
            <button
              type="button"
              onClick={() => setAmount(balance)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-treasure-magenta text-sm hover:text-magic-400 font-medium"
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

        {/* Collateral Info */}
        <div className="p-3 bg-treasure-navy/60 rounded-lg border border-magic-800/20">
          <div className="flex justify-between text-xs text-magic-400 mb-1">
            <span>Loan-to-Value (LTV)</span>
            <span className="text-magic-200">{selectedAsset.ltv}%</span>
          </div>
          <div className="flex justify-between text-xs text-magic-400">
            <span>Liquidation Threshold</span>
            <span className="text-magic-200">{selectedAsset.liquidationThreshold}%</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !validation.valid}
          className="w-full bg-gradient-to-r from-treasure-magenta to-magic-600 hover:from-fuchsia-500 hover:to-violet-500 disabled:from-magic-800 disabled:to-magic-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition shadow-magic disabled:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isApproving ? "Approving..." : mode === "supply" ? "Depositing..." : "Withdrawing..."}
            </span>
          ) : needsApproval ? (
            `🔓 Approve ${selectedAsset.symbol}`
          ) : mode === "supply" ? (
            `➕ Deposit ${selectedAsset.symbol}`
          ) : (
            `➖ Withdraw ${selectedAsset.symbol}`
          )}
        </button>
      </form>
    </div>
  );
}
