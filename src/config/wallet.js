// src/config/wallet.js
import { createConfig, http } from "wagmi";
import { bsc } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors: [
    injected({
      target: "metaMask",
    })
  ],
  transports: {
    [bsc.id]: http(),
  },

  // ❌ make sure autoConnect is disabled
  autoConnect: false,
});
