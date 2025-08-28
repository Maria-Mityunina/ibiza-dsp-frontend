import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Globe, TrendingUp, TrendingDown, Eye, MousePointer, DollarSign } from 'lucide-react'

interface GeographicData {
  country: string
  countryCode: string
  region: string
  impressions: number
  clicks: number
  spend: number
  revenue: number
  ctr: number
  roas: number
  coordinates: { lat: number; lng: number }
}

interface GeographicHeatmapProps {
  data: GeographicData[]
  title: string
  className?: string
  metric?: 'impressions' | 'clicks' | 'spend' | 'revenue' | 'ctr' | 'roas'
}

const GeographicHeatmap: React.FC<GeographicHeatmapProps> = ({
  data,
  title,
  className = "",
  metric = 'impressions'
}) => {
  const [selectedMetric, setSelectedMetric] = useState<typeof metric>(metric)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num)
  }

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(2)}%`
  }

  const getMetricValue = (country: GeographicData) => {
    switch (selectedMetric) {
      case 'impressions': return country.impressions
      case 'clicks': return country.clicks
      case 'spend': return country.spend
      case 'revenue': return country.revenue
      case 'ctr': return country.ctr
      case 'roas': return country.roas
      default: return country.impressions
    }
  }

  const getMetricDisplay = (country: GeographicData) => {
    const value = getMetricValue(country)
    switch (selectedMetric) {
      case 'spend':
      case 'revenue':
        return formatCurrency(value)
      case 'ctr':
      case 'roas':
        return selectedMetric === 'ctr' ? formatPercentage(value) : `${value.toFixed(2)}x`
      default:
        return formatNumber(value)
    }
  }

  const getIntensity = (country: GeographicData) => {
    const values = data.map(getMetricValue)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const value = getMetricValue(country)
    return (value - minValue) / (maxValue - minValue)
  }

  const getHeatmapColor = (intensity: number) => {
    // Blue to red gradient based on intensity
    const hue = (1 - intensity) * 240 // 240 is blue, 0 is red
    const saturation = 70 + intensity * 30 // 70-100%
    const lightness = 85 - intensity * 35 // 85-50%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const metrics = [
    { key: 'impressions', label: 'Impressions', icon: Eye },
    { key: 'clicks', label: 'Clicks', icon: MousePointer },
    { key: 'spend', label: 'Spend', icon: DollarSign },
    { key: 'revenue', label: 'Revenue', icon: TrendingUp },
    { key: 'ctr', label: 'CTR', icon: TrendingUp },
    { key: 'roas', label: 'ROAS', icon: TrendingUp }
  ] as const

  const sortedData = [...data].sort((a, b) => getMetricValue(b) - getMetricValue(a))

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/30 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Performance metrics by geographic location</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'map' 
                ? 'bg-white/30 text-slate-900' 
                : 'bg-white/20 text-gray-600 hover:bg-white/30'
            }`}
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-white/30 text-slate-900' 
                : 'bg-white/20 text-gray-600 hover:bg-white/30'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMetric === key
                ? 'bg-white/30 text-slate-900 border border-white/30'
                : 'bg-white/20 text-gray-600 hover:bg-white/30 border border-transparent'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* World Map Visualization */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 min-h-[400px] relative border border-white/20">
              <div className="text-center text-gray-600 mb-4">
                <Globe className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                <p className="text-sm">Interactive World Map</p>
                <p className="text-xs text-gray-500">Hover over regions for details</p>
              </div>

              {/* Simplified world map representation */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-w-4xl mx-auto">
                {sortedData.slice(0, 12).map((country, index) => {
                  const intensity = getIntensity(country)
                  return (
                    <motion.div
                      key={country.countryCode}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative p-3 rounded-lg border-2 transition-all cursor-pointer bg-white/20 backdrop-blur-sm hover:bg-white/30"
                      style={{ 
                        borderColor: `hsl(${(1 - intensity) * 240}, 60%, ${70 - intensity * 20}%)`
                      }}
                      onMouseEnter={() => setHoveredCountry(country.country)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    >
                      <div className="text-xs font-medium text-gray-800 mb-1">
                        {country.country}
                      </div>
                      <div className="text-sm sm:text-lg font-bold text-gray-900">
                        {getMetricDisplay(country)}
                      </div>
                      
                      {/* Tooltip */}
                      {hoveredCountry === country.country && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-lg shadow-xl text-xs whitespace-nowrap"
                        >
                          <div className="font-medium mb-1">{country.country}</div>
                          <div className="space-y-1">
                            <div>Impressions: {formatNumber(country.impressions)}</div>
                            <div>Clicks: {formatNumber(country.clicks)}</div>
                            <div>CTR: {formatPercentage(country.ctr)}</div>
                            <div>Spend: {formatCurrency(country.spend)}</div>
                            <div>Revenue: {formatCurrency(country.revenue)}</div>
                            <div>ROAS: {country.roas.toFixed(2)}x</div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center mt-6 gap-4">
                <span className="text-sm text-gray-600">Low</span>
                <div className="flex h-3 w-24 sm:w-32 rounded-full overflow-hidden border border-white/20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: `hsl(${(1 - i / 19) * 240}, 30%, ${85 - (i / 19) * 35}%)` }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">High</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* List View */}
            <div className="grid gap-3">
              {sortedData.map((country, index) => {
                const intensity = getIntensity(country)
                return (
                  <motion.div
                    key={country.countryCode}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 sm:p-4 border border-white/30 rounded-lg hover:border-white/40 hover:bg-white/30 transition-all bg-white/20 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: `hsl(${(1 - intensity) * 240}, 30%, ${85 - intensity * 35}%)` }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{country.country}</div>
                        <div className="text-sm text-gray-600">{country.region}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {getMetricDisplay(country)}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {selectedMetric}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{data.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatNumber(data.reduce((sum, country) => sum + country.impressions, 0))}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Total Impressions</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatCurrency(data.reduce((sum, country) => sum + country.spend, 0))}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Total Spend</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {formatCurrency(data.reduce((sum, country) => sum + country.revenue, 0))}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
    </div>
  )
}

export default GeographicHeatmap
