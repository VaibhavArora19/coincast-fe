import { CampaignDashboard } from "@/components/campaign-dashboard"

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage and track all your campaigns in one place</p>
      </div>
      <CampaignDashboard />
    </main>
  )
}
