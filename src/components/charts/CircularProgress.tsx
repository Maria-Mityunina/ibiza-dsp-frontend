import React from 'react'
import { motion } from 'framer-motion'

interface CircularProgressProps {
  value: number
  max: number
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'green' | 'red' | 'blue' | 'gray'
  className?: string
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  title,
  subtitle,
  size = 'md',
  color = 'gray',
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizes = {
    sm: { width: 120, height: 120, strokeWidth: 8, textSize: 'text-xl' },
    md: { width: 140, height: 140, strokeWidth: 10, textSize: 'text-2xl' },
    lg: { width: 160, height: 160, strokeWidth: 12, textSize: 'text-3xl' }
  }

  const currentSize = sizes[size]
  const radius = (currentSize.width - currentSize.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    green: { stroke: '#10b981', bg: '#f0fdf4' },
    red: { stroke: '#ef4444', bg: '#fef2f2' },
    blue: { stroke: '#3b82f6', bg: '#eff6ff' },
    gray: { stroke: '#6b7280', bg: '#f9fafb' }
  }

  const currentColor = colorClasses[color]

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative" style={{ width: currentSize.width, height: currentSize.height }}>
          {/* Background circle */}
          <svg
            width={currentSize.width}
            height={currentSize.height}
            className="transform -rotate-90"
          >
            <circle
              cx={currentSize.width / 2}
              cy={currentSize.height / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={currentSize.strokeWidth}
            />
            
            {/* Progress circle */}
            <motion.circle
              cx={currentSize.width / 2}
              cy={currentSize.height / 2}
              r={radius}
              fill="none"
              stroke={currentColor.stroke}
              strokeWidth={currentSize.strokeWidth}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{
                strokeDasharray,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className={`${currentSize.textSize} font-bold text-gray-900 font-['Montserrat']`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {Math.round(percentage)}%
            </motion.span>
            <span className="text-xs text-gray-500 font-['Montserrat']">
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 font-['Montserrat']">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 font-['Montserrat'] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CircularProgress
