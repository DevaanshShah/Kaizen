import { NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET() {
  try {
    const forex = await openbbComprehensiveClient.getForexRates([
      'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD', 'AUDUSD', 'NZDUSD', 'USDCHF', 'EURGBP'
    ])

    return NextResponse.json({ 
      data: forex,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Forex API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forex data' },
      { status: 500 }
    )
  }
}