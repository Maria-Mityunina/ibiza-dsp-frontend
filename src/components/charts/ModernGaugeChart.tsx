import React from 'react'
import { motion } from 'framer-motion'

interface ModernGaugeChartProps {
  value: number
  max: number
  title: string
  subtitle?: string
  color?: 'green' | 'red' | 'black'
  className?: string
}

const ModernGaugeChart: React.FC<ModernGaugeChartProps> = ({
  value,
  max,
  title,
  subtitle,
  color = 'black',
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    green: 'stroke-emerald-500',
    red: 'stroke-red-500',
    black: 'stroke-gray-700'
  }

  return (
    <div className={`bg-white rounded-3xl p-8 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex flex-col items-center space-y-6">
        {/* Gauge SVG */}
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
              className="drop-shadow-sm"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={`${colorClasses[color]} drop-shadow-md`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{
                strokeDasharray,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </svg>
          
          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="text-3xl font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 font-['Montserrat']">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 font-['Montserrat']">
              {subtitle}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span className="font-medium">{value.toLocaleString()}</span>
            <span>из</span>
            <span>{max.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernGaugeChart
