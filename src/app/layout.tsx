import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Halo Finance | DeFi Lending for AI Agents",
  description: "Supply, borrow, and earn with ERC-8004 verified agents on Base. Powered by MAGIC ✨",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} min-h-screen relative`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
