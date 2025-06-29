# OpenBB News Integration

This integration connects your Kaizen AI platform with OpenBB's news APIs to provide real-time financial news and market updates.

## Features

- **Live News Feed**: Real-time financial news from multiple sources
- **Sentiment Analysis**: AI-powered sentiment scoring for news articles
- **Company-Specific News**: Get news for specific stocks and companies
- **Market News**: Aggregated market news from major financial sources
- **Search & Filtering**: Search news by keywords and filter by sentiment
- **Auto-Refresh**: Automatic news updates every 5 minutes
- **Caching**: Intelligent caching to reduce API calls and improve performance

## Setup Instructions

### 1. Install OpenBB Platform

```bash
# Install OpenBB Platform
pip install openbb

# Or using conda
conda install -c conda-forge openbb
```

### 2. Start OpenBB API Server

```bash
# Start the OpenBB API server
openbb-api --host 0.0.0.0 --port 8000

# Or with authentication
openbb-api --host 0.0.0.0 --port 8000 --api-key your-api-key
```

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# OpenBB Configuration
OPENBB_API_URL=http://localhost:8000
OPENBB_API_KEY=your-api-key-here  # Optional

# News Provider Preferences
OPENBB_NEWS_PROVIDER=fmp  # Options: benzinga, fmp, intrinio, tiingo
OPENBB_NEWS_CACHE_DURATION=300000  # 5 minutes in milliseconds
```

### 4. Update Your News Component

Replace your existing news section with the new live news component:

```tsx
import { LiveNewsSection } from "@/components/live-news-section"

export function NewsSection() {
  return (
    <LiveNewsSection 
      maxArticles={8}
      showSearch={true}
      showFilters={true}
      autoRefresh={true}
      refreshInterval={300000}
    />
  )
}
```

## API Endpoints

### World News
```
GET /api/news?type=world&limit=20&refresh=true
```

### Company News
```
GET /api/news?type=company&symbol=AAPL&limit=10
```

### Market News
```
GET /api/news?type=market&limit=15
```

## News Providers

The integration supports multiple news providers:

- **FMP (Financial Modeling Prep)**: Free tier available, good coverage
- **Benzinga**: Premium financial news with real-time updates
- **Intrinio**: Professional-grade financial data
- **Tiingo**: Alternative financial data provider
- **Polygon**: Real-time market data and news
- **Yahoo Finance**: Free news data

## Data Structure

Each news article includes:

```typescript
interface NewsArticle {
  date: string              // Publication date
  title: string            // Article headline
  text?: string           // Full article text
  url?: string            // Link to original article
  source?: string         // News source name
  author?: string         // Article author
  summary?: string        // Article summary
  sentiment?: string      // AI sentiment: positive/negative/neutral
  tags?: string          // Comma-separated tags
  symbols?: string       // Related stock symbols
  images?: Array<{       // Associated images
    url: string
    caption?: string
  }>
}
```

## Customization

### Modify News Sources
Edit `lib/news-service.ts` to change default providers or add custom filtering:

```typescript
const response = await openbbClient.getWorldNews({
  limit: 15,
  provider: 'benzinga',  // Change provider
  sentiment: 'positive'  // Filter by sentiment
})
```

### Adjust Refresh Intervals
Modify the auto-refresh behavior:

```tsx
<LiveNewsSection 
  autoRefresh={true}
  refreshInterval={180000}  // 3 minutes
/>
```

### Custom Styling
The component uses Tailwind CSS classes and can be customized by modifying the className props in `components/live-news-section.tsx`.

## Troubleshooting

### OpenBB Server Not Running
- Ensure OpenBB is installed: `pip install openbb`
- Start the server: `openbb-api --host 0.0.0.0 --port 8000`
- Check if port 8000 is available

### API Rate Limits
- The integration includes caching to minimize API calls
- Adjust `refreshInterval` to reduce request frequency
- Consider upgrading to premium providers for higher limits

### No News Data
- Check OpenBB server logs for errors
- Verify your API key (if using premium providers)
- Ensure your internet connection is stable
- Check provider status pages

### CORS Issues
If running in development, you may need to configure CORS in your OpenBB server or use a proxy.

## Production Deployment

For production deployment:

1. **Use Environment Variables**: Store API keys securely
2. **Configure Caching**: Use Redis or similar for distributed caching
3. **Monitor API Usage**: Track API calls and costs
4. **Error Handling**: Implement robust error handling and fallbacks
5. **Rate Limiting**: Implement client-side rate limiting

## Support

For issues with:
- **OpenBB Platform**: Check [OpenBB Documentation](https://docs.openbb.co/)
- **News Providers**: Refer to individual provider documentation
- **Integration Issues**: Check the console for error messages and API responses