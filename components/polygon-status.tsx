"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Key } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PolygonStatus() {
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking')
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number
    limit: number
    resetTime: string
  } | null>(null)

  useEffect(() => {
    checkPolygonStatus()
  }, [])

  const checkPolygonStatus = async () => {
    try {
      // Check if API key is configured
      const apiKey = process.env.POLYGON_API_KEY || 'M_Oc0zRLKkVWPnjBYe9dbO64g7UNnuL_'
      
      if (!apiKey) {
        setApiKeyStatus('missing')
        return
      }

      // Test the API key with a simple request
      const response = await fetch(`https://api.polygon.io/v2/reference/tickers?active=true&limit=1&apikey=${apiKey}`)
      
      if (response.ok) {
        setApiKeyStatus('valid')
        
        // Extract rate limit information from headers
        const remaining = response.headers.get('X-RateLimit-Remaining')
        const limit = response.headers.get('X-RateLimit-Limit')
        const reset = response.headers.get('X-RateLimit-Reset')
        
        if (remaining && limit) {
          setRateLimitInfo({
            remaining: parseInt(remaining),
            limit: parseInt(limit),
            resetTime: reset ? new Date(parseInt(reset) * 1000).toLocaleTimeString() : 'Unknown'
          })
        }
      } else if (response.status === 401 || response.status === 403) {
        setApiKeyStatus('invalid')
      } else {
        setApiKeyStatus('invalid')
      }
    } catch (error) {
      console.error('Failed to check Polygon API status:', error)
      setApiKeyStatus('invalid')
    }
  }

  const getStatusIcon = () => {
    switch (apiKeyStatus) {
      case 'checking':
        return <AlertCircle className="w-4 h-4 text-yellow-400 animate-pulse" />
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusText = () => {
    switch (apiKeyStatus) {
      case 'checking':
        return 'Checking API key...'
      case 'valid':
        return 'API key is valid and active'
      case 'invalid':
        return 'API key is invalid or expired'
      case 'missing':
        return 'API key not configured'
    }
  }

  const getStatusColor = () => {
    switch (apiKeyStatus) {
      case 'checking':
        return 'text-yellow-400'
      case 'valid':
        return 'text-green-400'
      case 'invalid':
      case 'missing':
        return 'text-red-400'
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              Polygon API Status
              {getStatusIcon()}
            </CardTitle>
            <CardDescription className={getStatusColor()}>
              {getStatusText()}
            </CardDescription>
          </div>
          <Button
            onClick={() => window.open('https://polygon.io/', '_blank')}
            size="sm"
            variant="outline"
            className="border-gray-600 hover:bg-gray-800"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Polygon.io
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* API Key Info */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
            <div>
              <span className="text-sm font-medium text-white">API Key</span>
              <p className="text-xs text-gray-400">
                {apiKeyStatus === 'valid' ? 'M_Oc0z...L_' : 'Not configured or invalid'}
              </p>
            </div>
            <Badge variant={apiKeyStatus === 'valid' ? 'default' : 'destructive'}>
              {apiKeyStatus === 'valid' ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Rate Limit Info */}
          {rateLimitInfo && apiKeyStatus === 'valid' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-900/20 rounded border border-green-500/30"
            >
              <h4 className="text-sm font-semibold text-green-400 mb-2">Rate Limit Status</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Remaining:</span>
                  <p className="text-white font-mono">{rateLimitInfo.remaining}</p>
                </div>
                <div>
                  <span className="text-gray-400">Limit:</span>
                  <p className="text-white font-mono">{rateLimitInfo.limit}</p>
                </div>
                <div>
                  <span className="text-gray-400">Reset:</span>
                  <p className="text-white font-mono">{rateLimitInfo.resetTime}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Features Available */}
          {apiKeyStatus === 'valid' && (
            <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Available Features</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Company News
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Market Data
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Real-time Updates
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Historical Data
                </div>
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          {apiKeyStatus !== 'valid' && (
            <div className="p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Setup Instructions</h4>
              <div className="text-sm text-yellow-300 space-y-2">
                <p>1. Visit <a href="https://polygon.io/" target="_blank" rel="noopener noreferrer" className="underline">polygon.io</a> to get an API key</p>
                <p>2. Add your API key to the <code className="bg-gray-800 px-1 rounded">.env.local</code> file:</p>
                <div className="bg-gray-800 rounded p-2 font-mono text-xs text-gray-300 mt-2">
                  POLYGON_API_KEY=your_api_key_here
                </div>
                <p>3. Restart your development server</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}