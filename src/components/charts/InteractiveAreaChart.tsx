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
    domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))]
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
    <div className={`bg-transparent rounded-lg p-0 w-full ${className}`}>
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
                ? 'bg-gray-100 text-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="w-3 h-3 bg-gray-800 rounded-full" />
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
            <div className="w-3 h-3 bg-orange-600 rounded-full" />
            <span className="text-sm font-medium font-['Montserrat']">Клики</span>
          </motion.button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
          <LinearGradient
            id="impressions-gradient"
            from="#1f2937"
            to="#1f2937"
            fromOpacity={0.3}
            toOpacity={0}
          />
          <LinearGradient
            id="clicks-gradient"
            from="#ea580c"
            to="#ea580c"
            fromOpacity={0.3}
            toOpacity={0}
          />
          
          <Group left={margin.left} top={margin.top}>
            <GridRows
              scale={yScale}
              width={innerWidth}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="3,3"
              strokeOpacity={0.3}
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
              stroke="#1f2937"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={hoveredMetric === 'clicks' ? 0.3 : 1}
            />
            
            {/* Clicks Line */}
            <LinePath<AreaData>
              data={data}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => clicksScale(getClicks(d)) ?? 0}
              stroke="#ea580c"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
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
