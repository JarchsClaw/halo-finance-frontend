import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

// WalletConnect Cloud Project ID
// Get your own at https://cloud.walletconnect.com/
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

// Validate at runtime (not build time)
if (typeof window !== 'undefined' && !projectId) {
  console.error(
    "⚠️ Missing NEXT_PUBLIC_WALLETCONNECT_ID environment variable.\n" +
    "Get your project ID at https://cloud.walletconnect.com/ and add it to your .env.local file.\n" +
    "Wallet connections may not work properly."
  );
}

export const config = getDefaultConfig({
  appName: "Halo Finance",
  projectId: projectId || "demo", // Fallback only for build, will warn at runtime
  chains: [base],
  ssr: true,
});
