"use client";

import React from "react"; // Import React
import { WagmiConfig, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { sdk } from "@farcaster/miniapp-sdk";
const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) },
  connectors: [
    farcasterFrame(),
    metaMask({
      dappMetadata: {
        name: "Policast",
        url: typeof window !== "undefined" ? window.location.origin : "",
      },
    }),
  ],
});

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  );
}
