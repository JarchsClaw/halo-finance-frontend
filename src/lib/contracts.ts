// Halo Finance Contract on Base
export const HALO_CONTRACT = "0x9b98511c7fb7d9a0541dfBc0b3d8Ef4CC25341ad" as const;

// Common token addresses on Base mainnet
export const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
export const WETH_BASE = "0x4200000000000000000000000000000000000006" as const;
export const DAI_BASE = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb" as const;

// ERC-8004 Identity Registry
// NOTE: As of Feb 2026, there is no official ERC-8004 registry deployed on Base mainnet.
// This is a placeholder address. For production, deploy your own ERC-8004 registry
// or update this once an official registry is available.
// See: https://eips.ethereum.org/EIPS/eip-8004 (Agent Identity Standard - Draft)
export const ERC8004_REGISTRY = "0x0000000000000000000000000000000000000000" as const;

// Supported collateral assets
export const SUPPORTED_COLLATERAL = [
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: WETH_BASE,
    decimals: 18,
    ltv: 80, // 80% LTV
    liquidationThreshold: 85,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: USDC_BASE,
    decimals: 6,
    ltv: 85,
    liquidationThreshold: 90,
  },
] as const;

// Halo Finance ABI - Core lending functions
export const HALO_ABI = [
  // Supply USDC
  {
    name: "supply",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Withdraw
  {
    name: "withdraw",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  // Borrow (requires ERC-8004 for agents)
  {
    name: "borrow",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "interestRateMode", type: "uint256" },
      { name: "referralCode", type: "uint16" },
      { name: "onBehalfOf", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Repay
  {
    name: "repay",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "interestRateMode", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  // Get user account data
  {
    name: "getUserAccountData",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "totalCollateralBase", type: "uint256" },
      { name: "totalDebtBase", type: "uint256" },
      { name: "availableBorrowsBase", type: "uint256" },
      { name: "currentLiquidationThreshold", type: "uint256" },
      { name: "ltv", type: "uint256" },
      { name: "healthFactor", type: "uint256" },
    ],
    stateMutability: "view",
  },
  // Set user use reserve as collateral
  {
    name: "setUserUseReserveAsCollateral",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "useAsCollateral", type: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Get reserve data (for APY/rates)
  {
    name: "getReserveData",
    type: "function",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [
      { name: "configuration", type: "uint256" },
      { name: "liquidityIndex", type: "uint128" },
      { name: "currentLiquidityRate", type: "uint128" },
      { name: "variableBorrowIndex", type: "uint128" },
      { name: "currentVariableBorrowRate", type: "uint128" },
      { name: "currentStableBorrowRate", type: "uint128" },
      { name: "lastUpdateTimestamp", type: "uint40" },
      { name: "id", type: "uint16" },
      { name: "aTokenAddress", type: "address" },
      { name: "stableDebtTokenAddress", type: "address" },
      { name: "variableDebtTokenAddress", type: "address" },
      { name: "interestRateStrategyAddress", type: "address" },
      { name: "accruedToTreasury", type: "uint128" },
      { name: "unbacked", type: "uint128" },
      { name: "isolationModeTotalDebt", type: "uint128" },
    ],
    stateMutability: "view",
  },
] as const;

// ERC-20 ABI for token approvals
export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    name: "allowance",
    type: "function",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    name: "symbol",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;

// ERC-8004 Identity Registry ABI
export const ERC8004_ABI = [
  {
    name: "register",
    type: "function",
    inputs: [
      { name: "handle", type: "string" },
      { name: "registrationURI", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    name: "isRegistered",
    type: "function",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    name: "getHandle",
    type: "function",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;
