"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

export function MarketsSection() {
  const marketData = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$175.43", change: "+2.1%", positive: true },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "$2,847.63", change: "+1.8%", positive: true },
    { symbol: "MSFT", name: "Microsoft Corp.", price: "$378.85", change: "+0.9%", positive: true },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: "$3,467.42", change: "-0.5%", positive: false },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$1,067.20", change: "+3.2%", positive: true },
    { symbol: "META", name: "Meta Platforms", price: "$487.11", change: "+1.4%", positive: true },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Market Movers</h2>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">View all markets →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketData.map((stock, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stock.symbol}</h3>
                  <p className="text-sm text-gray-600">{stock.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{stock.price}</div>
                  <div className={`text-sm font-medium flex items-center ${
                    stock.positive ? "text-green-600" : "text-red-600"
                  }`}>
                    {stock.positive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {stock.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}