import React from 'react'
import { Group } from '@visx/group'
import { AreaClosed } from '@visx/shape'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { scaleTime, scaleLinear } from '@visx/scale'
import { ParentSize } from '@visx/responsive'

interface AreaDataPoint {
  date: Date
  impressions: number
  clicks: number
}

interface AreaChartProps {
  data: AreaDataPoint[]
  width?: number
  height?: number
}

const AreaChartInner: React.FC<AreaChartProps> = ({ 
  data, 
  width = 500, 
  height = 300 
}) => {
  const margin = { top: 20, right: 40, bottom: 40, left: 60 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // Accessors
  const getDate = (d: AreaDataPoint) => d.date
  const getImpressions = (d: AreaDataPoint) => d.impressions
  const getClicks = (d: AreaDataPoint) => d.clicks

  // Scales
  const dateScale = scaleTime<number>({
    range: [0, xMax],
    domain: [Math.min(...data.map(getDate)), Math.max(...data.map(getDate))],
  })

  const impressionsScale = scaleLinear<number>({
    range: [yMax, 0],
    domain: [0, Math.max(...data.map(getImpressions))],
    nice: true,
  })

  const clicksScale = scaleLinear<number>({
    range: [yMax, 0],
    domain: [0, Math.max(...data.map(getClicks))],
    nice: true,
  })

  return (
    <div className="w-full h-full bg-white">
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows scale={impressionsScale} width={xMax} strokeDasharray="2,2" stroke="#E5E7EB" strokeOpacity={0.5} />
          <GridColumns scale={dateScale} height={yMax} strokeDasharray="2,2" stroke="#E5E7EB" strokeOpacity={0.5} />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="impressions-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#26C6DA" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#26C6DA" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="clicks-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5722" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#FF5722" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Areas */}
          <AreaClosed<AreaDataPoint>
            data={data}
            x={d => dateScale(getDate(d)) ?? 0}
            y={d => impressionsScale(getImpressions(d)) ?? 0}
            yScale={impressionsScale}
            stroke="#26C6DA"
            fill="url(#impressions-gradient)"
            strokeWidth={3}
          />
          
          <AreaClosed<AreaDataPoint>
            data={data}
            x={d => dateScale(getDate(d)) ?? 0}
            y={d => clicksScale(getClicks(d)) ?? 0}
            yScale={clicksScale}
            stroke="#FF5722"
            fill="url(#clicks-gradient)"
            strokeWidth={3}
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={`points-${i}`}>
              <circle
                cx={dateScale(getDate(d))}
                cy={impressionsScale(getImpressions(d))}
                r={4}
                fill="#26C6DA"
                stroke="white"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(38, 198, 218, 0.3))' }}
              />
              <circle
                cx={dateScale(getDate(d))}
                cy={clicksScale(getClicks(d))}
                r={4}
                fill="#FF5722"
                stroke="white"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(255, 87, 34, 0.3))' }}
              />
            </g>
          ))}
          
          {/* Axes */}
          <AxisLeft
            scale={impressionsScale}
            tickFormat={(value) => `${(Number(value) / 1000).toFixed(0)}k`}
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
            scale={dateScale}
            tickFormat={(value) => {
              const date = new Date(value)
              return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`
            }}
            stroke="#9CA3AF"
            tickStroke="#9CA3AF"
            tickLabelProps={{
              fill: '#6B7280',
              fontSize: 11,
              fontFamily: 'Montserrat'
            }}
          />

          {/* Legend */}
          <g transform={`translate(${xMax - 140}, 20)`}>
            <rect x={0} y={0} width={120} height={45} rx={6} fill="white" fillOpacity={0.95} stroke="#E5E7EB" />
            <g transform="translate(8, 12)">
              <circle cx={6} cy={6} r={4} fill="#26C6DA" />
              <text x={16} y={10} fontSize={11} fill="#37474F" fontFamily="Montserrat" fontWeight="500">Показы</text>
              <circle cx={6} cy={20} r={4} fill="#FF5722" />
              <text x={16} y={24} fontSize={11} fill="#37474F" fontFamily="Montserrat" fontWeight="500">Клики</text>
            </g>
          </g>
        </Group>
      </svg>
    </div>
  )
}

const AreaChart: React.FC<Omit<AreaChartProps, 'width' | 'height'>> = (props) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <AreaChartInner {...props} width={width} height={height} />
      )}
    </ParentSize>
  )
}

export default AreaChart