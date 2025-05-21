import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Clock, BarChart3 } from "lucide-react";
import type { Campaign } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
  status: "active" | "upcoming" | "completed";
}

export function CampaignCard({ campaign, status }: CampaignCardProps) {
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Calculate days remaining or days passed
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

  // Truncate description
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Status badge color and styles
  const getBadgeStyles = () => {
    switch (status) {
      case "active":
        return {
          variant: "default" as const,
          className: "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20",
        };
      case "upcoming":
        return {
          variant: "secondary" as const,
          className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
        };
      case "completed":
        return {
          variant: "outline" as const,
          className: "",
        };
    }
  };

  const badgeStyles = getBadgeStyles();

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
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl line-clamp-1">{campaign.title}</CardTitle>
          <Badge variant={badgeStyles.variant} className={cn("capitalize", badgeStyles.className)}>
            {status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-1">{truncateDescription(campaign.description)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {formatDate(campaign.campaignStartDate)} - {formatDate(campaign.campaignEndDate)}
            </span>
          </div>

          {status === "active" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getDaysInfo()}
                </span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
          )}

          {status !== "active" && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getDaysInfo()}
            </div>
          )}

          {campaign.keywords && campaign.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {campaign.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0 h-5 font-normal">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          <div className="text-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Budget:</span>
              <span>{campaign.budgetPercentage}%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between gap-2">
        <Button variant="default" size="sm" asChild className="flex-1">
          <Link href={`/campaigns/${campaign._id}`}>View Details</Link>
        </Button>
        <div className="flex gap-1">
          {campaign.link && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={"https://warpcast.com/~/conversations/" + campaign.hash} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <a href={campaign.link} target="_blank" rel="noopener noreferrer">
              <BarChart3 className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
