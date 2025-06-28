"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Twitter, Linkedin, Facebook, Youtube, Brain, Zap } from "lucide-react"

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <footer ref={ref} className="py-16 px-8 bg-black border-t border-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Brain className="w-8 h-8 text-purple-400 mr-2" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                KAIZEN
              </h3>
              <span className="text-xs bg-purple-600 px-2 py-1 rounded-full text-white ml-2">AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The world's most advanced AI-powered financial intelligence platform. Transforming markets through
              artificial intelligence.
            </p>
            <div className="flex items-center mt-3 text-purple-400 text-sm">
              <Zap className="w-4 h-4 mr-1" />
              Powered by Groq AI
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">AI Features</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Market Predictions",
                "Risk Analysis",
                "Portfolio Optimization",
                "Real-time Insights",
                "Pattern Recognition",
              ].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    whileHover={{ color: "#a855f7", x: 5 }}
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <Brain className="w-3 h-3 mr-2" />
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Markets</h4>
            <ul className="space-y-2 text-sm">
              {[
                "AI Stock Analysis",
                "Crypto Intelligence",
                "Forex Predictions",
                "Commodities AI",
                "Bond Analytics",
              ].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    whileHover={{ color: "#60a5fa", x: 5 }}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              {[Twitter, Linkedin, Facebook, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, color: "#a855f7" }}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              <p>AI-powered insights</p>
              <p>24/7 market analysis</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">
            © 2024 Kaizen AI. Revolutionizing finance through artificial intelligence.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["AI Ethics", "Privacy Policy", "Terms of Service", "API Access"].map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ color: "#a855f7" }}
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
