"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { HALO_CONTRACT, HALO_ABI, USDC_BASE, ERC20_ABI } from "@/lib/contracts";

// Get user's position data
export function useUserPosition() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: HALO_CONTRACT,
    abi: HALO_ABI,
    functionName: "getUserAccountData",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  if (!data) return { isLoading, refetch, position: null };

  const [totalCollateral, totalDebt, availableBorrows, liquidationThreshold, ltv, healthFactor] = data;

  return {
    isLoading,
    refetch,
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
  
  const { data, isLoading, refetch } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    balance: data ? formatUnits(data, 6) : "0",
    isLoading,
    refetch,
  };
}

// Check USDC allowance
export function useUSDCAllowance() {
  const { address } = useAccount();
  
  const { data, refetch } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, HALO_CONTRACT] : undefined,
    query: { enabled: !!address },
  });

  return {
    allowance: data ? formatUnits(data, 6) : "0",
    refetch,
  };
}

// Approve USDC
export function useApproveUSDC() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount: string) => {
    const amountWei = parseUnits(amount, 6);
    writeContract({
      address: USDC_BASE,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [HALO_CONTRACT, amountWei],
    });
  };

  return { approve, isPending, isConfirming, isSuccess, hash };
}

// Supply USDC
export function useSupply() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

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

  return { supply, isPending, isConfirming, isSuccess, hash };
}

// Withdraw USDC
export function useWithdraw() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

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

  return { withdraw, isPending, isConfirming, isSuccess, hash };
}

// Borrow USDC
export function useBorrow() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

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

  return { borrow, isPending, isConfirming, isSuccess, hash };
}

// Repay USDC
export function useRepay() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

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

  return { repay, isPending, isConfirming, isSuccess, hash };
}
