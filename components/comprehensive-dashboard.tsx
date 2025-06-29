"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Activity,
  Globe,
  Coins,
  Building,
  Landmark,
  Zap,
  Search,
  RefreshCw,
  Brain
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import type { 
  StockData, 
  OptionsData, 
  EconomicData, 
  CryptoData, 
  ETFData, 
  ForexData, 
  FuturesData, 
  BondsData 
} from "@/lib/openbb-comprehensive-client"

interface DashboardData {
  stocks: StockData[]
  options: OptionsData[]
  economic: EconomicData[]
  crypto: CryptoData[]
  etfs: ETFData[]
  forex: ForexData[]
  futures: FuturesData[]
  bonds: BondsData[]
}

export function ComprehensiveDashboard() {
  const [data, setData] = useState<DashboardData>({
    stocks: [],
    options: [],
    economic: [],
    crypto: [],
    etfs: [],
    forex: [],
    futures: [],
    bonds: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [
        stocksRes,
        cryptoRes,
        etfsRes,
        forexRes,
        futuresRes,
        bondsRes,
        economicRes
      ] = await Promise.all([
        fetch('/api/openbb/stocks'),
        fetch('/api/openbb/crypto'),
        fetch('/api/openbb/etfs'),
        fetch('/api/openbb/forex'),
        fetch('/api/openbb/futures'),
        fetch('/api/openbb/bonds'),
        fetch('/api/openbb/economic')
      ])

      const [stocks, crypto, etfs, forex, futures, bonds, economic] = await Promise.all([
        stocksRes.json(),
        cryptoRes.json(),
        etfsRes.json(),
        forexRes.json(),
        futuresRes.json(),
        bondsRes.json(),
        economicRes.json()
      ])

      setData({
        stocks: stocks.data || [],
        crypto: crypto.data || [],
        etfs: etfs.data || [],
        forex: forex.data || [],
        futures: futures.data || [],
        bonds: bonds.data || [],
        economic: economic.data || [],
        options: [] // Will be loaded separately when needed
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Kaizen Financial Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Comprehensive market intelligence powered by OpenBB</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search symbols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Button
              onClick={fetchAllData}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-900 border border-gray-800">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Crypto</span>
            </TabsTrigger>
            <TabsTrigger value="etfs" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>ETFs</span>
            </TabsTrigger>
            <TabsTrigger value="forex" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Forex</span>
            </TabsTrigger>
            <TabsTrigger value="futures" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Futures</span>
            </TabsTrigger>
            <TabsTrigger value="bonds" className="flex items-center space-x-2">
              <Landmark className="w-4 h-4" />
              <span>Bonds</span>
            </TabsTrigger>
            <TabsTrigger value="economic" className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Economic</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Market Summary Cards */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Market Cap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatLargeNumber(data.stocks.reduce((sum, stock) => sum + stock.marketCap, 0))}
                  </div>
                  <div className="flex items-center text-green-400 text-sm mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.4% from yesterday
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Crypto Market</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatLargeNumber(data.crypto.reduce((sum, crypto) => sum + crypto.marketCap, 0))}
                  </div>
                  <div className="flex items-center text-red-400 text-sm mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -1.2% from yesterday
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">ETF Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatLargeNumber(data.etfs.reduce((sum, etf) => sum + etf.aum, 0))}
                  </div>
                  <div className="flex items-center text-green-400 text-sm mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.8% from yesterday
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Symbols</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {data.stocks.length + data.crypto.length + data.etfs.length}
                  </div>
                  <div className="flex items-center text-blue-400 text-sm mt-1">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Monitored
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Stock Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.stocks
                      .sort((a, b) => b.changePercent - a.changePercent)
                      .slice(0, 5)
                      .map((stock, index) => (
                        <div key={stock.symbol} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            <div>
                              <div className="font-semibold text-white">{stock.symbol}</div>
                              <div className="text-xs text-gray-400">{stock.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">{formatCurrency(stock.price)}</div>
                            <div className={`text-xs ${getChangeColor(stock.changePercent)}`}>
                              {formatPercent(stock.changePercent)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Crypto Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.crypto
                      .sort((a, b) => b.changePercent24h - a.changePercent24h)
                      .slice(0, 5)
                      .map((crypto, index) => (
                        <div key={crypto.symbol} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            <div>
                              <div className="font-semibold text-white">{crypto.symbol}</div>
                              <div className="text-xs text-gray-400">{crypto.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">{formatCurrency(crypto.price)}</div>
                            <div className={`text-xs ${getChangeColor(crypto.changePercent24h)}`}>
                              {formatPercent(crypto.changePercent24h)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stocks Tab */}
          <TabsContent value="stocks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.stocks.map((stock) => (
                <Card key={stock.symbol} className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{stock.symbol}</CardTitle>
                        <CardDescription className="text-gray-400">{stock.name}</CardDescription>
                      </div>
                      <Badge variant={stock.changePercent >= 0 ? "default" : "destructive"}>
                        {stock.sector}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{formatCurrency(stock.price)}</span>
                        <div className={`flex items-center space-x-1 ${getChangeColor(stock.changePercent)}`}>
                          {getChangeIcon(stock.changePercent)}
                          <span className="font-semibold">{formatPercent(stock.changePercent)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Market Cap:</span>
                          <div className="font-semibold text-white">{formatLargeNumber(stock.marketCap)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Volume:</span>
                          <div className="font-semibold text-white">{stock.volume.toLocaleString()}</div>
                        </div>
                        {stock.pe && (
                          <div>
                            <span className="text-gray-400">P/E:</span>
                            <div className="font-semibold text-white">{stock.pe.toFixed(2)}</div>
                          </div>
                        )}
                        {stock.dividend && (
                          <div>
                            <span className="text-gray-400">Dividend:</span>
                            <div className="font-semibold text-white">{stock.dividend.toFixed(2)}%</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.crypto.map((crypto) => (
                <Card key={crypto.symbol} className="bg-gray-900 border-gray-800 hover:border-blue-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{crypto.symbol}</CardTitle>
                        <CardDescription className="text-gray-400">{crypto.name}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        #{crypto.rank}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{formatCurrency(crypto.price)}</span>
                        <div className={`flex items-center space-x-1 ${getChangeColor(crypto.changePercent24h)}`}>
                          {getChangeIcon(crypto.changePercent24h)}
                          <span className="font-semibold">{formatPercent(crypto.changePercent24h)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Market Cap:</span>
                          <div className="font-semibold text-white">{formatLargeNumber(crypto.marketCap)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">24h Volume:</span>
                          <div className="font-semibold text-white">{formatLargeNumber(crypto.volume24h)}</div>
                        </div>
                        {crypto.supply && (
                          <div>
                            <span className="text-gray-400">Supply:</span>
                            <div className="font-semibold text-white">{crypto.supply.toLocaleString()}</div>
                          </div>
                        )}
                        {crypto.maxSupply && (
                          <div>
                            <span className="text-gray-400">Max Supply:</span>
                            <div className="font-semibold text-white">{crypto.maxSupply.toLocaleString()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ETFs Tab */}
          <TabsContent value="etfs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.etfs.map((etf) => (
                <Card key={etf.symbol} className="bg-gray-900 border-gray-800 hover:border-green-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{etf.symbol}</CardTitle>
                        <CardDescription className="text-gray-400">{etf.name}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        ETF
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{formatCurrency(etf.price)}</span>
                        <div className={`flex items-center space-x-1 ${getChangeColor(etf.changePercent)}`}>
                          {getChangeIcon(etf.changePercent)}
                          <span className="font-semibold">{formatPercent(etf.changePercent)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">AUM:</span>
                          <div className="font-semibold text-white">{formatLargeNumber(etf.aum)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Expense Ratio:</span>
                          <div className="font-semibold text-white">{etf.expenseRatio.toFixed(2)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Dividend:</span>
                          <div className="font-semibold text-white">{etf.dividend.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Forex Tab */}
          <TabsContent value="forex" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.forex.map((pair) => (
                <Card key={pair.pair} className="bg-gray-900 border-gray-800 hover:border-yellow-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{pair.pair}</CardTitle>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        FX
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{pair.rate.toFixed(4)}</span>
                        <div className={`flex items-center space-x-1 ${getChangeColor(pair.changePercent)}`}>
                          {getChangeIcon(pair.changePercent)}
                          <span className="font-semibold">{formatPercent(pair.changePercent)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Bid:</span>
                          <div className="font-semibold text-white">{pair.bid.toFixed(4)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Ask:</span>
                          <div className="font-semibold text-white">{pair.ask.toFixed(4)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">High:</span>
                          <div className="font-semibold text-white">{pair.high.toFixed(4)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Low:</span>
                          <div className="font-semibold text-white">{pair.low.toFixed(4)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Futures Tab */}
          <TabsContent value="futures" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.futures.map((future) => (
                <Card key={future.symbol} className="bg-gray-900 border-gray-800 hover:border-orange-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{future.symbol}</CardTitle>
                        <CardDescription className="text-gray-400">{future.name}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-orange-400 border-orange-400">
                        Futures
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{formatCurrency(future.price)}</span>
                        <div className={`flex items-center space-x-1 ${getChangeColor(future.changePercent)}`}>
                          {getChangeIcon(future.changePercent)}
                          <span className="font-semibold">{formatPercent(future.changePercent)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Volume:</span>
                          <div className="font-semibold text-white">{future.volume.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Open Interest:</span>
                          <div className="font-semibold text-white">{future.openInterest.toLocaleString()}</div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Expiration:</span>
                          <div className="font-semibold text-white">{future.expiration}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bonds Tab */}
          <TabsContent value="bonds" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.bonds.map((bond) => (
                <Card key={bond.symbol} className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{bond.symbol}</CardTitle>
                        <CardDescription className="text-gray-400">{bond.name}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-indigo-400 border-indigo-400">
                        {bond.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{bond.yield.toFixed(2)}%</span>
                        <span className="text-lg font-semibold text-gray-300">{formatCurrency(bond.price)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <div className="font-semibold text-white">{bond.duration.toFixed(1)} years</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Coupon:</span>
                          <div className="font-semibold text-white">{bond.coupon.toFixed(2)}%</div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Maturity:</span>
                          <div className="font-semibold text-white">{bond.maturity}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Economic Tab */}
          <TabsContent value="economic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.economic.map((indicator, index) => (
                <Card key={`${indicator.indicator}-${index}`} className="bg-gray-900 border-gray-800 hover:border-cyan-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{indicator.indicator}</CardTitle>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {indicator.frequency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-white">
                        {typeof indicator.value === 'number' 
                          ? indicator.value.toLocaleString() 
                          : indicator.value
                        }
                      </div>
                      <div className="text-sm text-gray-400">{indicator.unit}</div>
                      <div className="text-xs text-gray-500">
                        Source: {indicator.source.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {new Date(indicator.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}