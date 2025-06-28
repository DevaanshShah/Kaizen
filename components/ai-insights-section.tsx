"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Brain, TrendingUp, AlertTriangle, Target, Zap } from "lucide-react"
import { generateMarketSummary, generateStockAnalysis } from "@/lib/api-client"

export function AIInsightsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [marketSummary, setMarketSummary] = useState<string>("")
  const [stockAnalyses, setStockAnalyses] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        const summary = await generateMarketSummary()
        setMarketSummary(summary)

        const stocks = ["AAPL", "GOOGL", "TSLA"]
        const analyses: Record<string, string> = {}

        for (const stock of stocks) {
          try {
            analyses[stock] = await generateStockAnalysis(stock)
          } catch (error) {
            analyses[stock] = `Analysis for ${stock} temporarily unavailable.`
          }
        }

        setStockAnalyses(analyses)
      } catch (error) {
        setMarketSummary("AI market analysis is currently being updated with the latest data.")
      } finally {
        setIsLoading(false)
      }
    }

    if (isInView) {
      fetchAIInsights()
    }
  }, [isInView])

  const aiInsights = [
    {
      icon: Brain,
      title: "AI Market Summary",
      content: marketSummary,
      type: "summary",
      color: "purple",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      content:
        "AI identifies emerging sectors with 15%+ growth potential based on current market patterns and economic indicators.",
      type: "opportunity",
      color: "green",
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      content:
        "Current volatility indicators suggest moderate risk levels. Diversification recommended across tech and traditional sectors.",
      type: "risk",
      color: "yellow",
    },
    {
      icon: Target,
      title: "Price Targets",
      content: "AI-calculated price targets show 8% upside potential for large-cap tech stocks over the next quarter.",
      type: "target",
      color: "blue",
    },
  ]

  return (
    <section ref={ref} id="ai-insights" className="py-16 px-8 bg-gradient-to-r from-purple-950/20 to-blue-950/20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl"
      >
        <div className="flex items-center mb-8">
          <Brain className="w-8 h-8 text-purple-400 mr-3" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI-Powered Market Insights
          </h2>
          <Zap className="w-6 h-6 text-yellow-400 ml-2 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {aiInsights.map((insight, index) => {
            const IconComponent = insight.icon
            const colorClasses = {
              purple: "border-purple-500 bg-purple-900/20",
              green: "border-green-500 bg-green-900/20",
              yellow: "border-yellow-500 bg-yellow-900/20",
              blue: "border-blue-500 bg-blue-900/20",
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`p-6 rounded-lg border-2 ${colorClasses[insight.color as keyof typeof colorClasses]} hover:shadow-lg transition-all`}
              >
                <div className="flex items-center mb-4">
                  <IconComponent className={`w-6 h-6 text-${insight.color}-400 mr-3`} />
                  <h3 className="text-xl font-bold text-white">{insight.title}</h3>
                </div>

                {isLoading && insight.type === "summary" ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                    <span className="text-gray-400 text-sm">AI analyzing market data...</span>
                  </div>
                ) : (
                  <p className="text-gray-300 leading-relaxed">{insight.content}</p>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 text-purple-400 mr-2" />
            AI Stock Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stockAnalyses).map(([symbol, analysis], index) => (
              <motion.div
                key={symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <h4 className="text-lg font-bold text-purple-400 mb-2">{symbol}</h4>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-400"></div>
                    <span className="text-gray-400 text-xs">Analyzing...</span>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
