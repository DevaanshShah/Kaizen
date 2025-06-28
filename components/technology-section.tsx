"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Brain, Cpu, Zap, Shield, Bot, Network } from "lucide-react"

export function TechnologySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const techTrends = [
    {
      icon: Brain,
      title: "AI Trading Algorithms",
      description: "Advanced machine learning models that adapt to market conditions in real-time.",
      growth: "+67%",
      aiPowered: true,
    },
    {
      icon: Bot,
      title: "Automated Analysis",
      description: "AI-powered systems that process thousands of data points per second.",
      growth: "+45%",
      aiPowered: true,
    },
    {
      icon: Network,
      title: "Neural Networks",
      description: "Deep learning architectures that identify complex market patterns.",
      growth: "+52%",
      aiPowered: true,
    },
    {
      icon: Zap,
      title: "Quantum Computing",
      description: "Next-generation processing power for ultra-fast market calculations.",
      growth: "+89%",
      aiPowered: false,
    },
    {
      icon: Shield,
      title: "AI Security",
      description: "Intelligent threat detection and automated risk management systems.",
      growth: "+38%",
      aiPowered: true,
    },
    {
      icon: Cpu,
      title: "Edge Computing",
      description: "Distributed processing for low-latency trading and analysis.",
      growth: "+41%",
      aiPowered: false,
    },
  ]

  return (
    <section ref={ref} id="technology" className="py-16 px-8 bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl"
      >
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mr-4">AI Technology Stack</h2>
          <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techTrends.map((trend, index) => {
            const IconComponent = trend.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-purple-500 transition-all text-center group relative overflow-hidden"
              >
                {trend.aiPowered && (
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center bg-purple-600 px-2 py-1 rounded-full">
                      <Brain className="w-3 h-3 text-white mr-1" />
                      <span className="text-xs text-white">AI</span>
                    </div>
                  </div>
                )}

                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 group-hover:scale-110 transition-transform ${
                    trend.aiPowered ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-blue-600"
                  }`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {trend.title}
                </h3>

                <p className="text-gray-300 mb-4 text-sm leading-relaxed">{trend.description}</p>

                <div className="text-2xl font-bold text-green-400 mb-1">{trend.growth}</div>
                <div className="text-xs text-gray-400">Market Growth</div>

                {trend.aiPowered && (
                  <div className="mt-3 flex items-center justify-center text-purple-400 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    AI-Powered Technology
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
