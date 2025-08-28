import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Eye, MousePointer } from 'lucide-react'

interface MetricData {
  timestamp: number
  impressions: number
  clicks: number
  ctr: number
  spend: number
}

interface LiveMetricsChartProps {
  title: string
  className?: string
}

const LiveMetricsChart: React.FC<LiveMetricsChartProps> = ({ title, className = "" }) => {
  const [data, setData] = useState<MetricData[]>([])
  const [isLive, setIsLive] = useState(true)

  // Simulate live data updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const now = Date.now()
      const newPoint: MetricData = {
        timestamp: now,
        impressions: Math.floor(Math.random() * 1000) + 500,
        clicks: Math.floor(Math.random() * 50) + 10,
        ctr: Math.random() * 5 + 1,
        spend: Math.random() * 100 + 20
      }

      setData(prev => {
        const updated = [...prev, newPoint]
        // Keep only last 20 points
        return updated.slice(-20)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  // Generate initial data
  useEffect(() => {
    const initialData: MetricData[] = []
    const now = Date.now()
    
    for (let i = 19; i >= 0; i--) {
      initialData.push({
        timestamp: now - (i * 2000),
        impressions: Math.floor(Math.random() * 1000) + 500,
        clicks: Math.floor(Math.random() * 50) + 10,
        ctr: Math.random() * 5 + 1,
        spend: Math.random() * 100 + 20
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

  const renderMiniChart = (values: number[], color: string) => {
    if (values.length < 2) return null
    
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min || 1

    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-xl p-4 sm:p-6 shadow-lg text-white ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {latest && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Impressions */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className={`text-xs ${
                previous && getChange(latest.impressions, previous.impressions) > 0 
                  ? 'text-emerald-400' 
                  : 'text-red-400'
              }`}>
                {previous ? (getChange(latest.impressions, previous.impressions) > 0 ? '+' : '') + getChange(latest.impressions, previous.impressions).toFixed(1) + '%' : ''}
              </span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {latest.impressions.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mb-2">Impressions</div>
            <div className="h-8">
              {renderMiniChart(data.map(d => d.impressions), '#22d3ee')}
            </div>
          </motion.div>

          {/* Clicks */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <MousePointer className="w-4 h-4 text-emerald-400" />
              <span className={`text-xs ${
                previous && getChange(latest.clicks, previous.clicks) > 0 
                  ? 'text-emerald-400' 
                  : 'text-red-400'
              }`}>
                {previous ? (getChange(latest.clicks, previous.clicks) > 0 ? '+' : '') + getChange(latest.clicks, previous.clicks).toFixed(1) + '%' : ''}
              </span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {latest.clicks.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mb-2">Clicks</div>
            <div className="h-8">
              {renderMiniChart(data.map(d => d.clicks), '#10b981')}
            </div>
          </motion.div>

          {/* CTR */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className={`text-xs ${
                previous && getChange(latest.ctr, previous.ctr) > 0 
                  ? 'text-emerald-400' 
                  : 'text-red-400'
              }`}>
                {previous ? (getChange(latest.ctr, previous.ctr) > 0 ? '+' : '') + getChange(latest.ctr, previous.ctr).toFixed(1) + '%' : ''}
              </span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {latest.ctr.toFixed(2)}%
            </div>
            <div className="text-xs text-slate-400 mb-2">CTR</div>
            <div className="h-8">
              {renderMiniChart(data.map(d => d.ctr), '#a855f7')}
            </div>
          </motion.div>

          {/* Spend */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className={`text-xs ${
                previous && getChange(latest.spend, previous.spend) > 0 
                  ? 'text-emerald-400' 
                  : 'text-red-400'
              }`}>
                {previous ? (getChange(latest.spend, previous.spend) > 0 ? '+' : '') + getChange(latest.spend, previous.spend).toFixed(1) + '%' : ''}
              </span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              ${latest.spend.toFixed(0)}
            </div>
            <div className="text-xs text-slate-400 mb-2">Spend</div>
            <div className="h-8">
              {renderMiniChart(data.map(d => d.spend), '#f97316')}
            </div>
          </motion.div>
        </div>
      )}

      {/* Live Activity Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex space-x-1">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-6 bg-emerald-400 rounded-full"
              animate={{
                scaleY: [0.3, 1, 0.3],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LiveMetricsChart
