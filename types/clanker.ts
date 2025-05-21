import { Address } from "viem";

export type ClankerTokenDetails = {
  tokenId: string; // Token ID
  address: Address; // Token contract address
  lpLockerAddress: Address; // LP Locker contract address
  name?: string;
  symbol?: string;
};
