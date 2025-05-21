"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { AppKit } from "@/context/appkit";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

// export const metadata = {
//   title: "Coin Cast - Manage Your Campaigns",
//   description: "Track, analyze, and optimize your campaigns in one powerful dashboard",
//   generator: "v0.dev",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <div className="flex flex-col min-h-screen">
                <AppKit>
                  <Header />
                  <div className="flex-grow">{children}</div>
                  <footer className="border-t py-6 md:py-8">
                    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                      <div className="text-sm text-muted-foreground">© 2025 Coin Cast. All rights reserved.</div>
                      <div className="flex items-center gap-4">
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                          Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                          Terms of Service
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                          Contact
                        </a>
                      </div>
                    </div>
                  </footer>
                </AppKit>
              </div>
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
