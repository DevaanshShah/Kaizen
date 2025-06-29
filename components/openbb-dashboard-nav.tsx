"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Coins, 
  PieChart, 
  Globe, 
  Activity, 
  Landmark, 
  Building,
  Brain,
  Zap,
  ExternalLink
} from "lucide-react"

interface DashboardNavProps {
  onNavigate: (section: string) => void
  currentSection: string
}

export function OpenBBDashboardNav({ onNavigate, currentSection }: DashboardNavProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-400' },
    { id: 'stocks', label: 'Stocks', icon: TrendingUp, color: 'text-green-400' },
    { id: 'crypto', label: 'Crypto', icon: Coins, color: 'text-orange-400' },
    { id: 'etfs', label: 'ETFs', icon: PieChart, color: 'text-purple-400' },
    { id: 'forex', label: 'Forex', icon: Globe, color: 'text-yellow-400' },
    { id: 'futures', label: 'Futures', icon: Activity, color: 'text-red-400' },
    { id: 'bonds', label: 'Bonds', icon: Landmark, color: 'text-indigo-400' },
    { id: 'economic', label: 'Economic', icon: Building, color: 'text-cyan-400' },
  ]

  return (
    <div className="bg-gray-900 border-r border-gray-800 w-64 min-h-screen p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-8 h-8 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Kaizen AI</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Zap className="w-3 h-3 mr-1" />
            OpenBB Powered
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentSection === item.id
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">OpenBB Status</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            Connected to OpenBB Platform
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs border-gray-600 hover:bg-gray-700"
            onClick={() => window.open('http://localhost:8000/docs', '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            API Docs
          </Button>
        </div>
      </div>
    </div>
  )
}