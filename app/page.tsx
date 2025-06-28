"use client"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { HeroSection } from "@/components/hero-section"
import { MarketsSection } from "@/components/markets-section"
import { NewsSection } from "@/components/news-section"
import { TechnologySection } from "@/components/technology-section"
import { AIInsightsSection } from "@/components/ai-insights-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-80">
          <HeroSection />
          <MarketsSection />
          <AIInsightsSection />
          <NewsSection />
          <TechnologySection />
          <Footer />
        </main>
      </div>
    </div>
  )
}
