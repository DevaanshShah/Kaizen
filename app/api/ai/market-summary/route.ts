import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function GET() {
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile", { apiKey: GROQ_API_KEY }),
      prompt: `As Kaizen AI, provide a brief market summary for today including:
- Overall market sentiment
- Key sector performances
- Notable stock movements
- Economic indicators to watch

Keep it concise and professional (3-4 sentences).`,
      maxTokens: 200,
      temperature: 0.6,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Groq API error:", error)
    return NextResponse.json(
      { summary: "Market analysis temporarily unavailable. Our AI systems are processing the latest data." },
      { status: 200 },
    )
  }
}
