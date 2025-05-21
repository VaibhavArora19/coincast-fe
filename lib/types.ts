export interface Campaign {
  _id: string
  title: string
  description: string
  hash: string
  creatorAddress: string
  tokenId: string
  link: string
  isZora: boolean
  budgetPercentage: string
  uniqueKeyword: string
  splitAddress: string
  campaignStartDate: string
  campaignEndDate: string
  isFinalized: boolean
  keywords: string[]
  creatorsPostsFarcaster: any[]
  creatorsPostsZora: any[]
  createdAt: string
  updatedAt: string
}
