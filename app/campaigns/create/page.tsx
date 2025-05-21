"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { CampaignTypeSelector } from "@/components/campaign-type-selector";
import { CampaignForm, extractTokenAddress } from "@/components/campaign-form";
import { useTokenVerification } from "@/hooks/useTokenVerification";
import { useAppKitAccount } from "@reown/appkit/react";
import { useClankerVerification } from "@/hooks/useClankerVerification";
import { ClankerTokenDetails } from "@/types/clanker";
import { ToastContainer, toast } from "react-toastify";

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState<"clanker" | "zora" | null>(null);
  const [campaignLink, setCampaignLink] = useState("");
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { verifyToken: verifyClankerToken, isVerifying: isVerifyingClanker, error: clankerVerificationError } = useClankerVerification();
  const { verifyToken, isVerifying: isVerifyingToken, error: verificationError, coinDetails } = useTokenVerification();
  const [clankerTokenDetails, setClankerTokenDetails] = useState<ClankerTokenDetails | null>(null);

  const handleVerifyLink = async (campaignLink: string) => {
    if (!campaignLink) {
      toast.error("Campaign link is required");
      throw new Error("Campaign link is required");
    }

    if (!address) {
      toast.error("Wallet address is required");
      throw new Error("Wallet address is required");
    }

    if (campaignType === "zora") {
      const tokenAddress = extractTokenAddress(campaignLink);
      if (!tokenAddress) {
        toast.error("Invalid Zora link: No token address found");
        throw new Error("Invalid Zora link: No token address found");
      }

      const formattedTokenAddress = tokenAddress.startsWith("0x") ? tokenAddress : `0x${tokenAddress}`;
      const isValid = await verifyToken(formattedTokenAddress, address);

      if (!isValid) {
        throw new Error("Invalid Zora token");
      }
    } else {
      console.log("Starting Clanker verification process:", {
        input: campaignLink,
        tokenType: campaignType,
        userAddress: address,
      });

      // Extract token address from link or use direct address
      const tokenAddress = extractTokenAddress(campaignLink);
      console.log("Token address extraction result:", {
        originalInput: campaignLink,
        extractedAddress: tokenAddress,
        isValid: !!tokenAddress,
      });

      if (!tokenAddress) {
        toast.error("Invalid Clanker link: No token address found");
        throw new Error("Invalid Clanker link: No token address found");
      }

      // Format the token address
      const formattedTokenAddress = tokenAddress.startsWith("0x") ? tokenAddress : `0x${tokenAddress}`;

      console.log("Verifying Clanker token:", {
        originalAddress: campaignLink,
        extractedAddress: tokenAddress,
        formattedAddress: formattedTokenAddress,
        userAddress: address,
        verificationStep: "Starting verification",
      });

      const { isValid, tokenDetails } = await verifyClankerToken(formattedTokenAddress, address as `0x${string}`);
      console.log("Verification result:", {
        isValid,
        error: clankerVerificationError,
        tokenDetails,
      });

      if (!isValid || !tokenDetails) {
        toast.error("Invalid Clanker token");
        throw new Error("Invalid Clanker token");
      }

      setClankerTokenDetails(tokenDetails as any);
    }
  };

  const handleTypeSelect = (type: "clanker" | "zora") => {
    setCampaignType(type);
    setStep(2);
  };

  const handleLinkSubmit = async (link: string) => {
    try {
      await handleVerifyLink(link);
      setCampaignLink(link);
      setStep(3);
    } catch (error) {
      //show toast here
      console.error(error);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
      setCampaignType(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={handleBack} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create a New Campaign</h1>
          <p className="text-muted-foreground mt-2">Set up your campaign in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Select Type</p>
              </div>
            </div>
            <div className={`h-0.5 w-12 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Add Link</p>
              </div>
            </div>
            <div className={`h-0.5 w-12 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>Campaign Details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Select Campaign Type */}
        {step === 1 && <CampaignTypeSelector onSelect={handleTypeSelect} />}

        {/* Step 2: Add Campaign Link */}
        {step === 2 && campaignType && (
          <Card>
            <CardHeader>
              <CardTitle>Add Your {campaignType === "clanker" ? "Clanker" : "Zora"} Link</CardTitle>
              <CardDescription>Paste the link to your {campaignType === "clanker" ? "Clanker" : "Zora"} content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="campaign-link" className="text-sm font-medium">
                    {campaignType === "clanker" ? "Clanker" : "Zora"} Link
                  </label>
                  <input
                    id="campaign-link"
                    type="text"
                    placeholder={`https://www.${campaignType === "clanker" ? "clanker.world/clanker/..." : "zora.co/..."}`}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={campaignLink}
                    onChange={(e) => setCampaignLink(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the full URL to your {campaignType === "clanker" ? "Clanker" : "Zora"} content
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleLinkSubmit(campaignLink)} disabled={!campaignLink}>
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Campaign Details Form */}
        {step === 3 && campaignType && campaignLink && (
          <CampaignForm campaignType={campaignType} campaignLink={campaignLink} clankerTokenDetails={clankerTokenDetails} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
