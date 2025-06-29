"use client"

import { motion } from "framer-motion"
import { Globe3D } from "@/components/globe-3d"
import { AIMarketChat } from "@/components/ai-market-chat"

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed left-0 top-16 bottom-0 w-80 bg-gradient-to-b from-gray-900 via-purple-900/20 to-black border-r border-gray-800 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        <div className="p-6 flex-shrink-0">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
          >
            AI Market Intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-400 text-sm"
          >
            Powered by Groq AI for real-time analysis
          </motion.p>
        </div>

        <div className="flex-1 relative min-h-0">
          <Globe3D />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex-1 min-h-0 p-6 border-t border-gray-800"
        >
          <AIMarketChat />
        </motion.div>
      </div>
    </motion.aside>
  )
}