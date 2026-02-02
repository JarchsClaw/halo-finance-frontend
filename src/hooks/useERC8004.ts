"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ERC8004_REGISTRY, ERC8004_ABI } from "@/lib/contracts";

// Check if the registry is available (not zero address)
const isRegistryAvailable = ERC8004_REGISTRY !== "0x0000000000000000000000000000000000000000";

// Check if address is registered as ERC-8004 agent
export function useIsRegistered() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch, isError, error } = useReadContract({
    address: ERC8004_REGISTRY,
    abi: ERC8004_ABI,
    functionName: "isRegistered",
    args: address ? [address] : undefined,
    query: { enabled: !!address && isRegistryAvailable },
  });

  return {
    isRegistered: isRegistryAvailable ? !!data : false,
    isLoading: isRegistryAvailable ? isLoading : false,
    refetch,
    isError,
    error,
    registryAvailable: isRegistryAvailable,
  };
}

// Get agent handle
export function useAgentHandle() {
  const { address } = useAccount();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: ERC8004_REGISTRY,
    abi: ERC8004_ABI,
    functionName: "getHandle",
    args: address ? [address] : undefined,
    query: { enabled: !!address && isRegistryAvailable },
  });

  return {
    handle: data as string | undefined,
    isLoading,
    isError,
    error,
    registryAvailable: isRegistryAvailable,
  };
}

// Register as ERC-8004 agent
export function useRegisterAgent() {
  const { writeContract, data: hash, isPending, error, isError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const register = (handle: string, registrationURI: string) => {
    if (!isRegistryAvailable) {
      console.warn("ERC-8004 registry not available on this network");
      return;
    }
    writeContract({
      address: ERC8004_REGISTRY,
      abi: ERC8004_ABI,
      functionName: "register",
      args: [handle, registrationURI],
    });
  };

  return { 
    register, 
    isPending, 
    isConfirming, 
    isSuccess, 
    hash,
    error: error || receiptError,
    isError: isError || isReceiptError,
    reset,
    registryAvailable: isRegistryAvailable,
  };
}
