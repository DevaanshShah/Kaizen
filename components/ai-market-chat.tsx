"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Brain, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateMarketInsight } from "@/lib/api-client"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function AIMarketChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm your AI market analyst. Ask me about stocks, trends, or market predictions.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const aiResponse = await generateMarketInsight(input)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error analyzing the market data. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "What's the market outlook?",
    "Analyze AAPL stock",
    "Crypto predictions",
    "Tech sector trends",
  ]

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Messages Container with proper scrolling */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
          <div className="space-y-3 pb-2">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-200 border border-gray-700"
                    }`}
                  >
                    {message.type === "ai" && (
                      <div className="flex items-center mb-1">
                        <Brain className="w-3 h-3 text-purple-400 mr-1" />
                        <span className="text-xs text-purple-400">AI Analyst</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-3 h-3 text-purple-400 animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-2 flex-shrink-0">
        <div className="flex flex-wrap gap-1">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInput(question)}
              className="text-xs bg-gray-800 border-gray-700 hover:bg-purple-600 hover:border-purple-500"
            >
              {question}
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about markets..."
            className="flex-1 bg-gray-800 border-gray-700 text-white text-sm focus:border-purple-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Market Data Section */}
      <div className="space-y-2 pt-2 border-t border-gray-800 flex-shrink-0">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Live Market Data</span>
          <TrendingUp className="w-3 h-3 text-green-400" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">S&P 500</span>
            <span className="text-green-400 font-mono">+1.2%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">NASDAQ</span>
            <span className="text-green-400 font-mono">+0.8%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">DOW</span>
            <span className="text-red-400 font-mono">-0.3%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
