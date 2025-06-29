"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Clock, User, Brain, Sparkles } from "lucide-react"

export function NewsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const newsArticles = [
    {
      title: "AI Revolution Drives Tech Stocks to New Heights",
      excerpt:
        "Major technology companies are experiencing unprecedented growth as artificial intelligence adoption accelerates across industries.",
      author: "AI Research Team",
      time: "2 hours ago",
      category: "AI Technology",
      aiGenerated: true,
    },
    {
      title: "Federal Reserve Signals Potential Rate Changes",
      excerpt:
        "The Federal Reserve hints at monetary policy adjustments in response to evolving economic conditions.",
      author: "Economic Analyst",
      time: "4 hours ago",
      category: "Economics",
      aiGenerated: false,
    },
    {
      title: "Cryptocurrency Market Shows Strong Recovery",
      excerpt:
        "Digital assets rebound as institutional adoption continues to grow worldwide.",
      author: "Crypto Reporter",
      time: "6 hours ago",
      category: "Cryptocurrency",
      aiGenerated: false,
    },
    {
      title: "Energy Sector Faces New Regulatory Challenges",
      excerpt:
        "New environmental regulations are reshaping the energy landscape and investment strategies.",
      author: "Industry Expert",
      time: "8 hours ago",
      category: "Energy",
      aiGenerated: false,
    },
  ]

  return (
    <section ref={ref} className="py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl"
      >
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mr-4">AI-Enhanced News</h2>
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsArticles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500 transition-all cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        article.aiGenerated ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
                      }`}
                    >
                      {article.category}
                    </span>
                    {article.aiGenerated && (
                      <div className="flex items-center">
                        <Brain className="w-3 h-3 text-purple-400 mr-1" />
                        <span className="text-xs text-purple-400">AI Generated</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.time}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {article.title}
                </h3>

                <p className="text-gray-300 mb-4 leading-relaxed">{article.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400 text-sm">
                    <User className="w-4 h-4 mr-2" />
                    {article.author}
                  </div>
                  {article.aiGenerated && (
                    <div className="flex items-center text-purple-400 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Insights
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}