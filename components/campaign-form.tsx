"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useSplit } from "@/hooks/useSplit";
import { Address } from "viem";
import { useUpdatePayoutRecipient } from "@/hooks/useUpdatePayoutRecipient";
import { useUpdateClankerPayoutRecipient } from "@/hooks/useUpdateClankerPayoutRecipient";
import { useClankerVerification } from "@/hooks/useClankerVerification";
import { useAppKitAccount } from "@reown/appkit/react";
import { BACKEND_URL } from "@/constants";
import { useTokenVerification } from "@/hooks/useTokenVerification";
import { ClankerTokenDetails } from "@/types/clanker";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";

interface CampaignFormProps {
  campaignType: "clanker" | "zora";
  campaignLink: string;
  clankerTokenDetails: ClankerTokenDetails | null;
}

export function extractTokenAddress(link: string): string | null {
  console.log("Extracting token address from:", link);

  // Check if it's a direct address
  if (link.startsWith("0x")) {
    console.log("Direct address detected:", link);
    return link;
  }

  // Try to extract from Clanker link
  const clankerPatterns = [
    /clanker\.world\/clanker\/(0x[a-fA-F0-9]{40})/,
    /clanker\.world\/clanker\/([a-fA-F0-9]{40})/,
    /clanker\/(0x[a-fA-F0-9]{40})/,
    /clanker\/([a-fA-F0-9]{40})/,
  ];

  for (const pattern of clankerPatterns) {
    const match = link.match(pattern);
    if (match) {
      const address = match[1];
      console.log("Clanker address extracted:", address);
      return address.startsWith("0x") ? address : `0x${address}`;
    }
  }

  // Try to extract from Zora link
  const zoraPatterns = [
    /zora\.co\/coin\/base:(0x[a-fA-F0-9]{40})/,
    /zora\.co\/coin\/(0x[a-fA-F0-9]{40})/,
    /zora\/(0x[a-fA-F0-9]{40})/,
    /zora\/([a-fA-F0-9]{40})/,
  ];

  for (const pattern of zoraPatterns) {
    const match = link.match(pattern);
    if (match) {
      const address = match[1];
      console.log("Zora address extracted:", address);
      return address.startsWith("0x") ? address : `0x${address}`;
    }
  }

  console.log("No valid address found in input");
  return null;
}

export function CampaignForm({ campaignType, campaignLink, clankerTokenDetails }: CampaignFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    budgetPercentage: 50,
    keywords: [] as string[],
    currentKeyword: "",
  });
  const { verifyToken: verifyClankerToken, isVerifying: isVerifyingClanker, error: clankerVerificationError } = useClankerVerification();
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { createProtocolSplit, isLoading: isSplitLoading, error: splitError } = useSplit();
  const { updatePayoutRecipient, isLoading: isUpdatingPayout, error: payoutError } = useUpdatePayoutRecipient();

  const {
    updatePayoutRecipient: updateClankerPayoutRecipient,
    isLoading: isUpdatingClankerPayout,
    error: clankerPayoutError,
  } = useUpdateClankerPayoutRecipient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (field: "startDate" | "endDate", date: Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleBudgetChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, budgetPercentage: value[0] }));
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.currentKeyword.trim() !== "") {
      e.preventDefault();
      if (!formData.keywords.includes(formData.currentKeyword.trim().toLowerCase())) {
        setFormData((prev) => ({
          ...prev,
          keywords: [...prev.keywords, prev.currentKeyword.trim().toLowerCase()],
          currentKeyword: "",
        }));
      }
    }
  };

  const createSplitContract = async (tokenType: String, tokenLink: string, rewardPercentage: number): Promise<Address> => {
    try {
      if (tokenType === "zora") {
        const tokenAddress = extractTokenAddress(tokenLink);
        if (!tokenAddress) {
          toast.error("Invalid Zora link: No token address found");
          throw new Error("Invalid Zora link: No token address found");
        }

        const formattedAddress = tokenAddress.startsWith("0x") ? tokenAddress : `0x${tokenAddress}`;

        // Create split contract
        const splitAddress = await createProtocolSplit(rewardPercentage, formattedAddress as Address);
        if (!splitAddress) {
          toast.error("Failed to create split contract");
          throw new Error("Failed to create split contract");
        }

        // Update payout recipient to split address
        const success = await updatePayoutRecipient(formattedAddress as Address, splitAddress);
        if (!success) {
          toast.error(`Failed to update Zora payout recipient: ${payoutError}`);
          throw new Error(`Failed to update Zora payout recipient: ${payoutError}`);
        }

        return splitAddress;
      } else {
        // Clanker flow
        if (!clankerTokenDetails) {
          toast.error("Clanker token details not available");
          throw new Error("Clanker token details not available");
        }

        // Create split contract using the LP Locker contract address
        const splitAddress = await createProtocolSplit(rewardPercentage, clankerTokenDetails.lpLockerAddress);
        if (!splitAddress) {
          toast.error("Failed to create split contract");
          throw new Error("Failed to create split contract");
        }

        console.log("details are", clankerTokenDetails);

        // Update Clanker payout recipient to split address
        const success = await updateClankerPayoutRecipient(clankerTokenDetails.tokenId, clankerTokenDetails.lpLockerAddress, splitAddress);

        if (!success) {
          toast.error(`Failed to update Clanker payout recipient: ${clankerPayoutError}`);
          throw new Error(`Failed to update Clanker payout recipient: ${clankerPayoutError}`);
        }

        return splitAddress;
      }
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !campaignType ||
      !campaignLink ||
      !formData.title ||
      !formData.description ||
      !address ||
      !formData.budgetPercentage ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.keywords ||
      !clankerTokenDetails
    )
      throw new Error("Data missing");

    const isZora = campaignType === "zora";
    const link = extractTokenAddress(campaignLink);

    if (!link) {
      alert("Invalid link");
      return;
    }

    setIsSubmitting(true);

    const splitAddress = await createSplitContract(campaignType, campaignLink, formData.budgetPercentage);

    try {
      const campaign = {
        title: formData.title,
        description: formData.description,
        creatorAddress: ethers.getAddress(address),
        tokenId: isZora ? null : clankerTokenDetails?.tokenId,
        link,
        isZora,
        splitAddress,
        budgetPercentage: formData.budgetPercentage,
        campaignStartDate: formData.startDate,
        campaignEndDate: formData.endDate,
        keywords: formData.keywords,
      };

      const data = await fetch(`${BACKEND_URL}/create/bounty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      });

      if (!data.ok) {
        // Handle HTTP error
        const errorText = await data.text();
        throw new Error(`API request failed with status ${data.status}: ${errorText}`);
      }

      const response = await data.json();
      console.log("saved campaign: ", response);

      // Check if the API response indicates an error
      if (response.error) {
        throw new Error(`API error: ${response.error}`);
      }

      // Redirect to the my campaigns page
      router.push("/my-campaigns?success=true");
    } catch (error) {
      console.error("Error creating campaign:", error);
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.startDate !== null &&
      formData.endDate !== null &&
      formData.budgetPercentage > 0
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Fill in the details for your {campaignType === "clanker" ? "Clanker" : "Zora"} campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input id="title" name="title" placeholder="Enter campaign title" value={formData.title} onChange={handleInputChange} required />
          </div>

          {/* Campaign Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your campaign"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          {/* Campaign Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate || undefined}
                    onSelect={(date) => handleDateSelect("startDate", date ?? null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => handleDateSelect("endDate", date ?? null)}
                    disabled={(date) => (formData.startDate ? date < formData.startDate : false) || date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Budget Percentage */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Budget Percentage</Label>
              <span className="text-sm font-medium">{formData.budgetPercentage}%</span>
            </div>
            <Slider defaultValue={[50]} max={100} step={1} value={[formData.budgetPercentage]} onValueChange={handleBudgetChange} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (Press Enter to add)</Label>
            <Input
              id="keywords"
              name="currentKeyword"
              placeholder="Add keywords"
              value={formData.currentKeyword}
              onChange={handleInputChange}
              onKeyDown={handleAddKeyword}
            />
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="px-2 py-1">
                    {keyword}
                    <button type="button" className="ml-2 text-xs hover:text-destructive" onClick={() => handleRemoveKeyword(keyword)}>
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Campaign Link (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="campaignLink">Campaign Link</Label>
            <Input id="campaignLink" value={campaignLink} readOnly className="bg-muted" required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!isFormValid() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Campaign...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </CardFooter>
      </form>
      <ToastContainer />
    </Card>
  );
}
