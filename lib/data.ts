import { BACKEND_URL } from "@/constants";
import type { Campaign } from "./types";

// Mock data based on the provided example
const mockCampaigns: Campaign[] = [
  {
    _id: "6827b42cedeba0bcaa025323",
    title: "Based Fellowship 2.0",
    description: "Based Fellowship 2.0 - A program for developers building on Base",
    hash: "0x86cbce3c432b7e4d073d6f646dccd9bf1dfa0b6a",
    creatorAddress: "0xCE54cF5a0dE3843011cF20389C1b6a4AaC442d6A",
    tokenId: "22216",
    link: "https://www.clanker.world/clanker/0x2DD7f5527d1e234AB91EC9bBC6641eF169f95b07",
    isZora: false,
    budgetPercentage: "50",
    uniqueKeyword: "BkRnt1p",
    splitAddress: "0x39AcB1a082B059086e0D78372FC8B12DA118B9B8",
    campaignStartDate: "2025-05-16T00:00:00.000Z",
    campaignEndDate: "2025-05-20T00:00:00.000Z",
    isFinalized: true,
    keywords: ["base", "basedfellowship"],
    creatorsPostsFarcaster: [[]],
    creatorsPostsZora: [],
    createdAt: "2025-05-16T21:54:52.241Z",
    updatedAt: "2025-05-16T21:54:52.241Z",
  },
  {
    _id: "6827b42cedeba0bcaa025324",
    title: "Zora Creator Spotlight",
    description: "Highlighting creators building on Zora protocol",
    hash: "0x92cbce3c432b7e4d073d6f646dccd9bf1dfa0b6b",
    creatorAddress: "0xDE54cF5a0dE3843011cF20389C1b6a4AaC442d6B",
    tokenId: "22217",
    link: "https://zora.co/spotlight",
    isZora: true,
    budgetPercentage: "60",
    uniqueKeyword: "ZrSpt2q",
    splitAddress: "0x49AcB1a082B059086e0D78372FC8B12DA118B9B9",
    campaignStartDate: "2025-05-22T00:00:00.000Z",
    campaignEndDate: "2025-05-30T00:00:00.000Z",
    isFinalized: false,
    keywords: ["zora", "creators", "nft"],
    creatorsPostsFarcaster: [[]],
    creatorsPostsZora: [],
    createdAt: "2025-05-16T22:54:52.241Z",
    updatedAt: "2025-05-16T22:54:52.241Z",
  },
  {
    _id: "6827b42cedeba0bcaa025325",
    title: "Farcaster Integration Campaign",
    description: "Promoting apps that integrate with Farcaster protocol",
    hash: "0xa3cbce3c432b7e4d073d6f646dccd9bf1dfa0b6c",
    creatorAddress: "0xEE54cF5a0dE3843011cF20389C1b6a4AaC442d6C",
    tokenId: "22218",
    link: "https://farcaster.xyz/apps",
    isZora: false,
    budgetPercentage: "75",
    uniqueKeyword: "FcInt3r",
    splitAddress: "0x59AcB1a082B059086e0D78372FC8B12DA118B9B0",
    campaignStartDate: "2025-05-01T00:00:00.000Z",
    campaignEndDate: "2025-05-15T00:00:00.000Z",
    isFinalized: true,
    keywords: ["farcaster", "integration", "apps"],
    creatorsPostsFarcaster: [[]],
    creatorsPostsZora: [],
    createdAt: "2025-05-01T10:54:52.241Z",
    updatedAt: "2025-05-15T23:54:52.241Z",
  },
  {
    _id: "6827b42cedeba0bcaa025326",
    title: "Ethereum Summer Hackathon",
    description: "Summer hackathon for Ethereum developers with prizes and mentorship",
    hash: "0xb4cbce3c432b7e4d073d6f646dccd9bf1dfa0b6d",
    creatorAddress: "0xFF54cF5a0dE3843011cF20389C1b6a4AaC442d6D",
    tokenId: "22219",
    link: "https://eth-summer.dev",
    isZora: false,
    budgetPercentage: "80",
    uniqueKeyword: "EthSum4s",
    splitAddress: "0x69AcB1a082B059086e0D78372FC8B12DA118B9B1",
    campaignStartDate: "2025-05-18T00:00:00.000Z",
    campaignEndDate: "2025-06-18T00:00:00.000Z",
    isFinalized: false,
    keywords: ["ethereum", "hackathon", "developers"],
    creatorsPostsFarcaster: [[]],
    creatorsPostsZora: [],
    createdAt: "2025-05-10T15:54:52.241Z",
    updatedAt: "2025-05-10T15:54:52.241Z",
  },
  {
    _id: "6827b42cedeba0bcaa025327",
    title: "NFT Artists Collective",
    description: "Promoting a collective of NFT artists across multiple platforms",
    hash: "0xc5cbce3c432b7e4d073d6f646dccd9bf1dfa0b6e",
    creatorAddress: "0xAA54cF5a0dE3843011cF20389C1b6a4AaC442d6E",
    tokenId: "22220",
    link: "https://nft-collective.art",
    isZora: true,
    budgetPercentage: "65",
    uniqueKeyword: "NftCol5t",
    splitAddress: "0x79AcB1a082B059086e0D78372FC8B12DA118B9B2",
    campaignStartDate: "2025-04-15T00:00:00.000Z",
    campaignEndDate: "2025-05-15T00:00:00.000Z",
    isFinalized: true,
    keywords: ["nft", "artists", "collective"],
    creatorsPostsFarcaster: [[]],
    creatorsPostsZora: [],
    createdAt: "2025-04-10T09:54:52.241Z",
    updatedAt: "2025-05-16T10:54:52.241Z",
  },
];

// Function to simulate fetching campaigns from an API
export async function getCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`${BACKEND_URL}/bounty/all`);

  const data = await response.json();

  return data;
}

// Function to get a single campaign by ID
export async function getCampaignById(id: string): Promise<Campaign | undefined> {
  // Simulate API delay

  const response = await fetch(`${BACKEND_URL}/bounty/id/${id}`);

  const data = await response.json();

  return data;
}

export async function getCampaignsByAddress(address: string): Promise<Campaign[]> {
  console.log("address is", address);

  const response = await fetch(`${BACKEND_URL}/bounty/address/${address}`);

  const data = await response.json();

  return data;
}
