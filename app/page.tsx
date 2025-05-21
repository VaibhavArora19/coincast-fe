import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0" />

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Manage Your <span className="text-primary">Campaigns</span> With Ease
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10">Track, analyze, and optimize your campaigns in one powerful dashboard</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    View Campaigns
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/campaigns/create">Create Campaign</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">The Problem</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-0.5 text-red-500 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <p className="text-lg">
                      <strong>Fragmented Management:</strong> Creators struggle to manage campaigns across multiple platforms
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-0.5 text-red-500 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <p className="text-lg">
                      <strong>Lack of Visibility:</strong> Difficult to track campaign performance and ROI
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-0.5 text-red-500 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <p className="text-lg">
                      <strong>Complex Workflows:</strong> Setting up and managing campaigns requires technical knowledge
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-0.5 text-green-500 flex-shrink-0">
                      <CheckCircle2 />
                    </div>
                    <p className="text-lg">
                      <strong>Unified Dashboard:</strong> Manage all your campaigns in one place
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-0.5 text-green-500 flex-shrink-0">
                      <CheckCircle2 />
                    </div>
                    <p className="text-lg">
                      <strong>Real-time Analytics:</strong> Track performance metrics and optimize campaigns
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-0.5 text-green-500 flex-shrink-0">
                      <CheckCircle2 />
                    </div>
                    <p className="text-lg">
                      <strong>Simplified Creation:</strong> Easy-to-use interface for creating and managing campaigns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Platform</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">Track campaign performance with comprehensive analytics and insights.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Campaign Timeline</h3>
                <p className="text-muted-foreground">Easily manage active, upcoming, and completed campaigns in one place.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Creator Collaboration</h3>
                <p className="text-muted-foreground">Connect with creators and track their contributions to your campaigns.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6">Our Ecosystem</h2>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
              We integrate with leading web3 platforms to provide a seamless campaign management experience
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Farcaster */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-8 border border-purple-200 dark:border-purple-900/30 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 32 32" className="h-8 w-8 text-purple-600" fill="currentColor">
                    <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm-2.4 21.6v-4.8h4.8v4.8h-4.8zm0-7.2V9.6h4.8v4.8h-4.8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Farcaster</h3>
                <p className="text-muted-foreground mb-6">
                  A sufficiently decentralized social network built on Ethereum. Track and manage your Farcaster campaigns with ease.
                </p>
                <a
                  href="https://www.farcaster.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Zora */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-xl p-8 border border-indigo-200 dark:border-indigo-900/30 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 90 90" className="h-8 w-8 text-indigo-600" fill="currentColor">
                    <path d="M45 0C20.147 0 0 20.147 0 45s20.147 45 45 45 45-20.147 45-45S69.853 0 45 0zm-7.5 67.5h-15v-45h15v45zm30 0h-15v-45h15v45z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Zora</h3>
                <p className="text-muted-foreground mb-6">
                  A decentralized marketplace protocol for buying, selling, and curating NFTs. Create and manage Zora-based campaigns.
                </p>
                <a
                  href="https://zora.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Clanker */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-8 border border-emerald-200 dark:border-emerald-900/30 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Clanker</h3>
                <p className="text-muted-foreground mb-6">
                  A web3 platform for creators and communities. Leverage Clanker's ecosystem to run effective campaigns.
                </p>
                <a
                  href="https://www.clanker.world/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of marketers who are already using our platform to manage their campaigns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/campaigns/create">
                    Create Your First Campaign
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/my-campaigns">View My Campaigns</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
