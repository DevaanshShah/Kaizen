import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile", { apiKey: GROQ_API_KEY }),
      prompt: `You are Kaizen AI, an expert financial market analyst with deep knowledge of stocks, cryptocurrencies, market trends, and economic indicators. 

User query: "${query}"

Provide a concise, insightful analysis (2-3 sentences max) that includes:
- Relevant market data or trends
- Actionable insights
- Professional tone suitable for financial professionals

Keep responses brief but valuable, focusing on current market conditions and data-driven insights.`,
      maxTokens: 150,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Groq API error:", error)
    return NextResponse.json({ error: "Failed to generate market insight" }, { status: 500 })
  }
}
