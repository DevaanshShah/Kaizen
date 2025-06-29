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
      })

      if (!response.ok) {
        throw new Error(`OpenBB API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
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
    // Use the best available provider
    const provider = params.provider || openbbSetup.getBestProvider()
    
    return this.makeRequest('/news/world', {
      limit: params.limit || 20,
      provider,
      ...params
    })
  }

  async getCompanyNews(params: {
    symbol?: string
    limit?: number
    start_date?: string
    end_date?: string
    provider?: 'benzinga' | 'fmp' | 'intrinio' | 'polygon' | 'tiingo' | 'yfinance'
  } = {}): Promise<OpenBBNewsResponse> {
    // Use the best available provider
    const provider = params.provider || openbbSetup.getBestProvider()
    
    return this.makeRequest('/news/company', {
      limit: params.limit || 20,
      provider,
      ...params
    })
  }

  async getMarketNews(symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']): Promise<NewsArticle[]> {
    try {
      const provider = openbbSetup.getBestProvider()
      const promises = symbols.map(symbol => 
        this.getCompanyNews({ symbol, limit: 5, provider: provider as any })
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
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch {
      return false
    }
  }

  getProviderStatus(): Record<string, boolean> {
    return openbbSetup.getCredentialStatus()
  }
}

export const openbbClient = new OpenBBNewsClient(
  process.env.OPENBB_API_URL || 'http://localhost:8000',
  process.env.OPENBB_API_KEY
)

export type { NewsArticle, OpenBBNewsResponse }