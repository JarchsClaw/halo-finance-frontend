"use client";

import { useState, useEffect } from "react";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { Toaster } from "sonner";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: "#7c3aed",
          accentColorForeground: "white",
          borderRadius: "medium",
        })}>
          {children}
          <Toaster 
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "linear-gradient(135deg, #0f0a1e 0%, #1a1040 100%)",
                border: "1px solid rgba(196, 167, 109, 0.3)",
                color: "#e5e0f0",
              },
              classNames: {
                success: "!border-treasure-gold/50",
                error: "!border-treasure-ruby/50",
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
