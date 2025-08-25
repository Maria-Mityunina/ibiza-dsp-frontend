import React, { useMemo, useState } from 'react'
import { Group } from '@visx/group'
import { LinePath, AreaClosed } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { LinearGradient } from '@visx/gradient'
import { motion } from 'framer-motion'

interface LineData {
  date: Date
  value: number
}

interface ModernLineChartProps {
  data: LineData[]
  width?: number
  height?: number
  title: string
  color?: 'green' | 'red' | 'black' | 'orange' | 'purple'
  showArea?: boolean
  className?: string
}

const ModernLineChart: React.FC<ModernLineChartProps> = ({
  data,
  width = 500,
  height = 250,
  title,
  color = 'black',
  showArea = true,
  className
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: LineData } | null>(null)
  const margin = { top: 20, right: 30, bottom: 40, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const getX = (d: LineData) => d.date
  const getY = (d: LineData) => d.value

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))]
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
    black: '#374151',
    orange: '#f59e0b',
    purple: '#8b5cf6'
  }

  const gradientId = `gradient-${color}`

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - svgRect.left - margin.left
    const y = event.clientY - svgRect.top - margin.top

    // Find closest data point
    const closestPoint = data.reduce((closest, d) => {
      const currentX = xScale(getX(d)) ?? 0
      const currentY = yScale(getY(d)) ?? 0
      const currentDistance = Math.sqrt(Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2))
      
      if (!closest || currentDistance < closest.distance) {
        return { distance: currentDistance, data: d, x: currentX, y: currentY }
      }
      return closest
    }, null as any)

    if (closestPoint && closestPoint.distance < 30) {
      setHoveredPoint({
        x: closestPoint.x,
        y: closestPoint.y,
        data: closestPoint.data
      })
    } else {
      setHoveredPoint(null)
    }
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
        <svg 
          width={width} 
          height={height}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
          style={{ cursor: 'crosshair' }}
        >
          <LinearGradient
            id={gradientId}
            from={colorMap[color]}
            to={colorMap[color]}
            fromOpacity={0.3}
            toOpacity={0}
          />
          
          <Group left={margin.left} top={margin.top}>
            {/* Grid */}
            <GridRows
              scale={yScale}
              width={innerWidth}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
            <GridColumns
              scale={xScale}
              height={innerHeight}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
            
            {/* Area */}
            {showArea && (
              <AreaClosed<LineData>
                data={data}
                x={(d) => xScale(getX(d)) ?? 0}
                y={(d) => yScale(getY(d)) ?? 0}
                yScale={yScale}
                strokeWidth={0}
                fill={`url(#${gradientId})`}
              />
            )}
            
            {/* Line */}
            <LinePath<LineData>
              data={data}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => yScale(getY(d)) ?? 0}
              stroke={colorMap[color]}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
            
            {/* Data points */}
            {data.map((d, i) => {
              const x = xScale(getX(d)) ?? 0
              const y = yScale(getY(d)) ?? 0
              const isHovered = hoveredPoint && 
                Math.abs(hoveredPoint.x - x) < 5 && 
                Math.abs(hoveredPoint.y - y) < 5
              
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3}
                  fill="white"
                  stroke={colorMap[color]}
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    transition: 'all 0.2s ease'
                  }}
                />
              )
            })}

            {/* Hover tooltip */}
            {hoveredPoint && (
              <g>
                <rect
                  x={hoveredPoint.x + 10}
                  y={hoveredPoint.y - 25}
                  width={80}
                  height={20}
                  fill="rgba(0,0,0,0.8)"
                  rx={4}
                />
                <text
                  x={hoveredPoint.x + 50}
                  y={hoveredPoint.y - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize={12}
                  fontFamily="Montserrat"
                >
                  {hoveredPoint.data.value.toLocaleString()}
                </text>
              </g>
            )}
            
            {/* Axes */}
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              numTicks={5}
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

export default ModernLineChart