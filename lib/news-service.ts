import { openbbClient, type NewsArticle } from './openbb-client'

// Enhanced fallback mock data for when OpenBB is not available
const mockNewsData: NewsArticle[] = [
  {
    date: new Date().toISOString(),
    title: "AI Revolution Drives Tech Stocks to New Heights",
    text: "Major technology companies are experiencing unprecedented growth as artificial intelligence adoption accelerates across industries. Companies like NVIDIA, Microsoft, and Google are leading the charge with innovative AI solutions that are transforming business operations worldwide.",
    url: "#",
    source: "Financial Times",
    author: "Tech Reporter",
    sentiment: "positive",
    symbols: "NVDA,MSFT,GOOGL"
  },
  {
    date: new Date(Date.now() - 3600000).toISOString(),
    title: "Federal Reserve Signals Potential Rate Changes",
    text: "The Federal Reserve hints at monetary policy adjustments in response to evolving economic conditions. Market analysts are closely watching for signals about future interest rate decisions.",
    url: "#",
    source: "Reuters",
    author: "Economic Analyst",
    sentiment: "neutral",
    symbols: "SPY,QQQ,TLT"
  },
  {
    date: new Date(Date.now() - 7200000).toISOString(),
    title: "Cryptocurrency Market Shows Strong Recovery",
    text: "Digital assets rebound as institutional adoption continues to grow worldwide. Bitcoin and Ethereum lead the recovery with significant gains over the past week.",
    url: "#",
    source: "CoinDesk",
    author: "Crypto Reporter",
    sentiment: "positive",
    symbols: "BTC,ETH"
  },
  {
    date: new Date(Date.now() - 10800000).toISOString(),
    title: "Energy Sector Faces New Regulatory Challenges",
    text: "New environmental regulations are reshaping the energy landscape and investment strategies. Traditional energy companies are adapting to stricter compliance requirements.",
    url: "#",
    source: "Energy Weekly",
    author: "Industry Expert",
    sentiment: "negative",
    symbols: "XOM,CVX,COP"
  },
  {
    date: new Date(Date.now() - 14400000).toISOString(),
    title: "Electric Vehicle Sales Surge Globally",
    text: "Electric vehicle manufacturers report record sales as consumer adoption accelerates. Tesla, Ford, and GM are expanding production to meet growing demand.",
    url: "#",
    source: "Auto News",
    author: "Auto Industry Analyst",
    sentiment: "positive",
    symbols: "TSLA,F,GM"
  },
  {
    date: new Date(Date.now() - 18000000).toISOString(),
    title: "Healthcare Innovation Drives Biotech Gains",
    text: "Breakthrough medical technologies and drug developments are boosting biotech stocks. Several companies announce promising clinical trial results.",
    url: "#",
    source: "BioWorld",
    author: "Medical Reporter",
    sentiment: "positive",
    symbols: "JNJ,PFE,MRNA"
  },
  {
    date: new Date(Date.now() - 21600000).toISOString(),
    title: "Supply Chain Disruptions Impact Manufacturing",
    text: "Global supply chain challenges continue to affect manufacturing companies. Industry leaders are implementing new strategies to mitigate risks.",
    url: "#",
    source: "Manufacturing Today",
    author: "Supply Chain Expert",
    sentiment: "negative",
    symbols: "CAT,GE,HON"
  },
  {
    date: new Date(Date.now() - 25200000).toISOString(),
    title: "Renewable Energy Investment Reaches Record High",
    text: "Investment in renewable energy projects hits new records as governments and corporations commit to sustainability goals. Solar and wind projects lead the growth.",
    url: "#",
    source: "Green Energy Report",
    author: "Sustainability Analyst",
    sentiment: "positive",
    symbols: "ENPH,SEDG,NEE"
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
      
      // If we got articles from OpenBB, use them
      if (articles.length > 0) {
        this.cache.set(cacheKey, { data: articles, timestamp: Date.now() })
        return articles
      }
      
      // If no articles from OpenBB, fall back to mock data
      console.log('No articles from OpenBB, using fallback data')
      this.cache.set(cacheKey, { data: mockNewsData, timestamp: Date.now() })
      return mockNewsData
    } catch (error) {
      console.warn('Failed to fetch live news, using fallback data:', error)
      this.cache.set(cacheKey, { data: mockNewsData, timestamp: Date.now() })
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
      
      // If we got articles from OpenBB, use them
      if (articles.length > 0) {
        this.cache.set(cacheKey, { data: articles, timestamp: Date.now() })
        return articles
      }
      
      // If no articles from OpenBB, fall back to mock data with market symbols
      const marketNews = mockNewsData.filter(article => article.symbols)
      console.log('No market articles from OpenBB, using fallback data')
      this.cache.set(cacheKey, { data: marketNews, timestamp: Date.now() })
      return marketNews
    } catch (error) {
      console.warn('Failed to fetch market news, using fallback data:', error)
      const marketNews = mockNewsData.filter(article => article.symbols)
      this.cache.set(cacheKey, { data: marketNews, timestamp: Date.now() })
      return marketNews
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
      
      // If we got articles from OpenBB, use them
      if (articles.length > 0) {
        this.cache.set(cacheKey, { data: articles, timestamp: Date.now() })
        return articles
      }
      
      // If no articles from OpenBB, fall back to mock data filtered by symbol
      const companyNews = mockNewsData.filter(article => 
        article.symbols?.includes(symbol.toUpperCase())
      )
      
      // If no specific company news, return general market news
      const fallbackNews = companyNews.length > 0 ? companyNews : mockNewsData.slice(0, 3)
      console.log(`No articles for ${symbol} from OpenBB, using fallback data`)
      this.cache.set(cacheKey, { data: fallbackNews, timestamp: Date.now() })
      return fallbackNews
    } catch (error) {
      console.warn(`Failed to fetch news for ${symbol}, using fallback data:`, error)
      const companyNews = mockNewsData.filter(article => 
        article.symbols?.includes(symbol.toUpperCase())
      )
      const fallbackNews = companyNews.length > 0 ? companyNews : mockNewsData.slice(0, 3)
      this.cache.set(cacheKey, { data: fallbackNews, timestamp: Date.now() })
      return fallbackNews
    }
  }

  async searchNews(query: string, limit = 10): Promise<NewsArticle[]> {
    try {
      // Search in cached world news first
      const worldNews = await this.getWorldNews()
      const searchResults = worldNews
        .filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.text?.toLowerCase().includes(query.toLowerCase()) ||
          article.tags?.toLowerCase().includes(query.toLowerCase()) ||
          article.symbols?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit)
      
      return searchResults
    } catch (error) {
      console.warn('Failed to search news:', error)
      // Return filtered mock data as fallback
      return mockNewsData
        .filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.text?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit)
    }
  }

  clearCache(): void {
    this.cache.clear()
  }

  // Get connection status for UI display
  async getConnectionStatus(): Promise<{ connected: boolean; message: string }> {
    try {
      const isConnected = await openbbClient.checkConnection()
      return {
        connected: isConnected,
        message: isConnected 
          ? 'Connected to OpenBB API - Live data available' 
          : 'OpenBB API unavailable - Using demo data'
      }
    } catch (error) {
      return {
        connected: false,
        message: 'OpenBB API unavailable - Using demo data'
      }
    }
  }
}

export const newsService = NewsService.getInstance()