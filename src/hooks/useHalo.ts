"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits, maxUint256 } from "viem";
import { HALO_CONTRACT, HALO_ABI, USDC_BASE, ERC20_ABI } from "@/lib/contracts";

// Get user's position data
export function useUserPosition() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch, isError, error } = useReadContract({
    address: HALO_CONTRACT,
    abi: HALO_ABI,
    functionName: "getUserAccountData",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  if (!data) return { isLoading, refetch, position: null, isError, error };

  const [totalCollateral, totalDebt, availableBorrows, liquidationThreshold, ltv, healthFactor] = data;

  return {
    isLoading,
    refetch,
    isError,
    error,
    position: {
      totalCollateral: formatUnits(totalCollateral, 8), // Base currency decimals
      totalDebt: formatUnits(totalDebt, 8),
      availableBorrows: formatUnits(availableBorrows, 8),
      liquidationThreshold: Number(liquidationThreshold) / 100,
      ltv: Number(ltv) / 100,
      healthFactor: formatUnits(healthFactor, 18),
    },
  };
}

// Get USDC balance
export function useUSDCBalance() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch, isError, error } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    balance: data ? formatUnits(data, 6) : "0",
    balanceRaw: data ?? BigInt(0),
    isLoading,
    refetch,
    isError,
    error,
  };
}

// Get token balance (generic)
export function useTokenBalance(tokenAddress: `0x${string}`, decimals: number = 18) {
  const { address } = useAccount();
  
  const { data, isLoading, refetch, isError, error } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    balance: data ? formatUnits(data, decimals) : "0",
    balanceRaw: data ?? BigInt(0),
    isLoading,
    refetch,
    isError,
    error,
  };
}

// Check USDC allowance
export function useUSDCAllowance() {
  const { address } = useAccount();
  
  const { data, refetch, isError, error } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, HALO_CONTRACT] : undefined,
    query: { enabled: !!address },
  });

  return {
    allowance: data ? formatUnits(data, 6) : "0",
    allowanceRaw: data ?? BigInt(0),
    refetch,
    isError,
    error,
  };
}

// Check token allowance (generic)
export function useTokenAllowance(tokenAddress: `0x${string}`, decimals: number = 18) {
  const { address } = useAccount();
  
  const { data, refetch, isError, error } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, HALO_CONTRACT] : undefined,
    query: { enabled: !!address },
  });

  return {
    allowance: data ? formatUnits(data, decimals) : "0",
    allowanceRaw: data ?? BigInt(0),
    refetch,
    isError,
    error,
  };
}

// Approve USDC - using maxUint256 for efficient approvals
export function useApproveUSDC() {
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const approve = () => {
    writeContract({
      address: USDC_BASE,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [HALO_CONTRACT, maxUint256],
    });
  };

  return { 
    approve, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Approve any token - using maxUint256 for efficient approvals
export function useApproveToken(tokenAddress: `0x${string}`) {
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const approve = () => {
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [HALO_CONTRACT, maxUint256],
    });
  };

  return { 
    approve, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Supply USDC
export function useSupply() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const supply = (amount: string) => {
    if (!address) return;
    const amountWei = parseUnits(amount, 6);
    writeContract({
      address: HALO_CONTRACT,
      abi: HALO_ABI,
      functionName: "supply",
      args: [USDC_BASE, amountWei, address, 0],
    });
  };

  return { 
    supply, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Supply collateral (any supported asset)
export function useSupplyCollateral() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const supplyCollateral = (assetAddress: `0x${string}`, amount: string, decimals: number) => {
    if (!address) return;
    const amountWei = parseUnits(amount, decimals);
    writeContract({
      address: HALO_CONTRACT,
      abi: HALO_ABI,
      functionName: "supply",
      args: [assetAddress, amountWei, address, 0],
    });
  };

  return { 
    supplyCollateral, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Withdraw USDC
export function useWithdraw() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const withdraw = (amount: string) => {
    if (!address) return;
    const amountWei = parseUnits(amount, 6);
    writeContract({
      address: HALO_CONTRACT,
      abi: HALO_ABI,
      functionName: "withdraw",
      args: [USDC_BASE, amountWei, address],
    });
  };

  return { 
    withdraw, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Withdraw collateral (any supported asset)
export function useWithdrawCollateral() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const withdrawCollateral = (assetAddress: `0x${string}`, amount: string, decimals: number) => {
    if (!address) return;
    const amountWei = parseUnits(amount, decimals);
    writeContract({
      address: HALO_CONTRACT,
      abi: HALO_ABI,
      functionName: "withdraw",
      args: [assetAddress, amountWei, address],
    });
  };

  return { 
    withdrawCollateral, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Borrow USDC
export function useBorrow() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const borrow = (amount: string, interestRateMode: number = 2) => {
    if (!address) return;
    const amountWei = parseUnits(amount, 6);
    writeContract({
      address: HALO_CONTRACT,
      abi: HALO_ABI,
      functionName: "borrow",
      args: [USDC_BASE, amountWei, BigInt(interestRateMode), 0, address],
    });
  };

  return { 
    borrow, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Repay USDC
export function useRepay() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const repay = (amount: string, interestRateMode: number = 2) => {
    if (!address) return;
    const amountWei = parseUnits(amount, 6);
    writeContract({
      address: HALO_CONTRACT,
      abi: HALO_ABI,
      functionName: "repay",
      args: [USDC_BASE, amountWei, BigInt(interestRateMode), address],
    });
  };

  return { 
    repay, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}

// Set asset as collateral
export function useSetCollateral() {
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const setCollateral = (assetAddress: `0x${string}`, useAsCollateral: boolean) => {
    writeContract({
      address: HALO_CONTRACT,
      abi: HALO_ABI,
      functionName: "setUserUseReserveAsCollateral",
      args: [assetAddress, useAsCollateral],
    });
  };

  return { 
    setCollateral, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash, 
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
  };
}
