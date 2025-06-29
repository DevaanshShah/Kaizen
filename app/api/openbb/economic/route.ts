import { NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET() {
  try {
    const economic = await openbbComprehensiveClient.getEconomicIndicators([
      'GDP', 'CPI', 'UNEMPLOYMENT', 'INFLATION', 'INTEREST_RATE', 'RETAIL_SALES'
    ])

    return NextResponse.json({ 
      data: economic,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Economic API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch economic data' },
      { status: 500 }
    )
  }
}