import React, { useState } from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear, scaleBand } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { ParentSize } from '@visx/responsive'

interface InfoBarData {
  label: string
  value: number
}

interface InfoBarChartProps {
  data: InfoBarData[]
  width?: number
  height?: number
}

const InfoBarChartInner: React.FC<InfoBarChartProps> = ({ 
  data, 
  width = 400, 
  height = 300
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const margin = { top: 20, right: 30, bottom: 50, left: 50 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // Infographic colors like in the reference image
  const colors = [
    '#26C6DA', // cyan - primary
    '#FF5722', // deep orange - secondary  
    '#78909C', // blue grey
    '#00BCD4', // light cyan
    '#FF7043', // orange accent
    '#546E7A', // dark grey
  ]

  // Accessors
  const getLabel = (d: InfoBarData) => d.label
  const getValue = (d: InfoBarData) => d.value

  // Scales
  const xScale = scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: data.map(getLabel),
    padding: 0.4,
  })

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(getValue)) * 1.2],
  })

  return (
    <div className="w-full h-full bg-white">
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Bars */}
          {data.map((d, i) => {
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(getValue(d)) ?? 0)
            const barX = xScale(getLabel(d))
            const barY = yMax - barHeight
            const color = colors[i % colors.length]

            // Prevent negative heights
            if (barHeight < 0 || barX === undefined) return null
            
            return (
              <g key={`bar-${i}`}>
                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={Math.max(0, barHeight)}
                  fill={color}
                  rx={6}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{
                    filter: hoveredBar === i 
                      ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.15)) brightness(1.1) scale(1.05)' 
                      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center bottom',
                    cursor: 'pointer'
                  }}
                />
                {/* Value label on top of bar */}
                {barHeight > 10 && (
                  <text
                    x={barX + barWidth / 2}
                    y={barY - 5}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="600"
                    fill={color}
                    fontFamily="Montserrat"
                  >
                    {getValue(d).toFixed(1)}%
                  </text>
                )}
              </g>
            )
          })}

          {/* Axes */}
          <AxisLeft
            scale={yScale}
            tickFormat={(value) => `${Number(value).toFixed(1)}%`}
            stroke="#9CA3AF"
            tickStroke="#9CA3AF"
            tickLabelProps={{
              fill: '#6B7280',
              fontSize: 11,
              fontFamily: 'Montserrat'
            }}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke="#9CA3AF"
            tickStroke="#9CA3AF"
            tickLabelProps={{
              fill: '#6B7280',
              fontSize: 11,
              fontFamily: 'Montserrat',
              textAnchor: 'middle'
            }}
          />
        </Group>
      </svg>
    </div>
  )
}

const InfoBarChart: React.FC<Omit<InfoBarChartProps, 'width' | 'height'>> = (props) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <InfoBarChartInner {...props} width={width} height={height} />
      )}
    </ParentSize>
  )
}

export default InfoBarChart