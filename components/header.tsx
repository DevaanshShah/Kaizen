"use client"

import { motion } from "framer-motion"
import { Search, Bell, User, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 text-2xl font-bold">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">KAIZEN</span>
            <span className="text-xs bg-purple-600 px-2 py-1 rounded-full text-white">AI</span>
          </motion.div>
          <nav className="hidden md:flex space-x-6">
            {["Markets", "Indian Stocks", "Technology", "Analysis", "News"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ color: "#a855f7" }}
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Ask AI about markets, stocks, trends..."
              className="pl-10 w-80 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}