import React, { useMemo } from 'react'
import { Group } from '@visx/group'
// import { Bar } from '@visx/shape' // Не используется
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { motion } from 'framer-motion'

interface BarData {
  label: string
  value: number
}

interface ModernBarChartProps {
  data: BarData[]
  width?: number
  height?: number
  title: string
  color?: 'green' | 'red' | 'black'
  className?: string
}

const ModernBarChart: React.FC<ModernBarChartProps> = ({
  data,
  width = 500,
  height = 250,
  title,
  color = 'black',
  className
}) => {
  const margin = { top: 20, right: 30, bottom: 60, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const getX = (d: BarData) => d.label
  const getY = (d: BarData) => d.value

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, innerWidth],
        domain: data.map(getX),
        padding: 0.3
      }),
    [innerWidth, data]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [0, Math.max(...data.map(getY)) * 1.1],
        nice: true
      }),
    [innerHeight, data]
  )

  const colorMap = {
    green: '#10b981',
    red: '#ef4444',
    black: '#111827'
  }

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 font-['Montserrat']">
        {title}
      </h3>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg width={width} height={height}>
          <Group left={margin.left} top={margin.top}>
            {/* Grid */}
            <GridRows
              scale={yScale}
              width={innerWidth}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
            
            {/* Bars */}
            {data.map((d, i) => {
              const barWidth = xScale.bandwidth()
              const barHeight = Math.max(0, innerHeight - (yScale(getY(d)) ?? 0))
              const barX = xScale(getX(d))
              const barY = Math.max(0, yScale(getY(d)) ?? 0)

              if (barX === undefined) return null

              return (
                <motion.g key={i}>
                  <motion.rect
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={colorMap[color]}
                    rx={6}
                    ry={6}
                    initial={{ height: 0, y: innerHeight }}
                    animate={{ height: barHeight, y: barY }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    whileHover={{
                      filter: 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                    }}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                  
                  {/* Value labels */}
                  <motion.text
                    x={barX + barWidth / 2}
                    y={Math.max(barY - 8, 15)}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#64748b"
                    fontFamily="Montserrat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                  >
                    {getY(d).toLocaleString()}
                  </motion.text>
                </motion.g>
              )
            })}
            
            {/* Axes */}
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              stroke="#e2e8f0"
              tickStroke="#e2e8f0"
              tickLabelProps={{
                fill: '#64748b',
                fontSize: 12,
                textAnchor: 'middle',
                fontFamily: 'Montserrat'
              }}
            />
            <AxisLeft
              scale={yScale}
              numTicks={5}
              stroke="#e2e8f0"
              tickStroke="#e2e8f0"
              tickLabelProps={{
                fill: '#64748b',
                fontSize: 12,
                textAnchor: 'end',
                dx: '-0.25em',
                dy: '0.25em',
                fontFamily: 'Montserrat'
              }}
            />
          </Group>
        </svg>
      </motion.div>
    </div>
  )
}

export default ModernBarChart
