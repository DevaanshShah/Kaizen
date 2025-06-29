"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                BREAKING
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Federal Reserve Signals Potential Rate Cut as Inflation Shows Signs of Cooling
            </h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Markets rally as latest economic data suggests the central bank may pivot from its aggressive tightening stance, with key inflation metrics falling below expectations for the second consecutive month.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>By Sarah Johnson</span>
              <span className="mx-2">•</span>
              <span>2 hours ago</span>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
              <div className="space-y-4">
                {[
                  { name: "S&P 500", value: "4,567.89", change: "+1.2%", positive: true },
                  { name: "Dow Jones", value: "34,567.12", change: "+0.8%", positive: true },
                  { name: "NASDAQ", value: "14,234.56", change: "-0.3%", positive: false },
                  { name: "Russell 2000", value: "1,987.45", change: "+2.1%", positive: true },
                ].map((market, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{market.name}</div>
                      <div className="text-sm text-gray-500">{market.value}</div>
                    </div>
                    <div className={`flex items-center ${market.positive ? "text-green-600" : "text-red-600"}`}>
                      {market.positive ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">{market.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}