import { NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET() {
  try {
    const futures = await openbbComprehensiveClient.getFuturesData([
      'ES', 'NQ', 'YM', 'RTY', 'CL', 'NG', 'GC', 'SI', 'ZN', 'ZB'
    ])

    return NextResponse.json({ 
      data: futures,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Futures API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch futures data' },
      { status: 500 }
    )
  }
}