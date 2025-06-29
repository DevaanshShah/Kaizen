"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Brain, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateStockAnalysis } from "@/lib/api-client"

export function MarketsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const marketData = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$175.43", change: "+2.1%", positive: true, aiScore: 8.7 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "$2,847.63", change: "+1.8%", positive: true, aiScore: 9.2 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: "$378.85", change: "+0.9%", positive: true, aiScore: 8.9 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: "$3,467.42", change: "-0.5%", positive: false, aiScore: 7.8 },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$1,067.20", change: "+3.2%", positive: true, aiScore: 8.1 },
    { symbol: "META", name: "Meta Platforms", price: "$487.11", change: "+1.4%", positive: true, aiScore: 8.4 },
  ]

  const handleAIAnalysis = async (symbol: string) => {
    setSelectedStock(symbol)
    setIsAnalyzing(true)
    setAiAnalysis("")

    try {
      const analysis = await generateStockAnalysis(symbol)
      setAiAnalysis(analysis)
    } catch (error) {
      setAiAnalysis("AI analysis temporarily unavailable. Please try again later.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section ref={ref} id="markets" className="py-16 px-8 bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl"
      >
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mr-4">AI Market Analysis</h2>
          <Brain className="w-6 h-6 text-purple-400" />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {marketData.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-purple-500 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                  <p className="text-gray-400 text-sm">{stock.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-white">{stock.price}</div>
                  <div className={`text-sm font-semibold ${stock.positive ? "text-green-400" : "text-red-400"}`}>
                    {stock.change}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Brain className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm text-purple-400">AI Score: {stock.aiScore}/10</span>
                </div>
                {stock.positive ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>

              <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${stock.aiScore * 10}%` } : {}}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>

              <Button
                onClick={() => handleAIAnalysis(stock.symbol)}
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Get AI Analysis
              </Button>
            </motion.div>
          ))}
        </div>

        {selectedStock && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-lg border border-purple-500"
          >
            <div className="flex items-center mb-4">
              <Brain className="w-5 h-5 text-purple-400 mr-2" />
              <h3 className="text-xl font-bold text-white">AI Analysis: {selectedStock}</h3>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                <span className="text-gray-300">Kaizen AI is analyzing market data and trends...</span>
              </div>
            ) : (
              <p className="text-gray-300 leading-relaxed">{aiAnalysis}</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}