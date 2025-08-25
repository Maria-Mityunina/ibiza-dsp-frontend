import React from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear, scaleBand } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { LinearGradient } from '@visx/gradient'
import { ParentSize } from '@visx/responsive'

interface BarData {
  label: string
  value: number
}

interface BarChartProps {
  data: BarData[]
  width?: number
  height?: number
}

const BarChartInner: React.FC<BarChartProps> = ({ 
  data, 
  width = 400, 
  height = 250 
}) => {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // Accessors
  const getLabel = (d: BarData) => d.label
  const getValue = (d: BarData) => d.value

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
    domain: [0, Math.max(...data.map(getValue)) * 1.1],
  })

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <LinearGradient
          id="bar-gradient"
          from="#06b6d4"
          to="#0891b2"
          fromOpacity={1}
          toOpacity={0.9}
        />
        <LinearGradient
          id="bar-hover-gradient"
          from="#0284c7"
          to="#0369a1"
          fromOpacity={1}
          toOpacity={0.9}
        />
        
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#f3f4f6"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          
          {/* Bars */}
          {data.map((d) => {
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(getValue(d)) ?? 0)
            const barX = xScale(getLabel(d))
            const barY = yMax - barHeight
            
            return (
              <Bar
                key={`bar-${getLabel(d)}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="url(#bar-gradient)"
                rx={4}
                className="transition-all duration-300 hover:brightness-110"
                style={{
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                }}
              />
            )
          })}
          
          {/* Value labels on bars */}
          {data.map((d) => {
            const barX = xScale(getLabel(d))
            const barY = yScale(getValue(d))
            
            return (
              <text
                key={`label-${getLabel(d)}`}
                x={(barX ?? 0) + xScale.bandwidth() / 2}
                y={(barY ?? 0) - 5}
                fontSize={10}
                fill="#374151"
                textAnchor="middle"
                fontWeight="600"
              >
                {getValue(d)}%
              </text>
            )
          })}
          
          {/* Axes */}
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke="#9ca3af"
            tickStroke="#9ca3af"
            tickLabelProps={{
              fill: '#6b7280',
              fontSize: 10,
              textAnchor: 'middle',
            }}
          />
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="#9ca3af"
            tickStroke="#9ca3af"
            tickLabelProps={{
              fill: '#6b7280',
              fontSize: 10,
              textAnchor: 'end',
              dx: -10,
            }}
            tickFormat={(value) => `${value}%`}
          />
        </Group>
      </svg>
    </div>
  )
}

const BarChart: React.FC<Omit<BarChartProps, 'width' | 'height'>> = ({ data }) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <BarChartInner data={data} width={width} height={height || 250} />
      )}
    </ParentSize>
  )
}

export default BarChart
export type { BarData }
