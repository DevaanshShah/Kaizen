// Comprehensive OpenBB Client - Replicating all OpenBB dashboard features
import { openbbSetup } from './openbb-setup'

// Core data interfaces based on OpenBB structure
export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  pe?: number
  eps?: number
  dividend?: number
  beta?: number
  high52w?: number
  low52w?: number
  avgVolume?: number
  sector?: string
  industry?: string
}

export interface OptionsData {
  symbol: string
  strike: number
  expiration: string
  type: 'call' | 'put'
  bid: number
  ask: number
  volume: number
  openInterest: number
  impliedVolatility: number
  delta?: number
  gamma?: number
  theta?: number
  vega?: number
}

export interface EconomicData {
  indicator: string
  value: number
  date: string
  unit: string
  frequency: string
  source: string
}

export interface CryptoData {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  rank: number
  supply?: number
  maxSupply?: number
}

export interface ETFData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  aum: number
  expenseRatio: number
  dividend: number
  holdings?: Array<{
    symbol: string
    weight: number
    shares: number
  }>
}

export interface ForexData {
  pair: string
  rate: number
  change: number
  changePercent: number
  bid: number
  ask: number
  high: number
  low: number
}

export interface FuturesData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  openInterest: number
  expiration: string
}

export interface BondsData {
  symbol: string
  name: string
  yield: number
  price: number
  duration: number
  maturity: string
  rating: string
  coupon: number
}

export interface AlternativeData {
  type: 'insider_trading' | 'short_interest' | 'social_sentiment' | 'earnings_estimates'
  symbol?: string
  data: any
  timestamp: string
}

class OpenBBComprehensiveClient {
  private baseUrl: string
  private apiKey?: string
  private isAvailable: boolean = false

  constructor(baseUrl = 'http://localhost:8000', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.isAvailable) {
      throw new Error('OpenBB API is not available. Please start the OpenBB API server.')
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    
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
        signal: AbortSignal.timeout(15000),
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

  // EQUITY METHODS
  async getStockQuote(symbol: string, provider = 'polygon'): Promise<StockData> {
    try {
      const response = await this.makeRequest('/equity/price/quote', { symbol, provider })
      return this.transformStockData(response.results[0], symbol)
    } catch (error) {
      console.warn(`Failed to fetch stock quote for ${symbol}:`, error)
      return this.getMockStockData(symbol)
    }
  }

  async getStockHistorical(symbol: string, period = '1y', provider = 'polygon'): Promise<any[]> {
    try {
      const response = await this.makeRequest('/equity/price/historical', { 
        symbol, 
        period,
        provider 
      })
      return response.results || []
    } catch (error) {
      console.warn(`Failed to fetch historical data for ${symbol}:`, error)
      return []
    }
  }

  async getStockFundamentals(symbol: string, provider = 'fmp'): Promise<any> {
    try {
      const response = await this.makeRequest('/equity/fundamental/overview', { 
        symbol, 
        provider 
      })
      return response.results[0] || {}
    } catch (error) {
      console.warn(`Failed to fetch fundamentals for ${symbol}:`, error)
      return {}
    }
  }

  async getStockScreener(criteria: Record<string, any> = {}, provider = 'fmp'): Promise<StockData[]> {
    try {
      const response = await this.makeRequest('/equity/screener', { 
        ...criteria,
        provider 
      })
      return (response.results || []).map((stock: any) => this.transformStockData(stock))
    } catch (error) {
      console.warn('Failed to fetch stock screener data:', error)
      return this.getMockStockScreenerData()
    }
  }

  // OPTIONS METHODS
  async getOptionsChain(symbol: string, provider = 'intrinio'): Promise<OptionsData[]> {
    try {
      const response = await this.makeRequest('/derivatives/options/chains', { 
        symbol, 
        provider 
      })
      return (response.results || []).map((option: any) => this.transformOptionsData(option))
    } catch (error) {
      console.warn(`Failed to fetch options chain for ${symbol}:`, error)
      return this.getMockOptionsData(symbol)
    }
  }

  async getOptionsFlow(provider = 'tradier'): Promise<any[]> {
    try {
      const response = await this.makeRequest('/derivatives/options/unusual', { provider })
      return response.results || []
    } catch (error) {
      console.warn('Failed to fetch options flow:', error)
      return []
    }
  }

  // ECONOMIC DATA METHODS
  async getEconomicIndicators(indicators: string[] = ['GDP', 'CPI', 'UNEMPLOYMENT'], provider = 'fred'): Promise<EconomicData[]> {
    try {
      const promises = indicators.map(indicator => 
        this.makeRequest('/economy/indicators', { indicator, provider })
      )
      const responses = await Promise.allSettled(promises)
      
      const data: EconomicData[] = []
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.results) {
          data.push(...response.value.results.map((item: any) => ({
            indicator: indicators[index],
            value: item.value,
            date: item.date,
            unit: item.unit || '',
            frequency: item.frequency || 'monthly',
            source: provider
          })))
        }
      })
      
      return data
    } catch (error) {
      console.warn('Failed to fetch economic indicators:', error)
      return this.getMockEconomicData()
    }
  }

  async getFedData(series = 'FEDFUNDS', provider = 'fred'): Promise<any[]> {
    try {
      const response = await this.makeRequest('/economy/fred', { series, provider })
      return response.results || []
    } catch (error) {
      console.warn('Failed to fetch Fed data:', error)
      return []
    }
  }

  // CRYPTOCURRENCY METHODS
  async getCryptoQuotes(symbols: string[] = ['BTC', 'ETH', 'ADA', 'SOL'], provider = 'coinbase'): Promise<CryptoData[]> {
    try {
      const promises = symbols.map(symbol => 
        this.makeRequest('/crypto/price/quote', { symbol, provider })
      )
      const responses = await Promise.allSettled(promises)
      
      const data: CryptoData[] = []
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.results) {
          data.push(this.transformCryptoData(response.value.results[0], symbols[index]))
        }
      })
      
      return data.length > 0 ? data : this.getMockCryptoData()
    } catch (error) {
      console.warn('Failed to fetch crypto quotes:', error)
      return this.getMockCryptoData()
    }
  }

  // ETF METHODS
  async getETFData(symbols: string[] = ['SPY', 'QQQ', 'IWM', 'VTI'], provider = 'fmp'): Promise<ETFData[]> {
    try {
      const promises = symbols.map(symbol => 
        this.makeRequest('/etf/info', { symbol, provider })
      )
      const responses = await Promise.allSettled(promises)
      
      const data: ETFData[] = []
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.results) {
          data.push(this.transformETFData(response.value.results[0], symbols[index]))
        }
      })
      
      return data.length > 0 ? data : this.getMockETFData()
    } catch (error) {
      console.warn('Failed to fetch ETF data:', error)
      return this.getMockETFData()
    }
  }

  // FOREX METHODS
  async getForexRates(pairs: string[] = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD'], provider = 'fmp'): Promise<ForexData[]> {
    try {
      const promises = pairs.map(pair => 
        this.makeRequest('/forex/price/quote', { pair, provider })
      )
      const responses = await Promise.allSettled(promises)
      
      const data: ForexData[] = []
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.results) {
          data.push(this.transformForexData(response.value.results[0], pairs[index]))
        }
      })
      
      return data.length > 0 ? data : this.getMockForexData()
    } catch (error) {
      console.warn('Failed to fetch forex rates:', error)
      return this.getMockForexData()
    }
  }

  // FUTURES METHODS
  async getFuturesData(symbols: string[] = ['ES', 'NQ', 'CL', 'GC'], provider = 'yfinance'): Promise<FuturesData[]> {
    try {
      const promises = symbols.map(symbol => 
        this.makeRequest('/derivatives/futures/quote', { symbol, provider })
      )
      const responses = await Promise.allSettled(promises)
      
      const data: FuturesData[] = []
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.results) {
          data.push(this.transformFuturesData(response.value.results[0], symbols[index]))
        }
      })
      
      return data.length > 0 ? data : this.getMockFuturesData()
    } catch (error) {
      console.warn('Failed to fetch futures data:', error)
      return this.getMockFuturesData()
    }
  }

  // BONDS METHODS
  async getBondsData(provider = 'fred'): Promise<BondsData[]> {
    try {
      const response = await this.makeRequest('/fixedincome/government', { provider })
      return (response.results || []).map((bond: any) => this.transformBondsData(bond))
    } catch (error) {
      console.warn('Failed to fetch bonds data:', error)
      return this.getMockBondsData()
    }
  }

  // ALTERNATIVE DATA METHODS
  async getInsiderTrading(symbol: string, provider = 'fmp'): Promise<AlternativeData> {
    try {
      const response = await this.makeRequest('/equity/ownership/insider_trading', { symbol, provider })
      return {
        type: 'insider_trading',
        symbol,
        data: response.results || [],
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn(`Failed to fetch insider trading for ${symbol}:`, error)
      return {
        type: 'insider_trading',
        symbol,
        data: [],
        timestamp: new Date().toISOString()
      }
    }
  }

  async getShortInterest(symbol: string, provider = 'stockgrid'): Promise<AlternativeData> {
    try {
      const response = await this.makeRequest('/equity/shorts/short_interest', { symbol, provider })
      return {
        type: 'short_interest',
        symbol,
        data: response.results || [],
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn(`Failed to fetch short interest for ${symbol}:`, error)
      return {
        type: 'short_interest',
        symbol,
        data: [],
        timestamp: new Date().toISOString()
      }
    }
  }

  async getSocialSentiment(symbol: string, provider = 'stocktwits'): Promise<AlternativeData> {
    try {
      const response = await this.makeRequest('/equity/behavioral/sentiment', { symbol, provider })
      return {
        type: 'social_sentiment',
        symbol,
        data: response.results || [],
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn(`Failed to fetch social sentiment for ${symbol}:`, error)
      return {
        type: 'social_sentiment',
        symbol,
        data: [],
        timestamp: new Date().toISOString()
      }
    }
  }

  // UTILITY METHODS
  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
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

  // DATA TRANSFORMATION METHODS
  private transformStockData(data: any, symbol?: string): StockData {
    return {
      symbol: symbol || data.symbol || 'N/A',
      name: data.name || data.shortName || 'Unknown',
      price: data.price || data.regularMarketPrice || 0,
      change: data.change || data.regularMarketChange || 0,
      changePercent: data.changePercent || data.regularMarketChangePercent || 0,
      volume: data.volume || data.regularMarketVolume || 0,
      marketCap: data.marketCap || 0,
      pe: data.pe || data.trailingPE,
      eps: data.eps || data.trailingEps,
      dividend: data.dividend || data.dividendYield,
      beta: data.beta,
      high52w: data.high52w || data.fiftyTwoWeekHigh,
      low52w: data.low52w || data.fiftyTwoWeekLow,
      avgVolume: data.avgVolume || data.averageVolume,
      sector: data.sector,
      industry: data.industry
    }
  }

  private transformOptionsData(data: any): OptionsData {
    return {
      symbol: data.symbol || 'N/A',
      strike: data.strike || 0,
      expiration: data.expiration || '',
      type: data.type || 'call',
      bid: data.bid || 0,
      ask: data.ask || 0,
      volume: data.volume || 0,
      openInterest: data.openInterest || 0,
      impliedVolatility: data.impliedVolatility || 0,
      delta: data.delta,
      gamma: data.gamma,
      theta: data.theta,
      vega: data.vega
    }
  }

  private transformCryptoData(data: any, symbol: string): CryptoData {
    return {
      symbol: symbol,
      name: data.name || symbol,
      price: data.price || 0,
      change24h: data.change24h || 0,
      changePercent24h: data.changePercent24h || 0,
      volume24h: data.volume24h || 0,
      marketCap: data.marketCap || 0,
      rank: data.rank || 0,
      supply: data.supply,
      maxSupply: data.maxSupply
    }
  }

  private transformETFData(data: any, symbol: string): ETFData {
    return {
      symbol: symbol,
      name: data.name || symbol,
      price: data.price || 0,
      change: data.change || 0,
      changePercent: data.changePercent || 0,
      aum: data.aum || 0,
      expenseRatio: data.expenseRatio || 0,
      dividend: data.dividend || 0,
      holdings: data.holdings || []
    }
  }

  private transformForexData(data: any, pair: string): ForexData {
    return {
      pair: pair,
      rate: data.rate || 0,
      change: data.change || 0,
      changePercent: data.changePercent || 0,
      bid: data.bid || 0,
      ask: data.ask || 0,
      high: data.high || 0,
      low: data.low || 0
    }
  }

  private transformFuturesData(data: any, symbol: string): FuturesData {
    return {
      symbol: symbol,
      name: data.name || symbol,
      price: data.price || 0,
      change: data.change || 0,
      changePercent: data.changePercent || 0,
      volume: data.volume || 0,
      openInterest: data.openInterest || 0,
      expiration: data.expiration || ''
    }
  }

  private transformBondsData(data: any): BondsData {
    return {
      symbol: data.symbol || 'N/A',
      name: data.name || 'Unknown',
      yield: data.yield || 0,
      price: data.price || 0,
      duration: data.duration || 0,
      maturity: data.maturity || '',
      rating: data.rating || 'N/A',
      coupon: data.coupon || 0
    }
  }

  // MOCK DATA METHODS (fallbacks when API is unavailable)
  private getMockStockData(symbol: string): StockData {
    const mockPrices: Record<string, number> = {
      'AAPL': 175.43, 'GOOGL': 2847.63, 'MSFT': 378.85, 'AMZN': 3467.42, 'TSLA': 1067.20
    }
    const basePrice = mockPrices[symbol] || 100 + Math.random() * 200
    
    return {
      symbol,
      name: `${symbol} Inc.`,
      price: basePrice,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: basePrice * 1000000000,
      pe: 15 + Math.random() * 20,
      eps: basePrice / 20,
      dividend: Math.random() * 3,
      beta: 0.8 + Math.random() * 0.8,
      high52w: basePrice * 1.2,
      low52w: basePrice * 0.8,
      avgVolume: Math.floor(Math.random() * 5000000),
      sector: 'Technology',
      industry: 'Software'
    }
  }

  private getMockStockScreenerData(): StockData[] {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX']
    return symbols.map(symbol => this.getMockStockData(symbol))
  }

  private getMockOptionsData(symbol: string): OptionsData[] {
    const strikes = [150, 160, 170, 180, 190]
    const expirations = ['2024-03-15', '2024-04-19', '2024-05-17']
    const options: OptionsData[] = []
    
    strikes.forEach(strike => {
      expirations.forEach(expiration => {
        ['call', 'put'].forEach(type => {
          options.push({
            symbol,
            strike,
            expiration,
            type: type as 'call' | 'put',
            bid: strike * 0.05,
            ask: strike * 0.06,
            volume: Math.floor(Math.random() * 1000),
            openInterest: Math.floor(Math.random() * 5000),
            impliedVolatility: 0.2 + Math.random() * 0.3,
            delta: type === 'call' ? 0.5 : -0.5,
            gamma: 0.01,
            theta: -0.05,
            vega: 0.1
          })
        })
      })
    })
    
    return options
  }

  private getMockEconomicData(): EconomicData[] {
    return [
      {
        indicator: 'GDP',
        value: 26854.6,
        date: new Date().toISOString(),
        unit: 'Billions USD',
        frequency: 'quarterly',
        source: 'fred'
      },
      {
        indicator: 'CPI',
        value: 307.026,
        date: new Date().toISOString(),
        unit: 'Index',
        frequency: 'monthly',
        source: 'fred'
      },
      {
        indicator: 'UNEMPLOYMENT',
        value: 3.7,
        date: new Date().toISOString(),
        unit: 'Percent',
        frequency: 'monthly',
        source: 'fred'
      }
    ]
  }

  private getMockCryptoData(): CryptoData[] {
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 67234.56,
        change24h: 1234.56,
        changePercent24h: 1.87,
        volume24h: 28500000000,
        marketCap: 1320000000000,
        rank: 1,
        supply: 19600000,
        maxSupply: 21000000
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3456.78,
        change24h: -45.23,
        changePercent24h: -1.29,
        volume24h: 15200000000,
        marketCap: 415000000000,
        rank: 2,
        supply: 120000000
      }
    ]
  }

  private getMockETFData(): ETFData[] {
    return [
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        price: 456.78,
        change: 2.34,
        changePercent: 0.51,
        aum: 380000000000,
        expenseRatio: 0.0945,
        dividend: 1.57
      },
      {
        symbol: 'QQQ',
        name: 'Invesco QQQ Trust',
        price: 378.90,
        change: 1.23,
        changePercent: 0.33,
        aum: 180000000000,
        expenseRatio: 0.20,
        dividend: 0.73
      }
    ]
  }

  private getMockForexData(): ForexData[] {
    return [
      {
        pair: 'EURUSD',
        rate: 1.0856,
        change: 0.0023,
        changePercent: 0.21,
        bid: 1.0855,
        ask: 1.0857,
        high: 1.0890,
        low: 1.0820
      },
      {
        pair: 'GBPUSD',
        rate: 1.2634,
        change: -0.0045,
        changePercent: -0.35,
        bid: 1.2633,
        ask: 1.2635,
        high: 1.2678,
        low: 1.2598
      }
    ]
  }

  private getMockFuturesData(): FuturesData[] {
    return [
      {
        symbol: 'ES',
        name: 'E-mini S&P 500',
        price: 4567.25,
        change: 12.50,
        changePercent: 0.27,
        volume: 2500000,
        openInterest: 3200000,
        expiration: '2024-03-15'
      },
      {
        symbol: 'NQ',
        name: 'E-mini NASDAQ-100',
        price: 15678.75,
        change: -23.25,
        changePercent: -0.15,
        volume: 1800000,
        openInterest: 2100000,
        expiration: '2024-03-15'
      }
    ]
  }

  private getMockBondsData(): BondsData[] {
    return [
      {
        symbol: 'US10Y',
        name: '10-Year Treasury',
        yield: 4.25,
        price: 98.75,
        duration: 8.5,
        maturity: '2034-02-15',
        rating: 'AAA',
        coupon: 4.0
      },
      {
        symbol: 'US2Y',
        name: '2-Year Treasury',
        yield: 4.85,
        price: 99.25,
        duration: 1.9,
        maturity: '2026-02-15',
        rating: 'AAA',
        coupon: 4.5
      }
    ]
  }
}

export const openbbComprehensiveClient = new OpenBBComprehensiveClient(
  process.env.OPENBB_API_URL || 'http://localhost:8000',
  process.env.OPENBB_API_KEY
)

export type {
  StockData,
  OptionsData,
  EconomicData,
  CryptoData,
  ETFData,
  ForexData,
  FuturesData,
  BondsData,
  AlternativeData
}