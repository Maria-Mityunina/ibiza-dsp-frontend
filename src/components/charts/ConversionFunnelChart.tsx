import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, MousePointer, ShoppingCart, CreditCard, CheckCircle, TrendingDown } from 'lucide-react'

interface FunnelStage {
  id: string
  name: string
  value: number
  icon: React.ComponentType<any>
  color: string
  description: string
}

interface ConversionFunnelChartProps {
  data?: FunnelStage[]
  title: string
  className?: string
  showDropoffRates?: boolean
}

const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({
  data,
  title,
  className = "",
  showDropoffRates = true
}) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  const defaultData: FunnelStage[] = [
    {
      id: 'impressions',
      name: 'Impressions',
      value: 1000000,
      icon: Eye,
      color: '#3B82F6',
      description: 'Ad views'
    },
    {
      id: 'clicks',
      name: 'Clicks',
      value: 25000,
      icon: MousePointer,
      color: '#10B981',
      description: 'Users clicked on ad'
    },
    {
      id: 'visits',
      name: 'Landing Page Visits',
      value: 22500,
      icon: ShoppingCart,
      color: '#F59E0B',
      description: 'Users visited landing page'
    },
    {
      id: 'leads',
      name: 'Leads Generated',
      value: 4500,
      icon: CreditCard,
      color: '#EF4444',
      description: 'Users showed interest'
    },
    {
      id: 'conversions',
      name: 'Conversions',
      value: 1350,
      icon: CheckCircle,
      color: '#8B5CF6',
      description: 'Users completed action'
    }
  ]

  const funnelData = data || defaultData
  const maxValue = Math.max(...funnelData.map(stage => stage.value))

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getConversionRate = (currentIndex: number): number => {
    if (currentIndex === 0) return 100
    return (funnelData[currentIndex].value / funnelData[0].value) * 100
  }

  const getDropoffRate = (currentIndex: number): number => {
    if (currentIndex === 0) return 0
    const prevValue = funnelData[currentIndex - 1].value
    const currValue = funnelData[currentIndex].value
    return ((prevValue - currValue) / prevValue) * 100
  }

  const getStageWidth = (value: number): number => {
    return (value / maxValue) * 100
  }

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/30 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">User journey from impression to conversion</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>Conversion Rate: {getConversionRate(funnelData.length - 1).toFixed(2)}%</span>
        </div>
      </div>

      <div className="space-y-8">
        {funnelData.map((stage, index) => {
          const width = getStageWidth(stage.value)
          const conversionRate = getConversionRate(index)
          const dropoffRate = index > 0 ? getDropoffRate(index) : 0
          const isHovered = hoveredStage === stage.id

          return (
            <div key={stage.id} className="space-y-4 relative">
              {/* Funnel Stage */}
              <motion.div
                className="relative"
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Stage Bar */}
                <div className="relative">
                  <motion.div
                    className="h-16 rounded-lg flex items-center px-4 cursor-pointer transition-all duration-300 shadow-sm bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40"
                    style={{ 
                      width: `${width}%`,
                      transform: isHovered ? 'translateY(-2px)' : undefined
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 text-gray-900">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <stage.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{stage.name}</div>
                        <div className="text-xs opacity-90">{stage.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatNumber(stage.value)}</div>
                        <div className="text-xs text-gray-600">{conversionRate.toFixed(1)}%</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-4 mt-2 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-lg shadow-xl text-sm z-50"
                    >
                      <div className="font-medium mb-1">{stage.name}</div>
                      <div className="space-y-1 text-xs">
                        <div>Count: {stage.value.toLocaleString()}</div>
                        <div>Conversion Rate: {conversionRate.toFixed(2)}%</div>
                        {index > 0 && (
                          <div className="text-red-300">
                            Drop-off: {dropoffRate.toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-900 transform rotate-45"></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Dropoff Indicator */}
              {showDropoffRates && index < funnelData.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-center gap-2 ml-4 text-sm text-gray-500 mt-3 mb-3"
                >
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 font-medium">
                    {getDropoffRate(index + 1).toFixed(1)}% drop-off
                  </span>
                  <span>
                    ({formatNumber(funnelData[index].value - funnelData[index + 1].value)} users lost)
                  </span>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 pt-6 border-t border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {getConversionRate(funnelData.length - 1).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Overall Conversion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {((funnelData[1]?.value / funnelData[0]?.value) * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Click-through Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {funnelData[2] && funnelData[1] ? 
                ((funnelData[2].value / funnelData[1].value) * 100).toFixed(2) : '0'}%
            </div>
            <div className="text-sm text-gray-600">Landing Page Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {funnelData[4] && funnelData[3] ? 
                ((funnelData[4].value / funnelData[3].value) * 100).toFixed(2) : '0'}%
            </div>
            <div className="text-sm text-gray-600">Lead to Conversion</div>
          </div>
        </div>
      </div>

      {/* Optimization Insights */}
      <div className="mt-6 p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20">
        <h4 className="font-medium text-gray-900 mb-2">Optimization Opportunities</h4>
        <div className="space-y-2 text-sm text-gray-700">
          {getDropoffRate(1) > 90 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
              <span>High drop-off after impressions - consider improving ad relevance</span>
            </div>
          )}
          {getDropoffRate(2) > 10 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <span>Users leaving after clicking - optimize landing page experience</span>
            </div>
          )}
          {getDropoffRate(4) > 70 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              <span>Low lead to conversion rate - review conversion process</span>
            </div>
          )}
          {getConversionRate(funnelData.length - 1) > 1 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
              <span>Good overall conversion rate - focus on scaling traffic</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversionFunnelChart
