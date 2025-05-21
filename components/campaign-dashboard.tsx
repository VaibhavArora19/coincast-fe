"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignCard } from "@/components/campaign-card"
import { getCampaigns } from "@/lib/data"
import type { Campaign } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<{
    active: Campaign[]
    upcoming: Campaign[]
    completed: Campaign[]
  }>({
    active: [],
    upcoming: [],
    completed: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const allCampaigns = await getCampaigns()

        const now = new Date()

        // Categorize campaigns
        const active = allCampaigns.filter(
          (campaign) => new Date(campaign.campaignStartDate) <= now && new Date(campaign.campaignEndDate) >= now,
        )

        const upcoming = allCampaigns.filter((campaign) => new Date(campaign.campaignStartDate) > now)

        const completed = allCampaigns.filter(
          (campaign) => new Date(campaign.campaignEndDate) < now || campaign.isFinalized,
        )

        setCampaigns({ active, upcoming, completed })
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  // Filter campaigns based on search query
  const filterCampaigns = (campaignList: Campaign[]) => {
    if (!searchQuery) return campaignList

    const query = searchQuery.toLowerCase()
    return campaignList.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.keywords.some((keyword) => keyword.toLowerCase().includes(query)),
    )
  }

  // Sort campaigns based on selected option
  const sortCampaigns = (campaignList: Campaign[]) => {
    const sortedList = [...campaignList]

    switch (sortBy) {
      case "date-desc":
        return sortedList.sort(
          (a, b) => new Date(b.campaignStartDate).getTime() - new Date(a.campaignStartDate).getTime(),
        )
      case "date-asc":
        return sortedList.sort(
          (a, b) => new Date(a.campaignStartDate).getTime() - new Date(b.campaignStartDate).getTime(),
        )
      case "budget-desc":
        return sortedList.sort((a, b) => Number.parseInt(b.budgetPercentage) - Number.parseInt(a.budgetPercentage))
      case "budget-asc":
        return sortedList.sort((a, b) => Number.parseInt(a.budgetPercentage) - Number.parseInt(b.budgetPercentage))
      case "title-asc":
        return sortedList.sort((a, b) => a.title.localeCompare(b.title))
      case "title-desc":
        return sortedList.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return sortedList
    }
  }

  const filteredActive = sortCampaigns(filterCampaigns(campaigns.active))
  const filteredUpcoming = sortCampaigns(filterCampaigns(campaigns.upcoming))
  const filteredCompleted = sortCampaigns(filterCampaigns(campaigns.completed))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="budget-desc">Budget: High to Low</SelectItem>
              <SelectItem value="budget-asc">Budget: Low to High</SelectItem>
              <SelectItem value="title-asc">Title: A to Z</SelectItem>
              <SelectItem value="title-desc">Title: Z to A</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-card p-0 h-auto">
            <TabsTrigger
              value="active"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Active ({campaigns.active.length})
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Upcoming ({campaigns.upcoming.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Completed ({campaigns.completed.length})
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="active" className="mt-0">
              {isLoading ? (
                <CampaignSkeleton />
              ) : filteredActive.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActive.map((campaign) => (
                    <CampaignCard key={campaign._id} campaign={campaign} status="active" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No active campaigns"
                  description={
                    searchQuery
                      ? "No active campaigns match your search."
                      : "You don't have any active campaigns at the moment."
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              {isLoading ? (
                <CampaignSkeleton />
              ) : filteredUpcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUpcoming.map((campaign) => (
                    <CampaignCard key={campaign._id} campaign={campaign} status="upcoming" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No upcoming campaigns"
                  description={
                    searchQuery
                      ? "No upcoming campaigns match your search."
                      : "You don't have any upcoming campaigns scheduled."
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {isLoading ? (
                <CampaignSkeleton />
              ) : filteredCompleted.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompleted.map((campaign) => (
                    <CampaignCard key={campaign._id} campaign={campaign} status="completed" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No completed campaigns"
                  description={
                    searchQuery
                      ? "No completed campaigns match your search."
                      : "You don't have any completed campaigns yet."
                  }
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function CampaignSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="pt-2">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{description}</p>
      <Button>Create Campaign</Button>
    </div>
  )
}
