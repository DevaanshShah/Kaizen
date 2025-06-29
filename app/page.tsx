"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MarketsSection } from "@/components/markets-section"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <MarketsSection />
        <NewsSection />
        <Footer />
      </main>
    </div>
  )
}