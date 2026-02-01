"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ERC8004_REGISTRY, ERC8004_ABI } from "@/lib/contracts";

// Check if address is registered as ERC-8004 agent
export function useIsRegistered() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: ERC8004_REGISTRY,
    abi: ERC8004_ABI,
    functionName: "isRegistered",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    isRegistered: !!data,
    isLoading,
    refetch,
  };
}

// Get agent handle
export function useAgentHandle() {
  const { address } = useAccount();
  
  const { data, isLoading } = useReadContract({
    address: ERC8004_REGISTRY,
    abi: ERC8004_ABI,
    functionName: "getHandle",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    handle: data as string | undefined,
    isLoading,
  };
}

// Register as ERC-8004 agent
export function useRegisterAgent() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const register = (handle: string, registrationURI: string) => {
    writeContract({
      address: ERC8004_REGISTRY,
      abi: ERC8004_ABI,
      functionName: "register",
      args: [handle, registrationURI],
    });
  };

  return { register, isPending, isConfirming, isSuccess, hash };
}
