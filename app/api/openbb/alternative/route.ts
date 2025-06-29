import { NextRequest, NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'AAPL'
    const type = searchParams.get('type') || 'insider_trading'

    let data
    switch (type) {
      case 'insider_trading':
        data = await openbbComprehensiveClient.getInsiderTrading(symbol)
        break
      case 'short_interest':
        data = await openbbComprehensiveClient.getShortInterest(symbol)
        break
      case 'social_sentiment':
        data = await openbbComprehensiveClient.getSocialSentiment(symbol)
        break
      default:
        throw new Error('Invalid alternative data type')
    }

    return NextResponse.json({ 
      data,
      symbol,
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Alternative data API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alternative data' },
      { status: 500 }
    )
  }
}