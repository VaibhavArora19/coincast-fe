import { getCampaignById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Tag, ArrowLeft, Clock, BarChart3, Users, Share2, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CampaignDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const campaign = await getCampaignById(params.id);

  if (!campaign) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="rounded-full bg-muted h-12 w-12 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-muted-foreground mb-8">The campaign you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Determine campaign status
  const getCampaignStatus = () => {
    const now = new Date();
    const startDate = new Date(campaign.campaignStartDate);
    const endDate = new Date(campaign.campaignEndDate);

    if (campaign.isFinalized) return "completed";
    if (now < startDate) return "upcoming";
    if (now >= startDate && now <= endDate) return "active";
    return "completed";
  };

  const status = getCampaignStatus();

  // Status badge color
  const getBadgeVariant = () => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
      case "completed":
        return "";
    }
  };

  // Calculate days info
  const getDaysInfo = () => {
    const now = new Date();
    const startDate = new Date(campaign.campaignStartDate);
    const endDate = new Date(campaign.campaignEndDate);

    if (status === "upcoming") {
      const daysToStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Starts in ${daysToStart} day${daysToStart !== 1 ? "s" : ""}`;
    } else if (status === "active") {
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`;
    } else {
      const daysPassed = Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Ended ${daysPassed} day${daysPassed !== 1 ? "s" : ""} ago`;
    }
  };

  // Calculate progress percentage for active campaigns
  const getProgressPercentage = () => {
    if (status !== "active") return 0;

    const now = new Date();
    const startDate = new Date(campaign.campaignStartDate);
    const endDate = new Date(campaign.campaignEndDate);

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    return Math.min(Math.max(Math.floor((elapsed / totalDuration) * 100), 0), 100);
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <Badge variant="outline" className={`capitalize w-fit ${getBadgeVariant()}`}>
                {status}
              </Badge>
            </div>

            <div className="prose max-w-none mb-6">
              <p>{campaign.description}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div>
                      Start: <span className="font-medium">{formatDate(campaign.campaignStartDate)}</span>
                    </div>
                    <div>
                      End: <span className="font-medium">{formatDate(campaign.campaignEndDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getDaysInfo()}</span>
                </div>
              </div>

              {status === "active" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Campaign Progress</span>
                    <span className="font-medium">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>
              )}
            </div>

            {campaign.keywords && campaign.keywords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {campaign.link && (
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <a href={"https://warpcast.com/~/conversations/" + campaign.hash} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Visit Warpcast Link
                  </a>
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                  <CardDescription>Technical information about this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Budget Percentage</dt>
                      <dd className="mt-1 text-lg">{campaign.budgetPercentage}%</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Unique Keyword</dt>
                      <dd className="mt-1 font-mono bg-muted px-2 py-1 rounded text-sm inline-block">{campaign.uniqueKeyword}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Token ID</dt>
                      <dd className="mt-1">{campaign.tokenId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Zora</dt>
                      <dd className="mt-1">{campaign.isZora ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Finalized</dt>
                      <dd className="mt-1">{campaign.isFinalized ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                      <dd className="mt-1">{formatDate(campaign.createdAt)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Information</CardTitle>
                  <CardDescription>Blockchain and contract details</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Creator Address</dt>
                      <dd className="mt-1 font-mono text-xs break-all bg-muted p-2 rounded">{campaign.creatorAddress}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Split Address</dt>
                      <dd className="mt-1 font-mono text-xs break-all bg-muted p-2 rounded">{campaign.splitAddress}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Warpcast Hash</dt>
                      <dd className="mt-1 font-mono text-xs break-all bg-muted p-2 rounded">{campaign.hash}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <Badge variant="outline" className={`capitalize ${getBadgeVariant()}`}>
                      {status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Timeline</dt>
                  <dd className="mt-1 text-sm">
                    {formatDate(campaign.campaignStartDate)} - {formatDate(campaign.campaignEndDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Budget</dt>
                  <dd className="mt-1 text-lg font-semibold">{campaign.budgetPercentage}%</dd>
                </div>
                {campaign.keywords && campaign.keywords.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Keywords</dt>
                    <dd className="mt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {campaign.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {campaign.link && (
                <Button className="w-full justify-start" asChild>
                  <a href={"https://warpcast.com/~/conversations/" + campaign.hash} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Campaign
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Share Campaign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
