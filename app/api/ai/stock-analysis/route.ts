import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { symbol } = await request.json()

    if (!symbol) {
      return NextResponse.json({ error: "Stock symbol is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile", { apiKey: GROQ_API_KEY }),
      prompt: `As Kaizen AI, analyze ${symbol} stock:
- Current performance and trends
- Key factors affecting the stock
- Short-term outlook
- Risk assessment

Provide a concise professional analysis (2-3 sentences).`,
      maxTokens: 150,
      temperature: 0.7,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Groq API error:", error)
    return NextResponse.json({ error: "Failed to analyze stock" }, { status: 500 })
  }
}
