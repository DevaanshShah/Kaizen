import { NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET() {
  try {
    const etfs = await openbbComprehensiveClient.getETFData([
      'SPY', 'QQQ', 'IWM', 'VTI', 'VEA', 'VWO', 'AGG', 'LQD', 'HYG', 'TLT'
    ])

    return NextResponse.json({ 
      data: etfs,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('ETFs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ETFs data' },
      { status: 500 }
    )
  }
}