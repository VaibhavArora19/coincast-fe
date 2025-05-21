"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaign-card";
import { getCampaignsByAddress } from "@/lib/data";
import type { Campaign } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";

export default function MyCampaignsPage() {
  const searchParams = useSearchParams();
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const showSuccess = searchParams.get("success") === "true";

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showSuccessAlert, setShowSuccessAlert] = useState(showSuccess);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!address) {
        return;
      }

      try {
        const allCampaigns = await getCampaignsByAddress(ethers.getAddress(address));
        // In a real app, you would filter campaigns by the current user
        setCampaigns(allCampaigns);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();

    // Hide success alert after 5 seconds
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, address]);

  // Filter campaigns based on search query
  const filterCampaigns = () => {
    if (!searchQuery) return campaigns;

    const query = searchQuery.toLowerCase();
    return campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  };

  // Sort campaigns based on selected option
  const sortCampaigns = (campaignList: Campaign[]) => {
    const sortedList = [...campaignList];

    switch (sortBy) {
      case "date-desc":
        return sortedList.sort((a, b) => new Date(b.campaignStartDate).getTime() - new Date(a.campaignStartDate).getTime());
      case "date-asc":
        return sortedList.sort((a, b) => new Date(a.campaignStartDate).getTime() - new Date(b.campaignStartDate).getTime());
      case "budget-desc":
        return sortedList.sort((a, b) => Number.parseInt(b.budgetPercentage) - Number.parseInt(a.budgetPercentage));
      case "budget-asc":
        return sortedList.sort((a, b) => Number.parseInt(a.budgetPercentage) - Number.parseInt(b.budgetPercentage));
      case "title-asc":
        return sortedList.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sortedList.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sortedList;
    }
  };

  const filteredAndSortedCampaigns = sortCampaigns(filterCampaigns());

  // Determine campaign status
  const getCampaignStatus = (campaign: Campaign) => {
    const now = new Date();
    const startDate = new Date(campaign.campaignStartDate);
    const endDate = new Date(campaign.campaignEndDate);

    if (campaign.isFinalized) return "completed";
    if (now < startDate) return "upcoming";
    if (now >= startDate && now <= endDate) return "active";
    return "completed";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {showSuccessAlert && (
        <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your campaign has been created successfully.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Campaigns</h1>
          <p className="text-muted-foreground mt-2">Manage and track all your campaigns</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/create" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
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

      {isLoading ? (
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
      ) : filteredAndSortedCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} status={getCampaignStatus(campaign) as "active" | "upcoming" | "completed"} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No campaigns found</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
            {searchQuery
              ? "No campaigns match your search criteria."
              : "You haven't created any campaigns yet. Create your first campaign to get started."}
          </p>
          <Button asChild>
            <Link href="/campaigns/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
