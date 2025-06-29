import { NextRequest, NextResponse } from "next/server"
import { newsService } from "@/lib/news-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'world'
    const symbol = searchParams.get('symbol')
    const limit = parseInt(searchParams.get('limit') || '20')
    const forceRefresh = searchParams.get('refresh') === 'true'

    let articles
    
    switch (type) {
      case 'company':
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol required for company news' }, { status: 400 })
        }
        articles = await newsService.getCompanyNews(symbol, forceRefresh)
        break
      case 'market':
        articles = await newsService.getMarketNews(forceRefresh)
        break
      case 'world':
      default:
        articles = await newsService.getWorldNews(forceRefresh)
        break
    }

    return NextResponse.json({ 
      articles: articles.slice(0, limit),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}