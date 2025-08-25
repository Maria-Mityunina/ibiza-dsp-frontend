import React from 'react'
import { Group } from '@visx/group'
import { curveBasis } from '@visx/curve'
import { LinePath, Area } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { LinearGradient } from '@visx/gradient'
import { ParentSize } from '@visx/responsive'

interface DataPoint {
  date: Date
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  width?: number
  height?: number
}

const LineChartInner: React.FC<LineChartProps> = ({ 
  data, 
  width = 400, 
  height = 200 
}) => {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Accessors
  const getDate = (d: DataPoint) => d.date
  const getValue = (d: DataPoint) => d.value

  // Scales
  const xScale = scaleTime({
    range: [0, innerWidth],
    domain: [Math.min(...data.map(getDate)), Math.max(...data.map(getDate))],
  })

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, Math.max(...data.map(getValue)) * 1.1],
  })

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <LinearGradient
          id="area-gradient"
          from="#6366f1"
          to="#a855f7"
          fromOpacity={0.4}
          toOpacity={0.05}
        />
        <LinearGradient
          id="line-gradient"
          from="#6366f1"
          to="#a855f7"
          fromOpacity={1}
          toOpacity={1}
        />
        
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows
            scale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="#f3f4f6"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          <GridColumns
            scale={xScale}
            width={innerWidth}
            height={innerHeight}
            stroke="#f3f4f6"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          
          {/* Area */}
          <Area
            data={data}
            x={(d) => xScale(getDate(d)) ?? 0}
            y0={innerHeight}
            y1={(d) => yScale(getValue(d)) ?? 0}
            fill="url(#area-gradient)"
            curve={curveBasis}
          />
          
          {/* Line */}
          <LinePath
            data={data}
            x={(d) => xScale(getDate(d)) ?? 0}
            y={(d) => yScale(getValue(d)) ?? 0}
            stroke="url(#line-gradient)"
            strokeWidth={3}
            curve={curveBasis}
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(getDate(d))}
              cy={yScale(getValue(d))}
              r={5}
              fill="#6366f1"
              stroke="white"
              strokeWidth={3}
              className="drop-shadow-md transition-all duration-300 hover:r-6 cursor-pointer"
              style={{
                filter: 'drop-shadow(0px 4px 8px rgba(99, 102, 241, 0.3))'
              }}
            />
          ))}
          
          {/* Axes */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            numTicks={6}
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

const LineChart: React.FC<Omit<LineChartProps, 'width' | 'height'>> = ({ data }) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <LineChartInner data={data} width={width} height={height || 250} />
      )}
    </ParentSize>
  )
}

export default LineChart
export type { DataPoint }
