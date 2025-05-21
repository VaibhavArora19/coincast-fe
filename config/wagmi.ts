import { http, createConfig } from "wagmi";
import { base, baseSepolia, mainnet, sepolia, zora } from "wagmi/chains";

export const config = createConfig({
  chains: [base, baseSepolia, zora],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [zora.id]: http(),
  },
});
