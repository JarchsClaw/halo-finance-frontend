import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

// WalletConnect Cloud Project ID
// Using a demo project ID - for production, get your own at https://cloud.reown.com/
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "3a8170812b534d0ff9d794f19a901d64";

export const config = getDefaultConfig({
  appName: "Halo Finance",
  projectId,
  chains: [base],
  ssr: true,
});
