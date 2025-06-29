# OpenBB Integration Setup Instructions

## Quick Start

### 1. Install OpenBB Platform

```bash
# Install OpenBB Platform
pip install openbb

# Start the API server
openbb-api --host 0.0.0.0 --port 8000
```

### 2. Get API Keys (Recommended)

For live news data, get API keys from these providers:

#### Free Tier Available:
- **FMP (Financial Modeling Prep)**: https://financialmodelingprep.com/developer/docs
  - Free: 250 requests/day
  - Paid: Starting at $15/month

#### Premium Providers:
- **Benzinga**: https://www.benzinga.com/apis/
  - Real-time financial news
  - Starting at $50/month

- **Polygon**: https://polygon.io/
  - Comprehensive market data
  - Free tier: 5 requests/minute

- **Intrinio**: https://intrinio.com/
  - Professional financial data
  - Custom pricing

### 3. Configure Environment Variables

Create `.env.local` in your project root:

```env
# OpenBB Configuration
OPENBB_API_URL=http://localhost:8000
OPENBB_API_KEY=your-openbb-api-key-here

# News Provider API Keys
FMP_API_KEY=your-fmp-api-key-here
POLYGON_API_KEY=your-polygon-api-key-here
BENZINGA_API_KEY=your-benzinga-api-key-here
INTRINIO_API_KEY=your-intrinio-api-key-here
TIINGO_TOKEN=your-tiingo-token-here

# Optional: Other providers
FRED_API_KEY=your-fred-api-key-here
NASDAQ_API_KEY=your-nasdaq-api-key-here
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key-here
```

### 4. Test the Integration

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Check the OpenBB status in your app - you should see a status indicator showing connection status and available providers.

3. The news section will automatically use the best available provider based on your configured API keys.

## Provider Recommendations

### For Getting Started (Free):
1. **FMP**: Sign up for free tier (250 requests/day)
2. **Yahoo Finance**: No API key needed (built into OpenBB)

### For Production (Paid):
1. **Benzinga**: Best for real-time financial news
2. **Polygon**: Comprehensive market data
3. **Intrinio**: Professional-grade data

## Troubleshooting

### OpenBB Server Not Starting:
```bash
# Check if Python/pip is installed
python --version
pip --version

# Install OpenBB
pip install openbb

# Start with verbose logging
openbb-api --host 0.0.0.0 --port 8000 --log-level debug
```

### API Key Issues:
1. Verify your API keys are correct
2. Check provider documentation for proper format
3. Ensure you haven't exceeded rate limits
4. Test API keys directly with provider endpoints

### No News Data:
1. Check OpenBB server logs
2. Verify internet connection
3. Try different providers
4. Check the OpenBB status component in your app

## Production Deployment

For production:

1. **Use a process manager** for OpenBB server:
   ```bash
   # Using PM2
   pm2 start "openbb-api --host 0.0.0.0 --port 8000" --name openbb-api
   ```

2. **Set up monitoring** for the OpenBB service

3. **Configure proper security** (API keys, CORS, etc.)

4. **Use environment variables** for all sensitive data

5. **Set up caching** (Redis recommended) for better performance

## Support

- OpenBB Documentation: https://docs.openbb.co/
- OpenBB GitHub: https://github.com/OpenBB-finance/OpenBBTerminal
- Provider-specific documentation linked in the status component