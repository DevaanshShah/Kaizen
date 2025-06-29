// OpenBB News API Client
import { openbbSetup } from './openbb-setup'

interface NewsArticle {
  date: string
  title: string
  text?: string
  url?: string
  source?: string
  author?: string
  summary?: string
  sentiment?: string
  tags?: string
  symbols?: string
  images?: Array<{ url: string; caption?: string }>
}

interface OpenBBNewsResponse {
  results: NewsArticle[]
  provider?: string
  warnings?: any[]
}

class OpenBBNewsClient {
  private baseUrl: string
  private apiKey?: string
  private isAvailable: boolean = false

  constructor(baseUrl = 'http://localhost:8000', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    // Check if OpenBB is available first
    if (!this.isAvailable) {
      throw new Error('OpenBB API is not available. Please start the OpenBB API server.')
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    // Add parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`OpenBB API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('OpenBB API request timed out')
        }
        if (error.message.includes('fetch failed') || error.message.includes('Failed to fetch')) {
          throw new Error('OpenBB API server is not accessible. Please ensure it is running.')
        }
      }
      console.error('OpenBB API request failed:', error)
      throw error
    }
  }

  async getWorldNews(params: {
    limit?: number
    start_date?: string
    end_date?: string
    provider?: 'benzinga' | 'fmp' | 'intrinio' | 'tiingo'
    topics?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
  } = {}): Promise<OpenBBNewsResponse> {
    try {
      // Use polygon as the preferred provider since we have the API key
      const provider = params.provider || 'fmp' // Use fmp for world news as polygon focuses on company news
      
      return await this.makeRequest('/news/world', {
        limit: params.limit || 20,
        provider,
        ...params
      })
    } catch (error) {
      console.warn('Failed to fetch world news from OpenBB:', error)
      // Return empty results instead of throwing
      return { results: [] }
    }
  }

  async getCompanyNews(params: {
    symbol?: string
    limit?: number
    start_date?: string
    end_date?: string
    provider?: 'benzinga' | 'fmp' | 'intrinio' | 'polygon' | 'tiingo' | 'yfinance'
  } = {}): Promise<OpenBBNewsResponse> {
    try {
      // Use polygon as the preferred provider for company news since we have the API key
      const provider = params.provider || 'polygon'
      
      return await this.makeRequest('/news/company', {
        limit: params.limit || 20,
        provider,
        ...params
      })
    } catch (error) {
      console.warn('Failed to fetch company news from OpenBB:', error)
      // Return empty results instead of throwing
      return { results: [] }
    }
  }

  async getMarketNews(symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']): Promise<NewsArticle[]> {
    try {
      if (!this.isAvailable) {
        console.warn('OpenBB API not available, returning empty market news')
        return []
      }

      // Use polygon for company news since we have the API key
      const promises = symbols.map(symbol => 
        this.getCompanyNews({ symbol, limit: 5, provider: 'polygon' })
      )
      
      const responses = await Promise.allSettled(promises)
      const articles: NewsArticle[] = []
      
      responses.forEach(response => {
        if (response.status === 'fulfilled' && response.value.results) {
          articles.push(...response.value.results)
        }
      })

      // Sort by date and remove duplicates
      return articles
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .filter((article, index, self) => 
          index === self.findIndex(a => a.title === article.title)
        )
        .slice(0, 20)
    } catch (error) {
      console.error('Failed to fetch market news:', error)
      return []
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        method: 'GET',
      })
      
      clearTimeout(timeoutId)
      this.isAvailable = response.ok
      return response.ok
    } catch (error) {
      console.warn('OpenBB API health check failed:', error)
      this.isAvailable = false
      return false
    }
  }

  getProviderStatus(): Record<string, boolean> {
    if (!this.isAvailable) {
      // Return all providers as unavailable if OpenBB is not connected
      return {
        fmp: false,
        polygon: false,
        benzinga: false,
        intrinio: false,
        tiingo: false,
        fred: false,
        nasdaq: false,
        alpha_vantage: false
      }
    }
    return openbbSetup.getCredentialStatus()
  }

  isOpenBBAvailable(): boolean {
    return this.isAvailable
  }
}

export const openbbClient = new OpenBBNewsClient(
  process.env.OPENBB_API_URL || 'http://localhost:8000',
  process.env.OPENBB_API_KEY
)

export type { NewsArticle, OpenBBNewsResponse }