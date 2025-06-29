import { openbbClient, type NewsArticle } from './openbb-client'

// Fallback mock data for when OpenBB is not available
const mockNewsData: NewsArticle[] = [
  {
    date: new Date().toISOString(),
    title: "AI Revolution Drives Tech Stocks to New Heights",
    text: "Major technology companies are experiencing unprecedented growth as artificial intelligence adoption accelerates across industries.",
    url: "#",
    source: "Financial Times",
    author: "Tech Reporter",
    sentiment: "positive",
    symbols: "AAPL,GOOGL,MSFT"
  },
  {
    date: new Date(Date.now() - 3600000).toISOString(),
    title: "Federal Reserve Signals Potential Rate Changes",
    text: "The Federal Reserve hints at monetary policy adjustments in response to evolving economic conditions.",
    url: "#",
    source: "Reuters",
    author: "Economic Analyst",
    sentiment: "neutral",
    symbols: "SPY,QQQ"
  },
  {
    date: new Date(Date.now() - 7200000).toISOString(),
    title: "Cryptocurrency Market Shows Strong Recovery",
    text: "Digital assets rebound as institutional adoption continues to grow worldwide.",
    url: "#",
    source: "CoinDesk",
    author: "Crypto Reporter",
    sentiment: "positive",
    symbols: "BTC,ETH"
  },
  {
    date: new Date(Date.now() - 10800000).toISOString(),
    title: "Energy Sector Faces New Regulatory Challenges",
    text: "New environmental regulations are reshaping the energy landscape and investment strategies.",
    url: "#",
    source: "Energy Weekly",
    author: "Industry Expert",
    sentiment: "negative",
    symbols: "XOM,CVX"
  }
]

export class NewsService {
  private static instance: NewsService
  private cache: Map<string, { data: NewsArticle[], timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService()
    }
    return NewsService.instance
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  async getWorldNews(forceRefresh = false): Promise<NewsArticle[]> {
    const cacheKey = 'world-news'
    
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    try {
      const response = await openbbClient.getWorldNews({
        limit: 15,
        provider: 'fmp'
      })
      
      const articles = response.results || []
      this.cache.set(cacheKey, { data: articles, timestamp: Date.now() })
      return articles
    } catch (error) {
      console.warn('Failed to fetch live news, using fallback data:', error)
      return mockNewsData
    }
  }

  async getMarketNews(forceRefresh = false): Promise<NewsArticle[]> {
    const cacheKey = 'market-news'
    
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    try {
      const articles = await openbbClient.getMarketNews()
      this.cache.set(cacheKey, { data: articles, timestamp: Date.now() })
      return articles
    } catch (error) {
      console.warn('Failed to fetch market news, using fallback data:', error)
      return mockNewsData.filter(article => article.symbols)
    }
  }

  async getCompanyNews(symbol: string, forceRefresh = false): Promise<NewsArticle[]> {
    const cacheKey = `company-news-${symbol}`
    
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    try {
      const response = await openbbClient.getCompanyNews({
        symbol,
        limit: 10,
        provider: 'fmp'
      })
      
      const articles = response.results || []
      this.cache.set(cacheKey, { data: articles, timestamp: Date.now() })
      return articles
    } catch (error) {
      console.warn(`Failed to fetch news for ${symbol}, using fallback data:`, error)
      return mockNewsData.filter(article => 
        article.symbols?.includes(symbol.toUpperCase())
      )
    }
  }

  async searchNews(query: string, limit = 10): Promise<NewsArticle[]> {
    try {
      // For now, search in cached world news
      const worldNews = await this.getWorldNews()
      return worldNews
        .filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.text?.toLowerCase().includes(query.toLowerCase()) ||
          article.tags?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit)
    } catch (error) {
      console.warn('Failed to search news:', error)
      return []
    }
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const newsService = NewsService.getInstance()