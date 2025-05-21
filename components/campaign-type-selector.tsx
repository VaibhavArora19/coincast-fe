"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"

interface CampaignTypeSelectorProps {
  onSelect: (type: "clanker" | "zora") => void
}

export function CampaignTypeSelector({ onSelect }: CampaignTypeSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Clanker Option */}
      <Card
        className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-200"
        onClick={() => onSelect("clanker")}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Clanker Campaign</CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <CardDescription>Create a campaign based on Clanker content</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Perfect for promoting your Clanker content and engaging with the Clanker community.
          </p>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">Requires a Clanker link</div>
        </CardFooter>
      </Card>

      {/* Zora Option */}
      <Card
        className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-200"
        onClick={() => onSelect("zora")}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Zora Campaign</CardTitle>
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <svg viewBox="0 0 90 90" className="h-5 w-5 text-indigo-600" fill="currentColor">
                <path d="M45 0C20.147 0 0 20.147 0 45s20.147 45 45 45 45-20.147 45-45S69.853 0 45 0zm-7.5 67.5h-15v-45h15v45zm30 0h-15v-45h15v45z" />
              </svg>
            </div>
          </div>
          <CardDescription>Create a campaign based on Zora NFTs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ideal for promoting your Zora NFTs and connecting with collectors and creators.
          </p>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">Requires a Zora link</div>
        </CardFooter>
      </Card>
    </div>
  )
}
