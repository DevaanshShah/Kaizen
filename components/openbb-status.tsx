"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { openbbClient } from "@/lib/openbb-client"

export function OpenBBStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({})
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const connected = await openbbClient.checkConnection()
      setIsConnected(connected)
      
      if (connected) {
        const providers = openbbClient.getProviderStatus()
        setProviderStatus(providers)
      }
    } catch (error) {
      console.error('Failed to check OpenBB status:', error)
      setIsConnected(false)
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
            <CardTitle className="text-white flex items-center">
              OpenBB Platform Status
              {getStatusIcon(isConnected)}
            </CardTitle>
            <CardDescription className={getStatusColor(isConnected)}>
              {isConnected === null ? "Checking connection..." : 
               isConnected ? "Connected and ready" : "Connection failed"}
            </CardDescription>
          </div>
          <Button
            onClick={checkStatus}
            disabled={isChecking}
            size="sm"
            variant="outline"
            className="border-gray-600"
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
                        className="h-6 w-6 p-0"
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
                Add them to your <code>.env.local</code> file or configure them in OpenBB Platform.
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
              <p className="text-sm text-red-300">
                <strong>OpenBB Platform not accessible.</strong> Make sure the OpenBB API server is running:
              </p>
              <code className="block mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">
                pip install openbb<br/>
                openbb-api --host 0.0.0.0 --port 8000
              </code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}