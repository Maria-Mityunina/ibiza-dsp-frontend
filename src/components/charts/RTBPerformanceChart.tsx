import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Zap, Target, DollarSign, Activity, Award } from 'lucide-react'

interface RTBData {
  timestamp: number
  totalBids: number
  wonAuctions: number
  winRate: number
  avgWinPrice: number
  avgBidPrice: number
  revenue: number
}

interface RTBPerformanceChartProps {
  title: string
  className?: string
  realTime?: boolean
}

const RTBPerformanceChart: React.FC<RTBPerformanceChartProps> = ({ 
  title, 
  className = "", 
  realTime = true 
}) => {
  const [data, setData] = useState<RTBData[]>([])
  const [isLive, setIsLive] = useState(realTime)

  // Simulate live RTB data
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const now = Date.now()
      const totalBids = Math.floor(Math.random() * 10000) + 50000
      const wonAuctions = Math.floor(totalBids * (0.15 + Math.random() * 0.15))
      
      const newPoint: RTBData = {
        timestamp: now,
        totalBids,
        wonAuctions,
        winRate: (wonAuctions / totalBids) * 100,
        avgWinPrice: Math.random() * 2 + 1.5,
        avgBidPrice: Math.random() * 1.5 + 1,
        revenue: wonAuctions * (Math.random() * 2 + 1.5)
      }

      setData(prev => {
        const updated = [...prev, newPoint]
        return updated.slice(-20) // Keep last 20 points
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  // Generate initial data
  useEffect(() => {
    const initialData: RTBData[] = []
    const now = Date.now()
    
    for (let i = 19; i >= 0; i--) {
      const totalBids = Math.floor(Math.random() * 10000) + 50000
      const wonAuctions = Math.floor(totalBids * (0.15 + Math.random() * 0.15))
      
      initialData.push({
        timestamp: now - (i * 3000),
        totalBids,
        wonAuctions,
        winRate: (wonAuctions / totalBids) * 100,
        avgWinPrice: Math.random() * 2 + 1.5,
        avgBidPrice: Math.random() * 1.5 + 1,
        revenue: wonAuctions * (Math.random() * 2 + 1.5)
      })
    }
    
    setData(initialData)
  }, [])

  const latest = data[data.length - 1]
  const previous = data[data.length - 2]

  const getChange = (current: number, prev: number) => {
    if (!prev) return 0
    return ((current - prev) / prev) * 100
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number): string => {
    return `$${num.toFixed(2)}`
  }

  const renderMetricCard = (
    icon: React.ComponentType<any>,
    label: string,
    value: string,
    change?: number,
    color: string,
    delay: number
  ) => (
                <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay }}
              className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 relative overflow-hidden hover:bg-white/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  {React.createElement(icon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-white" })}
                </div>
                {change !== undefined && (
                  <div className="flex items-center gap-1 text-gray-700 text-sm">
                    {change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="font-medium">
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-gray-600 text-xs sm:text-sm">{label}</div>
            </motion.div>
  )

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/30 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Live bidding performance and auction metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {realTime && (
            <>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-slate-900 animate-pulse' : 'bg-gray-400'}`} />
              <button
                onClick={() => setIsLive(!isLive)}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                {isLive ? 'Pause' : 'Resume'}
              </button>
            </>
          )}
        </div>
      </div>

      {latest && (
        <div className="space-y-6">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {renderMetricCard(
              Zap,
              "Total Bids",
              formatNumber(latest.totalBids),
              previous ? getChange(latest.totalBids, previous.totalBids) : undefined,
              "bg-gradient-to-br from-blue-500 to-blue-600",
              0
            )}
            
            {renderMetricCard(
              Award,
              "Won Auctions",
              formatNumber(latest.wonAuctions),
              previous ? getChange(latest.wonAuctions, previous.wonAuctions) : undefined,
              "bg-gradient-to-br from-emerald-500 to-emerald-600",
              0.1
            )}
            
            {renderMetricCard(
              Target,
              "Win Rate",
              `${latest.winRate.toFixed(1)}%`,
              previous ? getChange(latest.winRate, previous.winRate) : undefined,
              "bg-gradient-to-br from-purple-500 to-purple-600",
              0.2
            )}
            
            {renderMetricCard(
              DollarSign,
              "Avg Win Price",
              formatCurrency(latest.avgWinPrice),
              previous ? getChange(latest.avgWinPrice, previous.avgWinPrice) : undefined,
              "bg-gradient-to-br from-orange-500 to-orange-600",
              0.3
            )}
          </div>

          {/* Performance Chart */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h4 className="font-medium text-gray-900">Win Rate Trend</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-700 rounded-full" />
                  Win Rate
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-500 rounded-full" />
                  Bid Volume
                </div>
              </div>
            </div>
            
            <div className="h-32 flex items-end justify-between gap-1">
              {data.slice(-10).map((point, index) => {
                const maxWinRate = Math.max(...data.slice(-10).map(d => d.winRate))
                const maxBids = Math.max(...data.slice(-10).map(d => d.totalBids))
                
                return (
                  <div key={point.timestamp} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full flex items-end gap-1 h-24">
                      {/* Win Rate Bar */}
                      <motion.div
                        className="flex-1 bg-slate-700 rounded-t hover:bg-slate-800 transition-colors cursor-pointer"
                        style={{ height: `${(point.winRate / maxWinRate) * 100}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.winRate / maxWinRate) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        title={`Win Rate: ${point.winRate.toFixed(1)}%`}
                      />
                      {/* Bid Volume Bar */}
                      <motion.div
                        className="flex-1 bg-slate-500 rounded-t hover:bg-slate-600 transition-colors cursor-pointer"
                        style={{ height: `${(point.totalBids / maxBids) * 100}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.totalBids / maxBids) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        title={`Bids: ${formatNumber(point.totalBids)}`}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(point.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Revenue and Efficiency Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(latest.revenue)}
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(latest.avgBidPrice)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Bid Price</div>
                </div>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {(latest.revenue / latest.totalBids * 1000).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Revenue per 1K Bids</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RTBPerformanceChart
