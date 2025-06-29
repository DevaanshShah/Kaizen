"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Clock, User, Brain, Sparkles, TrendingUp, TrendingDown, RefreshCw, Search, Filter, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { NewsArticle } from "@/lib/openbb-client"

interface LiveNewsSectionProps {
  maxArticles?: number
  showSearch?: boolean
  showFilters?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function LiveNewsSection({ 
  maxArticles = 8,
  showSearch = true,
  showFilters = true,
  autoRefresh = true,
  refreshInterval = 300000 // 5 minutes
}: LiveNewsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "positive" | "negative" | "neutral">("all")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchNews = async (forceRefresh = false) => {
    setIsLoading(true)
    try {
      const refreshParam = forceRefresh ? '&refresh=true' : ''
      
      const [worldResponse, marketResponse] = await Promise.all([
        fetch(`/api/news?type=world&limit=${maxArticles}${refreshParam}`),
        fetch(`/api/news?type=market&limit=${maxArticles}${refreshParam}`)
      ])
      
      if (!worldResponse.ok || !marketResponse.ok) {
        throw new Error('Failed to fetch news data')
      }
      
      const [worldNews, marketNews] = await Promise.all([
        worldResponse.json(),
        marketResponse.json()
      ])
      
      // Combine and deduplicate articles
      const combined = [...worldNews, ...marketNews]
      const unique = combined.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      )
      
      // Sort by date
      const sorted = unique.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setArticles(sorted.slice(0, maxArticles))
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter articles based on search and sentiment
  useEffect(() => {
    let filtered = articles

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sentiment filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(article => article.sentiment === selectedFilter)
    }

    setFilteredArticles(filtered)
  }, [articles, searchQuery, selectedFilter])

  // Initial load
  useEffect(() => {
    fetchNews()
  }, [])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchNews(true)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      case 'neutral': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-3 h-3" />
      case 'negative': return <TrendingDown className="w-3 h-3" />
      default: return <Brain className="w-3 h-3" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <section ref={ref} className="py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-blue-400 mr-4">Live Market News</h2>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <Badge variant="outline" className="ml-4 text-green-400 border-green-400">
              LIVE
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-gray-400">
                Updated {formatTimeAgo(lastUpdated.toISOString())}
              </span>
            )}
            <Button
              onClick={() => fetchNews(true)}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}
            
            {showFilters && (
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <div className="flex space-x-2">
                  {(['all', 'positive', 'negative', 'neutral'] as const).map((filter) => (
                    <Button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      variant={selectedFilter === filter ? "default" : "outline"}
                      size="sm"
                      className={`capitalize ${
                        selectedFilter === filter
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-gray-600 text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && articles.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-3"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* News Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredArticles.map((article, index) => (
              <motion.article
                key={`${article.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500 transition-all cursor-pointer group"
              >
                <div className="p-6">
                  {/* Article Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {article.source && (
                        <Badge variant="outline" className="text-xs bg-blue-600 text-white border-blue-500">
                          {article.source}
                        </Badge>
                      )}
                      {article.sentiment && (
                        <div className={`flex items-center space-x-1 ${getSentimentColor(article.sentiment)}`}>
                          {getSentimentIcon(article.sentiment)}
                          <span className="text-xs capitalize">{article.sentiment}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimeAgo(article.date)}
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Article Summary/Text */}
                  {(article.summary || article.text) && (
                    <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                      {article.summary || article.text}
                    </p>
                  )}

                  {/* Article Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      {article.author && (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          {article.author}
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {article.symbols && (
                        <div className="flex space-x-1">
                          {article.symbols.split(',').slice(0, 3).map((symbol, i) => (
                            <Badge key={i} variant="outline" className="text-xs text-green-400 border-green-400">
                              {symbol.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {article.url && article.url !== '#' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(article.url, '_blank')
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {article.tags && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.split(',').slice(0, 4).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs text-gray-400 border-gray-600">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {!isLoading && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No news found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Unable to load news at this time'
              }
            </p>
          </div>
        )}

        {/* AI Enhancement Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30"
        >
          <div className="flex items-center justify-center space-x-2 text-purple-400">
            <Brain className="w-5 h-5" />
            <span className="text-sm">
              News powered by OpenBB with AI sentiment analysis and real-time market data
            </span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}