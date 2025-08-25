import React from 'react'
import { motion } from 'framer-motion'

interface SpeedometerChartProps {
  value: number
  max: number
  title: string
  subtitle?: string
  unit?: string
  color?: 'green' | 'red' | 'black'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SpeedometerChart: React.FC<SpeedometerChartProps> = ({
  value,
  max,
  title,
  subtitle,
  unit = '',
  color = 'black',
  size = 'md',
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  const angle = (percentage / 100) * 180 - 90 // -90 to 90 degrees
  
  const sizes = {
    sm: { width: 140, height: 80, textSize: 'text-xl', titleSize: 'text-sm' },
    md: { width: 180, height: 100, textSize: 'text-2xl', titleSize: 'text-base' },
    lg: { width: 220, height: 120, textSize: 'text-3xl', titleSize: 'text-lg' }
  }

  const currentSize = sizes[size]
  const radius = currentSize.width / 3
  const centerX = currentSize.width / 2
  const centerY = currentSize.height - 20

  const colorClasses = {
    green: { stroke: '#10b981', needle: '#059669' },
    red: { stroke: '#ef4444', needle: '#dc2626' },
    black: { stroke: '#374151', needle: '#111827' }
  }

  const currentColor = colorClasses[color]

  // Calculate needle end position
  const needleLength = radius - 10
  const needleX = centerX + needleLength * Math.cos((angle * Math.PI) / 180)
  const needleY = centerY + needleLength * Math.sin((angle * Math.PI) / 180)

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="text-center space-y-4">
        <div>
          <h3 className={`font-semibold text-gray-900 font-['Montserrat'] ${currentSize.titleSize}`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 font-['Montserrat']">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative" style={{ height: currentSize.height }}>
          <svg width={currentSize.width} height={currentSize.height}>
            {/* Background arc */}
            <path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            {/* Progress arc */}
            <motion.path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${
                centerX + radius * Math.cos(Math.PI * (1 - percentage / 100))
              } ${centerY + radius * Math.sin(Math.PI * (1 - percentage / 100))}`}
              fill="none"
              stroke={currentColor.stroke}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />

            {/* Needle */}
            <motion.g
              initial={{ rotate: -90 }}
              animate={{ rotate: angle }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
            >
              <line
                x1={centerX}
                y1={centerY}
                x2={centerX + needleLength}
                y2={centerY}
                stroke={currentColor.needle}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r="6"
                fill={currentColor.needle}
              />
            </motion.g>

            {/* Scale markers */}
            {[0, 25, 50, 75, 100].map((mark) => {
              const markAngle = (mark / 100) * 180 - 90
              const markStartX = centerX + (radius - 15) * Math.cos((markAngle * Math.PI) / 180)
              const markStartY = centerY + (radius - 15) * Math.sin((markAngle * Math.PI) / 180)
              const markEndX = centerX + (radius - 5) * Math.cos((markAngle * Math.PI) / 180)
              const markEndY = centerY + (radius - 5) * Math.sin((markAngle * Math.PI) / 180)

              return (
                <line
                  key={mark}
                  x1={markStartX}
                  y1={markStartY}
                  x2={markEndX}
                  y2={markEndY}
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
              )
            })}
          </svg>

          {/* Value display */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <motion.p
              className={`font-bold text-gray-900 font-['Montserrat'] ${currentSize.textSize}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              {value.toLocaleString()}{unit}
            </motion.p>
            <p className="text-xs text-gray-500 font-['Montserrat']">
              из {max.toLocaleString()}{unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpeedometerChart
