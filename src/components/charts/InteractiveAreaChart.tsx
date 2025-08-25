import React, { useState } from 'react'
import { Group } from '@visx/group'
import { AreaClosed, LinePath } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { LinearGradient } from '@visx/gradient'
import { motion } from 'framer-motion'

interface AreaData {
  date: Date
  impressions: number
  clicks: number
}

interface InteractiveAreaChartProps {
  data: AreaData[]
  width?: number
  height?: number
  title: string
  className?: string
}

const InteractiveAreaChart: React.FC<InteractiveAreaChartProps> = ({
  data,
  width = 500,
  height = 250,
  title,
  className
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<'impressions' | 'clicks' | null>(null)
  const margin = { top: 20, right: 30, bottom: 40, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const getX = (d: AreaData) => d.date
  const getImpressions = (d: AreaData) => d.impressions
  const getClicks = (d: AreaData) => d.clicks

  const xScale = scaleTime({
    range: [0, innerWidth],
    domain: [Math.min(...data.map(getX)), Math.max(...data.map(getX))]
  })

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, Math.max(...data.map(getImpressions)) * 1.1],
    nice: true
  })

  const clicksScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, Math.max(...data.map(getClicks)) * 1.1],
    nice: true
  })

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 font-['Montserrat']">
          {title}
        </h3>
        
        {/* Legend */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setHoveredMetric(hoveredMetric === 'impressions' ? null : 'impressions')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-all ${
              hoveredMetric === 'impressions' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm font-medium font-['Montserrat']">Показы</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setHoveredMetric(hoveredMetric === 'clicks' ? null : 'clicks')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-all ${
              hoveredMetric === 'clicks' 
                ? 'bg-orange-100 text-orange-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-sm font-medium font-['Montserrat']">Клики</span>
          </motion.button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg width={width} height={height}>
          <LinearGradient
            id="impressions-gradient"
            from="#10b981"
            to="#10b981"
            fromOpacity={0.4}
            toOpacity={0}
          />
          <LinearGradient
            id="clicks-gradient"
            from="#f59e0b"
            to="#f59e0b"
            fromOpacity={0.4}
            toOpacity={0}
          />
          
          <Group left={margin.left} top={margin.top}>
            <GridRows
              scale={yScale}
              width={innerWidth}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
            
            {/* Impressions Area */}
            <AreaClosed<AreaData>
              data={data}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => yScale(getImpressions(d)) ?? 0}
              yScale={yScale}
              strokeWidth={0}
              fill="url(#impressions-gradient)"
              opacity={hoveredMetric === 'clicks' ? 0.3 : 1}
            />
            
            {/* Clicks Area */}
            <AreaClosed<AreaData>
              data={data}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => clicksScale(getClicks(d)) ?? 0}
              yScale={clicksScale}
              strokeWidth={0}
              fill="url(#clicks-gradient)"
              opacity={hoveredMetric === 'impressions' ? 0.3 : 1}
            />
            
            {/* Impressions Line */}
            <LinePath<AreaData>
              data={data}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => yScale(getImpressions(d)) ?? 0}
              stroke="#10b981"
              strokeWidth={3}
              opacity={hoveredMetric === 'clicks' ? 0.3 : 1}
            />
            
            {/* Clicks Line */}
            <LinePath<AreaData>
              data={data}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => clicksScale(getClicks(d)) ?? 0}
              stroke="#f59e0b"
              strokeWidth={3}
              opacity={hoveredMetric === 'impressions' ? 0.3 : 1}
            />
            
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

export default InteractiveAreaChart
