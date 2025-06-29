import { NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET() {
  try {
    // Get stock screener data for major stocks
    const stocks = await openbbComprehensiveClient.getStockScreener({
      market_cap_more_than: 1000000000, // $1B+ market cap
      limit: 20
    })

    return NextResponse.json({ 
      data: stocks,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Stocks API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stocks data' },
      { status: 500 }
    )
  }
}