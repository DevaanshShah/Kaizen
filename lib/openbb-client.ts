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
  private connectionChecked: boolean = false

  constructor(baseUrl = 'http://localhost:8000', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
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
        signal: AbortSignal.timeout(5000), // Reduced timeout to 5 seconds
      })

      if (!response.ok) {
        throw new Error(`OpenBB API error: ${response.status} ${response.statusText}`)
      }

      // Mark as available on successful request
      this.isAvailable = true
      return await response.json()
    } catch (error) {
      // Mark as unavailable on any error
      this.isAvailable = false
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('OpenBB API request timed out')
        }
        if (error.message.includes('fetch failed') || error.message.includes('Failed to fetch')) {
          throw new Error('OpenBB API server is not accessible')
        }
      }
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
      // Check connection first if not already checked
      if (!this.connectionChecked) {
        await this.checkConnection()
        this.connectionChecked = true
      }

      // If not available, return empty results immediately
      if (!this.isAvailable) {
        return { results: [] }
      }

      const provider = params.provider || 'fmp'
      
      return await this.makeRequest('/news/world', {
        limit: params.limit || 20,
        provider,
        ...params
      })
    } catch (error) {
      console.warn('Failed to fetch world news from OpenBB:', error)
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
      // Check connection first if not already checked
      if (!this.connectionChecked) {
        await this.checkConnection()
        this.connectionChecked = true
      }

      // If not available, return empty results immediately
      if (!this.isAvailable) {
        return { results: [] }
      }

      const provider = params.provider || 'polygon'
      
      return await this.makeRequest('/news/company', {
        limit: params.limit || 20,
        provider,
        ...params
      })
    } catch (error) {
      console.warn('Failed to fetch company news from OpenBB:', error)
      return { results: [] }
    }
  }

  async getMarketNews(symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']): Promise<NewsArticle[]> {
    try {
      // Check connection first if not already checked
      if (!this.connectionChecked) {
        await this.checkConnection()
        this.connectionChecked = true
      }

      // If not available, return empty results immediately
      if (!this.isAvailable) {
        return []
      }

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
      const timeoutId = setTimeout(() => controller.abort(), 3000) // Reduced timeout to 3 seconds
      
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        method: 'GET',
      })
      
      clearTimeout(timeoutId)
      this.isAvailable = response.ok
      this.connectionChecked = true
      
      if (this.isAvailable) {
        console.log('OpenBB API connection successful')
      } else {
        console.warn('OpenBB API health check failed - using fallback data')
      }
      
      return response.ok
    } catch (error) {
      console.warn('OpenBB API not available - using fallback data:', error)
      this.isAvailable = false
      this.connectionChecked = true
      return false
    }
  }

  getProviderStatus(): Record<string, boolean> {
    if (!this.isAvailable) {
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

  // Reset connection status to force recheck
  resetConnection(): void {
    this.isAvailable = false
    this.connectionChecked = false
  }
}

export const openbbClient = new OpenBBNewsClient(
  process.env.OPENBB_API_URL || 'http://localhost:8000',
  process.env.OPENBB_API_KEY
)

export type { NewsArticle, OpenBBNewsResponse }