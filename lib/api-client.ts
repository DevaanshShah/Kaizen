export async function generateMarketInsight(query: string): Promise<string> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch AI response")
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("API client error:", error)
    throw new Error("Failed to generate market insight")
  }
}

export async function generateMarketSummary(): Promise<string> {
  try {
    const response = await fetch("/api/ai/market-summary")

    if (!response.ok) {
      throw new Error("Failed to fetch market summary")
    }

    const data = await response.json()
    return data.summary
  } catch (error) {
    console.error("API client error:", error)
    return "Market analysis temporarily unavailable. Our AI systems are processing the latest data."
  }
}

export async function generateStockAnalysis(symbol: string): Promise<string> {
  try {
    const response = await fetch("/api/ai/stock-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch stock analysis")
    }

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error("API client error:", error)
    throw new Error("Failed to analyze stock")
  }
}
