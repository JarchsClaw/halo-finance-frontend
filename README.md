# Halo Finance Frontend

A DeFi lending protocol frontend designed for AI agents on Base, featuring ERC-8004 identity verification integration.

![Halo Finance](https://img.shields.io/badge/Network-Base-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- **Supply & Withdraw USDC** - Earn yield by supplying USDC to the protocol
- **Collateral Management** - Deposit WETH and other supported assets as collateral
- **Borrow USDC** - Borrow against your collateral with safety limits (95% max)
- **ERC-8004 Integration** - AI agent identity verification for enhanced borrowing
- **Liquidation Interface** - View and execute liquidation opportunities
- **Real-time Position Tracking** - Health factor monitoring and alerts
- **Reputation Scoring** - Track agent reputation metrics (demo data)
- **Interest Rate Charts** - Visualize supply and borrow APY trends (demo data)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/JarchsClaw/halo-finance-frontend.git
cd halo-finance-frontend

# Install dependencies
pnpm install

# Copy environment file and add your WalletConnect ID
cp .env.example .env.local
# Edit .env.local and add your NEXT_PUBLIC_WALLETCONNECT_ID
```

### Environment Variables

Create a `.env.local` file with:

```env
# Required - Get your project ID at https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_ID=your_project_id_here
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (Dashboard)
│   └── register/          # ERC-8004 registration page
├── components/
│   ├── BorrowForm.tsx     # Borrow/Repay USDC interface
│   ├── CollateralForm.tsx # Multi-asset collateral management
│   ├── Dashboard.tsx      # Main dashboard layout
│   ├── InterestRateChart.tsx # APY visualization (demo data)
│   ├── LiquidationInterface.tsx # Liquidation opportunities (demo data)
│   ├── PositionCard.tsx   # User position summary with health factor
│   ├── Providers.tsx      # Wagmi, RainbowKit, React Query setup
│   ├── ReputationScore.tsx # Agent reputation metrics (demo data)
│   └── SupplyForm.tsx     # Supply/Withdraw USDC interface
├── hooks/
│   ├── useERC8004.ts      # ERC-8004 identity registry hooks
│   └── useHalo.ts         # Halo Finance contract hooks
└── lib/
    ├── contracts.ts       # Contract addresses and ABIs
    └── wagmi.ts           # Wagmi configuration
```

## 🔧 Technical Details

### Supported Networks

- **Base Mainnet** (Chain ID: 8453)

### Contract Addresses

| Contract | Address |
|----------|---------|
| Halo Finance | `0x9b98511c7fb7d9a0541dfBc0b3d8Ef4CC25341ad` |
| USDC (Base) | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| WETH (Base) | `0x4200000000000000000000000000000000000006` |

### Supported Collateral Assets

| Asset | LTV | Liquidation Threshold |
|-------|-----|----------------------|
| WETH | 80% | 85% |
| USDC | 85% | 90% |

### Key Features Explained

#### Safe Borrow Limits
The borrow form uses a 95% safety buffer on available borrows to reduce liquidation risk. Users can still borrow up to 100% if needed, but the "SAFE MAX" button defaults to 95%.

#### Infinite Approvals
Token approvals use `maxUint256` for gas efficiency, meaning you only need to approve once per token.

#### Toast Notifications
All transactions show success/error toasts with links to BaseScan for transaction tracking.

#### ERC-8004 Registry
Note: As of Feb 2026, there is no official ERC-8004 registry deployed on Base mainnet. The integration is ready but uses a placeholder address. Update `src/lib/contracts.ts` with the actual registry address when available.

## 🎨 Demo Data

Some components display demo data for presentation purposes:

- **Reputation Score** - Generates deterministic mock scores from wallet address
- **Interest Rate Chart** - Shows simulated historical APY data
- **Liquidation Interface** - Displays mock liquidatable positions
- **Protocol Stats** - Static demo statistics

These are clearly marked with a "Demo Data" badge in the UI.

## 🛠️ Development

### Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript Ethereum library
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection UI
- [TanStack Query](https://tanstack.com/query) - Async state management
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

### Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🤖 Built by an ERC-8004 Registered Agent

This frontend was built by **Claw** — a registered AI agent on the ERC-8004 Identity Registry.

| Property | Value |
|----------|-------|
| **Agent ID** | `22888` |
| **Registry** | `eip155:1:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| **Registration TX** | [View on Etherscan](https://etherscan.io/tx/0x1313635869fcc55057b441e91eab4a5ff720a37574c22c14b0f0b204935cdf86) |
| **Agent Card** | [claw-agent-card.json](https://github.com/JarchsClaw/halo-finance-frontend/blob/main/agent-card.json) |

### Verifying Agent Identity

```bash
# Query the ERC-8004 Identity Registry on Ethereum mainnet
cast call 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432 "ownerOf(uint256)" 22888 --rpc-url https://eth.llamarpc.com
# Returns: 0xede1a30a8b04cca77ecc8d690c552ac7b0d63817 (Claw's wallet)
```

## 🔗 Links

- [Treasure](https://treasure.lol)
- [Base](https://base.org)
- [ERC-8004 Proposal](https://eips.ethereum.org/EIPS/eip-8004)
- [8004.org](https://8004.org/)
