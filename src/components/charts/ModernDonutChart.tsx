import React from 'react'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { pie } from 'd3-shape'
import { motion, AnimatePresence } from 'framer-motion'

interface DonutData {
  label: string
  value: number
  color: string
}

interface ModernDonutChartProps {
  data: DonutData[]
  width?: number
  height?: number
  title: string
  centerLabel?: string
  centerValue?: string
  className?: string
}

const ModernDonutChart: React.FC<ModernDonutChartProps> = ({
  data,
  width = 300,
  height = 300,
  title,
  centerLabel,
  centerValue,
  className
}) => {
  const innerRadius = 60
  const outerRadius = 110
  const centerX = width / 2
  const centerY = height / 2

  const pieGenerator = pie<DonutData>({
    value: (d) => d.value,
    sort: null,
    padAngle: 0.02
  })

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 font-['Montserrat']">
        {title}
      </h3>
      
      <div className="flex items-center justify-between">
        <div className="relative">
          <motion.svg
            width={width}
            height={height}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Group left={centerX} top={centerY}>
              <Pie
                data={data}
                pieValue={(d) => d.value}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                padAngle={0.02}
              >
                {(pie) => {
                  return pie.arcs.map((arc, index) => {
                    const { data } = arc
                    return (
                      <motion.g
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <motion.path
                          d={pie.path(arc) || ''}
                          fill={data.color}
                          whileHover={{
                            filter: 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                          }}
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                          }}
                        />
                      </motion.g>
                    )
                  })
                }}
              </Pie>
            </Group>
            
            {/* Center content */}
            {(centerLabel || centerValue) && (
              <foreignObject
                x={centerX - 50}
                y={centerY - 20}
                width={100}
                height={40}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  {centerValue && (
                    <span className="text-2xl font-bold text-gray-900 font-['Montserrat']">
                      {centerValue}
                    </span>
                  )}
                  {centerLabel && (
                    <span className="text-xs text-gray-500 font-['Montserrat']">
                      {centerLabel}
                    </span>
                  )}
                </div>
              </foreignObject>
            )}
          </motion.svg>
        </div>
        
        {/* Legend */}
        <div className="ml-6 space-y-3">
          <AnimatePresence>
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1)
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 font-['Montserrat']">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.value.toLocaleString()} ({percentage}%)
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ModernDonutChart
