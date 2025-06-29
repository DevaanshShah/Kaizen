import { NextResponse } from "next/server"
import { openbbComprehensiveClient } from "@/lib/openbb-comprehensive-client"

export async function GET() {
  try {
    const bonds = await openbbComprehensiveClient.getBondsData()

    return NextResponse.json({ 
      data: bonds,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Bonds API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bonds data' },
      { status: 500 }
    )
  }
}