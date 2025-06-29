"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, TrendingDown, IndianRupee, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: string
  sector: string
  chartData: { date: string; price: number }[]
}

export function IndianStocksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE")
  const [timeFrame, setTimeFrame] = useState<string>("1Y")
  const [isLoading, setIsLoading] = useState(false)

  // Mock Indian stock data - in real app, this would come from an API
  const indianStocks: StockData[] = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      price: 2456.75,
      change: 45.20,
      changePercent: 1.87,
      marketCap: "₹16.6L Cr",
      sector: "Oil & Gas",
      chartData: generateMockChartData(2456.75, timeFrame)
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 3842.30,
      change: -23.45,
      changePercent: -0.61,
      marketCap: "₹14.0L Cr",
      sector: "IT Services",
      chartData: generateMockChartData(3842.30, timeFrame)
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      price: 1687.90,
      change: 12.35,
      changePercent: 0.74,
      marketCap: "₹12.8L Cr",
      sector: "Banking",
      chartData: generateMockChartData(1687.90, timeFrame)
    },
    {
      symbol: "INFY",
      name: "Infosys Ltd",
      price: 1789.45,
      change: 28.70,
      changePercent: 1.63,
      marketCap: "₹7.4L Cr",
      sector: "IT Services",
      chartData: generateMockChartData(1789.45, timeFrame)
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Ltd",
      price: 1156.80,
      change: -8.90,
      changePercent: -0.76,
      marketCap: "₹8.1L Cr",
      sector: "Banking",
      chartData: generateMockChartData(1156.80, timeFrame)
    },
    {
      symbol: "HINDUNILVR",
      name: "Hindustan Unilever Ltd",
      price: 2634.25,
      change: 15.60,
      changePercent: 0.60,
      marketCap: "₹6.2L Cr",
      sector: "FMCG",
      chartData: generateMockChartData(2634.25, timeFrame)
    },
    {
      symbol: "ITC",
      name: "ITC Ltd",
      price: 456.70,
      change: 3.25,
      changePercent: 0.72,
      marketCap: "₹5.7L Cr",
      sector: "FMCG",
      chartData: generateMockChartData(456.70, timeFrame)
    },
    {
      symbol: "SBIN",
      name: "State Bank of India",
      price: 789.30,
      change: -12.45,
      changePercent: -1.55,
      marketCap: "₹7.0L Cr",
      sector: "Banking",
      chartData: generateMockChartData(789.30, timeFrame)
    },
    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel Ltd",
      price: 1234.50,
      change: 18.90,
      changePercent: 1.56,
      marketCap: "₹6.8L Cr",
      sector: "Telecom",
      chartData: generateMockChartData(1234.50, timeFrame)
    },
    {
      symbol: "KOTAKBANK",
      name: "Kotak Mahindra Bank",
      price: 1876.40,
      change: 22.15,
      changePercent: 1.19,
      marketCap: "₹3.7L Cr",
      sector: "Banking",
      chartData: generateMockChartData(1876.40, timeFrame)
    },
    {
      symbol: "LT",
      name: "Larsen & Toubro Ltd",
      price: 3456.80,
      change: -15.30,
      changePercent: -0.44,
      marketCap: "₹4.8L Cr",
      sector: "Construction",
      chartData: generateMockChartData(3456.80, timeFrame)
    },
    {
      symbol: "HCLTECH",
      name: "HCL Technologies Ltd",
      price: 1567.25,
      change: 31.45,
      changePercent: 2.05,
      marketCap: "₹4.2L Cr",
      sector: "IT Services",
      chartData: generateMockChartData(1567.25, timeFrame)
    },
    {
      symbol: "ASIANPAINT",
      name: "Asian Paints Ltd",
      price: 2987.60,
      change: 42.80,
      changePercent: 1.45,
      marketCap: "₹2.9L Cr",
      sector: "Paints",
      chartData: generateMockChartData(2987.60, timeFrame)
    },
    {
      symbol: "MARUTI",
      name: "Maruti Suzuki India Ltd",
      price: 11234.75,
      change: -89.25,
      changePercent: -0.79,
      marketCap: "₹3.4L Cr",
      sector: "Automobile",
      chartData: generateMockChartData(11234.75, timeFrame)
    },
    {
      symbol: "SUNPHARMA",
      name: "Sun Pharmaceutical Industries",
      price: 1678.90,
      change: 25.40,
      changePercent: 1.54,
      marketCap: "₹4.0L Cr",
      sector: "Pharmaceuticals",
      chartData: generateMockChartData(1678.90, timeFrame)
    }
  ]

  function generateMockChartData(currentPrice: number, period: string) {
    const dataPoints = period === "6M" ? 180 : period === "1Y" ? 365 : period === "3Y" ? 1095 : 1825
    const data = []
    let price = currentPrice * 0.8 // Start from 80% of current price
    
    for (let i = 0; i < dataPoints; i++) {
      const volatility = 0.02 // 2% daily volatility
      const trend = 0.0002 // Slight upward trend
      const randomChange = (Math.random() - 0.5) * volatility
      price = price * (1 + trend + randomChange)
      
      const date = new Date()
      date.setDate(date.getDate() - (dataPoints - i))
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100
      })
    }
    
    // Ensure the last price matches current price
    data[data.length - 1].price = currentPrice
    
    return data
  }

  const selectedStockData = indianStocks.find(stock => stock.symbol === selectedStock)
  const timeFrames = ["6M", "1Y", "3Y", "5Y"]

  useEffect(() => {
    setIsLoading(true)
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [selectedStock, timeFrame])

  return (
    <section ref={ref} id="indian-stocks" className="py-16 px-8 bg-gradient-to-r from-orange-950/20 to-green-950/20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center mb-8">
          <IndianRupee className="w-8 h-8 text-orange-400 mr-3" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Indian Stock Market
          </h2>
          <BarChart3 className="w-6 h-6 text-green-400 ml-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stock List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Top Indian Stocks</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
              {indianStocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => setSelectedStock(stock.symbol)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-102 ${
                    selectedStock === stock.symbol
                      ? "border-orange-500 bg-orange-900/20"
                      : "border-gray-700 bg-gray-900/50 hover:border-orange-400"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{stock.symbol}</h4>
                      <p className="text-gray-400 text-xs truncate">{stock.name}</p>
                      <p className="text-gray-500 text-xs">{stock.sector}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono text-sm">₹{stock.price.toLocaleString()}</div>
                      <div className={`text-xs font-semibold flex items-center ${
                        stock.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Market Cap: {stock.marketCap}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-2">
            {selectedStockData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedStockData.symbol}</h3>
                    <p className="text-gray-400 mb-1">{selectedStockData.name}</p>
                    <p className="text-sm text-gray-500">{selectedStockData.sector}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-3xl font-mono font-bold text-white">
                        ₹{selectedStockData.price.toLocaleString()}
                      </span>
                      <div className={`ml-4 flex items-center ${
                        selectedStockData.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {selectedStockData.change >= 0 ? (
                          <TrendingUp className="w-5 h-5 mr-1" />
                        ) : (
                          <TrendingDown className="w-5 h-5 mr-1" />
                        )}
                        <span className="font-semibold">
                          {selectedStockData.change >= 0 ? "+" : ""}
                          {selectedStockData.change.toFixed(2)} ({selectedStockData.changePercent >= 0 ? "+" : ""}
                          {selectedStockData.changePercent}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time Frame Buttons */}
                  <div className="flex space-x-2">
                    {timeFrames.map((frame) => (
                      <Button
                        key={frame}
                        onClick={() => setTimeFrame(frame)}
                        variant={timeFrame === frame ? "default" : "outline"}
                        size="sm"
                        className={`${
                          timeFrame === frame
                            ? "bg-orange-600 hover:bg-orange-700 text-white"
                            : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        {frame}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                      <div className="text-gray-400">Loading chart...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedStockData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                          }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#F9FAFB"
                          }}
                          formatter={(value: any) => [`₹${value.toLocaleString()}`, "Price"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={selectedStockData.change >= 0 ? "#10B981" : "#EF4444"}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: selectedStockData.change >= 0 ? "#10B981" : "#EF4444" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Additional Info */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="text-white font-semibold ml-2">{selectedStockData.marketCap}</span>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-gray-400">Sector:</span>
                    <span className="text-white font-semibold ml-2">{selectedStockData.sector}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}