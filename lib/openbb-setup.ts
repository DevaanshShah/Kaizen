// OpenBB Platform Setup and Configuration
export interface OpenBBCredentials {
  fmp_api_key?: string
  polygon_api_key?: string
  benzinga_api_key?: string
  fred_api_key?: string
  nasdaq_api_key?: string
  intrinio_api_key?: string
  alpha_vantage_api_key?: string
  tiingo_token?: string
}

export class OpenBBSetup {
  private static instance: OpenBBSetup
  private credentials: OpenBBCredentials = {}

  static getInstance(): OpenBBSetup {
    if (!OpenBBSetup.instance) {
      OpenBBSetup.instance = new OpenBBSetup()
    }
    return OpenBBSetup.instance
  }

  constructor() {
    this.loadCredentials()
  }

  private loadCredentials() {
    // Load credentials from environment variables
    this.credentials = {
      fmp_api_key: process.env.FMP_API_KEY,
      polygon_api_key: process.env.POLYGON_API_KEY || 'M_Oc0zRLKkVWPnjBYe9dbO64g7UNnuL_',
      benzinga_api_key: process.env.BENZINGA_API_KEY,
      fred_api_key: process.env.FRED_API_KEY,
      nasdaq_api_key: process.env.NASDAQ_API_KEY,
      intrinio_api_key: process.env.INTRINIO_API_KEY,
      alpha_vantage_api_key: process.env.ALPHA_VANTAGE_API_KEY,
      tiingo_token: process.env.TIINGO_TOKEN,
    }
  }

  async setupOpenBBCredentials(): Promise<boolean> {
    try {
      const baseUrl = process.env.OPENBB_API_URL || 'http://localhost:8000'
      
      // Configure credentials via OpenBB API
      const response = await fetch(`${baseUrl}/user/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENBB_API_KEY || ''}`
        },
        body: JSON.stringify({
          credentials: this.credentials
        })
      })

      if (!response.ok) {
        console.warn('Failed to configure OpenBB credentials via API')
        return false
      }

      console.log('OpenBB credentials configured successfully')
      return true
    } catch (error) {
      console.error('Error setting up OpenBB credentials:', error)
      return false
    }
  }

  getAvailableProviders(): string[] {
    const providers = []
    
    if (this.credentials.fmp_api_key) providers.push('fmp')
    if (this.credentials.polygon_api_key) providers.push('polygon')
    if (this.credentials.benzinga_api_key) providers.push('benzinga')
    if (this.credentials.intrinio_api_key) providers.push('intrinio')
    if (this.credentials.tiingo_token) providers.push('tiingo')
    
    // Always include free providers
    providers.push('yfinance')
    
    return providers
  }

  getBestProvider(): string {
    const providers = this.getAvailableProviders()
    
    // Priority order based on data quality and reliability
    // Polygon is now prioritized since we have a valid API key
    const priority = ['polygon', 'benzinga', 'fmp', 'intrinio', 'tiingo', 'yfinance']
    
    for (const provider of priority) {
      if (providers.includes(provider)) {
        return provider
      }
    }
    
    return 'polygon' // Default to polygon since we have the API key
  }

  hasValidCredentials(): boolean {
    return this.getAvailableProviders().length > 0
  }

  getCredentialStatus(): Record<string, boolean> {
    return {
      fmp: !!this.credentials.fmp_api_key,
      polygon: !!this.credentials.polygon_api_key,
      benzinga: !!this.credentials.benzinga_api_key,
      intrinio: !!this.credentials.intrinio_api_key,
      tiingo: !!this.credentials.tiingo_token,
      fred: !!this.credentials.fred_api_key,
      nasdaq: !!this.credentials.nasdaq_api_key,
      alpha_vantage: !!this.credentials.alpha_vantage_api_key,
    }
  }
}

export const openbbSetup = OpenBBSetup.getInstance()