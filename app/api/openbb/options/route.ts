import { NextRequest, NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'AAPL'

    const options = await openbbComprehensiveClient.getOptionsChain(symbol)

    return NextResponse.json({ 
      data: options,
      symbol,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Options API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch options data' },
      { status: 500 }
    )
  }
}