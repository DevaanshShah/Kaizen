"use client"

import { LiveNewsSection } from "@/components/live-news-section"

export function NewsSection() {
  return (
    <LiveNewsSection 
      maxArticles={8}
      showSearch={true}
      showFilters={true}
      autoRefresh={true}
      refreshInterval={300000} // 5 minutes
    />
  )
}