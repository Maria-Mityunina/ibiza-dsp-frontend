import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface FunnelData {
  stage: string
  value: number
  percentage: number
  color: string
}

interface InteractiveFunnelChartProps {
  data: FunnelData[]
  title: string
  className?: string
}

const InteractiveFunnelChart: React.FC<InteractiveFunnelChartProps> = ({ 
  data, 
  title, 
  className = "" 
}) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-800 text-lg font-medium">{title}</h3>
        <div className="text-slate-400">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3">
        {data.map((stage, index) => {
          const widthPercentage = (stage.value / maxValue) * 100
          const isHovered = hoveredStage === stage.stage
          const prevStage = index > 0 ? data[index - 1] : null
          const dropoffRate = prevStage ? ((prevStage.value - stage.value) / prevStage.value) * 100 : 0

          return (
            <motion.div
              key={stage.stage}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredStage(stage.stage)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              {/* Stage Bar */}
              <div className="relative">
                <motion.div
                  className={`${stage.color} rounded-lg h-12 flex items-center justify-between px-4 cursor-pointer transition-all duration-300`}
                  style={{ width: `${widthPercentage}%` }}
                  whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                >
                  <span className="text-white font-medium text-sm">{stage.stage}</span>
                  <div className="text-white text-sm">
                    <span className="font-bold">{stage.value.toLocaleString()}</span>
                    <span className="ml-2 text-white/80">({stage.percentage}%)</span>
                  </div>
                </motion.div>

                {/* Hover Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs z-10"
                  >
                    <div>Value: {stage.value.toLocaleString()}</div>
                    <div>Conversion: {stage.percentage}%</div>
                    {index > 0 && (
                      <div className="flex items-center text-red-300">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Drop-off: {dropoffRate.toFixed(1)}%
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Connecting Line */}
              {index < data.length - 1 && (
                <div className="flex items-center my-1 ml-4">
                  <div className="w-px h-4 bg-slate-200"></div>
                  <div className="w-2 h-px bg-slate-200"></div>
                  <div className="text-xs text-slate-500 ml-2">
                    -{dropoffRate.toFixed(1)}%
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">Overall Conversion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {(((data[0].value - data[data.length - 1].value) / data[0].value) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">Total Drop-off</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveFunnelChart
