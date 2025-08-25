import React, { useState } from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear, scaleBand } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { LinearGradient } from '@visx/gradient'
import { ParentSize } from '@visx/responsive'
// Removed react-spring for simpler design

interface GradientBarData {
  label: string
  value: number
  color: [string, string] // [from, to] for gradient
}

interface GradientBarChartProps {
  data: GradientBarData[]
  width?: number
  height?: number
  title?: string
}

const GradientBarChartInner: React.FC<GradientBarChartProps> = ({ 
  data, 
  width = 400, 
  height = 300,
  title
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const margin = { top: 30, right: 20, bottom: 50, left: 60 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // Accessors
  const getLabel = (d: GradientBarData) => d.label
  const getValue = (d: GradientBarData) => d.value

  // Scales
  const xScale = scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: data.map(getLabel),
    padding: 0.3,
  })

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(getValue)) * 1.1],
  })

  return (
    <div className="w-full h-full">
      <div className="mb-4 text-center">
        {title && <h3 className="text-base font-normal text-gray-900">{title}</h3>}
      </div>
      
      <svg width={width} height={height}>
        <defs>
          {data.map((d, i) => (
            <LinearGradient
              key={i}
              id={`gradient-bar-${i}`}
              from={d.color[0]}
              to={d.color[1]}
              fromOpacity={1}
              toOpacity={0.9}
            />
          ))}
        </defs>
        
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
          
          {/* Bars */}
          {data.map((d, i) => {
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(getValue(d)) ?? 0)
            const barX = xScale(getLabel(d))
            const barY = yMax - barHeight
            const isHovered = hoveredBar === i
            
            return (
              <g key={`bar-group-${i}`}>
                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#gradient-bar-${i})`}
                  rx={4}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: isHovered ? 0.8 : 1
                  }}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                
                {/* Value label */}
                <text
                  x={(barX ?? 0) + barWidth / 2}
                  y={(barY ?? 0) - 6}
                  fontSize={10}
                  fill="#6b7280"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {getValue(d)}%
                </text>
              </g>
            )
          })}
          
          {/* Axes */}
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke="#e2e8f0"
            tickStroke="#e2e8f0"
            tickLabelProps={{
              fill: '#6b7280',
              fontSize: 11,
              textAnchor: 'middle',
              fontWeight: '500'
            }}
          />
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="#e2e8f0"
            tickStroke="#e2e8f0"
            tickLabelProps={{
              fill: '#6b7280',
              fontSize: 10,
              textAnchor: 'end',
              dx: -10,
              fontWeight: '400'
            }}
            tickFormat={(value) => `${value}%`}
          />
        </Group>
      </svg>
    </div>
  )
}

const GradientBarChart: React.FC<Omit<GradientBarChartProps, 'width' | 'height'>> = ({ 
  data, 
  title 
}) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <GradientBarChartInner 
          data={data} 
          width={width} 
          height={height || 320}
          title={title}
        />
      )}
    </ParentSize>
  )
}

export default GradientBarChart
export type { GradientBarData }
