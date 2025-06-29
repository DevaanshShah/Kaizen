"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { openbbClient } from "@/lib/openbb-client"

export function OpenBBStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({})
  const [isChecking, setIsChecking] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const checkStatus = async () => {
    setIsChecking(true)
    setConnectionError(null)
    
    try {
      const connected = await openbbClient.checkConnection()
      setIsConnected(connected)
      
      if (connected) {
        const providers = openbbClient.getProviderStatus()
        setProviderStatus(providers)
      } else {
        setConnectionError('Unable to connect to OpenBB API server')
        setProviderStatus({})
      }
    } catch (error) {
      console.error('Failed to check OpenBB status:', error)
      setIsConnected(false)
      setConnectionError(error instanceof Error ? error.message : 'Unknown connection error')
      setProviderStatus({})
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <AlertCircle className="w-4 h-4 text-yellow-400" />
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-400" /> : 
      <XCircle className="w-4 h-4 text-red-400" />
  }

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return "text-yellow-400"
    return status ? "text-green-400" : "text-red-400"
  }

  const getStatusText = () => {
    if (isConnected === null) return "Checking connection..."
    if (isConnected) return "Connected and ready"
    return connectionError || "Connection failed"
  }

  const providerLinks = {
    fmp: "https://financialmodelingprep.com/developer/docs",
    polygon: "https://polygon.io/",
    benzinga: "https://www.benzinga.com/apis/",
    intrinio: "https://intrinio.com/",
    tiingo: "https://www.tiingo.com/",
    fred: "https://fred.stlouisfed.org/docs/api/",
    nasdaq: "https://data.nasdaq.com/",
    alpha_vantage: "https://www.alphavantage.co/"
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5" />
              OpenBB Platform Status
              {getStatusIcon(isConnected)}
            </CardTitle>
            <CardDescription className={getStatusColor(isConnected)}>
              {getStatusText()}
            </CardDescription>
          </div>
          <Button
            onClick={checkStatus}
            disabled={isChecking}
            size="sm"
            variant="outline"
            className="border-gray-600 hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Status
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isConnected && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Data Provider Status</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(providerStatus).map(([provider, hasKey]) => (
                  <motion.div
                    key={provider}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(hasKey)}
                      <span className="text-sm text-white capitalize">{provider}</span>
                    </div>
                    {providerLinks[provider as keyof typeof providerLinks] && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-gray-700"
                        onClick={() => window.open(providerLinks[provider as keyof typeof providerLinks], '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30">
              <p className="text-sm text-blue-300">
                <strong>Setup Instructions:</strong> To get live news data, you need API keys from news providers. 
                Add them to your <code className="bg-gray-800 px-1 rounded">.env.local</code> file or configure them in OpenBB Platform.
              </p>
            </div>

            {Object.values(providerStatus).every(status => !status) && (
              <div className="p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                <p className="text-sm text-yellow-300">
                  <strong>No API keys configured.</strong> The system will use free providers with limited data. 
                  Consider adding API keys for better news coverage.
                </p>
              </div>
            )}
          </div>
        )}

        {!isConnected && (
          <div className="space-y-4">
            <div className="p-3 bg-red-900/20 rounded border border-red-500/30">
              <p className="text-sm text-red-300 mb-2">
                <strong>OpenBB Platform not accessible.</strong> 
                {connectionError && (
                  <span className="block mt-1 text-xs opacity-75">
                    Error: {connectionError}
                  </span>
                )}
              </p>
              <p className="text-sm text-red-300 mb-2">
                To use OpenBB features, make sure the OpenBB API server is running:
              </p>
              <div className="bg-gray-800 rounded p-3 font-mono text-xs text-gray-300">
                <div className="mb-1"># Install OpenBB (if not already installed)</div>
                <div className="text-green-400">pip install openbb</div>
                <div className="mt-2 mb-1"># Start the OpenBB API server</div>
                <div className="text-green-400">openbb-api --host 0.0.0.0 --port 8000</div>
              </div>
            </div>

            <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30">
              <p className="text-sm text-blue-300">
                <strong>Note:</strong> The application will continue to work with limited functionality when OpenBB is not available. 
                Some features may show placeholder data or be disabled.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}