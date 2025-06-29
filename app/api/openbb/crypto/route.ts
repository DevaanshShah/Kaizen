import { NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET() {
  try {
    const crypto = await openbbComprehensiveClient.getCryptoQuotes([
      'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'MATIC', 'AVAX'
    ])

    return NextResponse.json({ 
      data: crypto,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Crypto API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crypto data' },
      { status: 500 }
    )
  }
}