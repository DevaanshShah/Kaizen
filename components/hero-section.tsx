"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="pt-24 pb-12 px-8">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Brain className="w-12 h-12 text-purple-400 mr-4" />
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">AI-POWERED</span>
              <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-400 bg-clip-text text-transparent">
            AI Predicts Market Rally as Tech Innovation Accelerates
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            Kaizen AI analyzes millions of data points to predict market movements with 87% accuracy. Our advanced
            algorithms identify emerging opportunities before traditional analysis.
          </p>

          <div className="flex space-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
              <Brain className="w-4 h-4 mr-2" />
              Get AI Analysis
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-3 bg-transparent"
            >
              View Predictions
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-3 gap-6 mb-12"
        >
          {[
            { name: "S&P 500", value: "4,567.89", change: "+1.2%", positive: true, aiConfidence: "94%" },
            { name: "NASDAQ", value: "14,234.56", change: "+0.8%", positive: true, aiConfidence: "91%" },
            { name: "DOW", value: "34,567.12", change: "-0.3%", positive: false, aiConfidence: "87%" },
          ].map((market, index) => (
            <motion.div
              key={market.name}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">{market.name}</h3>
                {market.positive ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="text-2xl font-mono font-bold text-white mb-1">{market.value}</div>
              <div className={`text-sm font-semibold mb-2 ${market.positive ? "text-green-400" : "text-red-400"}`}>
                {market.change}
              </div>
              <div className="flex items-center text-xs">
                <Brain className="w-3 h-3 text-purple-400 mr-1" />
                <span className="text-purple-400">AI Confidence: {market.aiConfidence}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}