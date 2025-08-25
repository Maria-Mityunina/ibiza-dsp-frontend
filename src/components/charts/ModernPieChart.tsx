import React, { useState } from 'react'
import { Group } from '@visx/group'
import { Pie } from '@visx/shape'
import { scaleOrdinal } from '@visx/scale'
import { ParentSize } from '@visx/responsive'
// Removed react-spring for simpler design

interface PieData {
  label: string
  value: number
  count: string
}

interface ModernPieChartProps {
  data: PieData[]
  width?: number
  height?: number
  centerValue?: string
  centerLabel?: string
}

const ModernPieChartInner: React.FC<ModernPieChartProps> = ({ 
  data, 
  width = 300, 
  height = 300,
  centerValue = "2.8%",
  centerLabel = "avg CTR"
}) => {
  const [activeSlice, setActiveSlice] = useState<number | null>(null)
  const radius = Math.min(width, height) / 2 - 40
  const centerY = height / 2
  const centerX = width / 2

  // Infographic color palette
  const colors = [
    '#26C6DA', // cyan
    '#FF6B6B', // coral  
    '#2C3E50', // dark blue-gray
    '#95A5A6', // light gray
    '#E74C3C', // red
  ]

  const colorScale = scaleOrdinal({
    domain: data.map(d => d.label),
    range: colors,
  })

  const getValue = (d: PieData) => d.value

  return (
    <div className="flex items-center w-full h-full">
      <div className="flex-1 flex justify-center">
        <svg width={width * 0.65} height={height}>
          
          <Group top={centerY} left={(width * 0.65) / 2}>
            <Pie
              data={data}
              pieValue={getValue}
              outerRadius={radius}
              innerRadius={radius * 0.65}
              cornerRadius={6}
              padAngle={0.02}
            >
              {pie => 
                pie.arcs.map((arc, index) => {
                  const isActive = activeSlice === index
                  const [centroidX, centroidY] = pie.path.centroid(arc)
                  
                  return (
                    <g key={`arc-${index}`}>
                      <path
                        d={pie.path(arc) || ''}
                        fill={colorScale(arc.data.label)}
                        className="transition-all duration-200 cursor-pointer"
                        style={{
                          opacity: isActive ? 0.8 : 1
                        }}
                        onMouseEnter={() => setActiveSlice(index)}
                        onMouseLeave={() => setActiveSlice(null)}
                      />
                      
                      {/* Value labels on slices */}
                      <text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fontSize={11}
                        textAnchor="middle"
                        pointerEvents="none"
                        fill="white"
                        fontWeight="600"
                      >
                        {arc.data.value}%
                      </text>
                    </g>
                  )
                })
              }
            </Pie>
            
            {/* Simple center content */}
            <circle 
              cx={0} 
              cy={0} 
              r={radius * 0.6} 
              fill="white" 
            />
            <text
              x={0}
              y={-6}
              textAnchor="middle"
              fontSize={20}
              fontWeight="600"
              fill="#374151"
            >
              {centerValue}
            </text>
            <text
              x={0}
              y={10}
              textAnchor="middle"
              fontSize={11}
              fill="#6b7280"
              fontWeight="400"
            >
              {centerLabel}
            </text>
          </Group>
        </svg>
      </div>
      
      {/* Simple Legend */}
      <div className="flex-1 space-y-3 px-6">
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center space-x-3 p-2 rounded transition-all duration-200 cursor-pointer ${
              activeSlice === index ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            onMouseEnter={() => setActiveSlice(index)}
            onMouseLeave={() => setActiveSlice(null)}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colorScale(item.label) }}
            />
            <div className="flex-1">
              <div className="text-sm font-normal text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.value}% • {item.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ModernPieChart: React.FC<Omit<ModernPieChartProps, 'width' | 'height'>> = ({ 
  data, 
  centerValue, 
  centerLabel 
}) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <ModernPieChartInner 
          data={data} 
          width={width} 
          height={height || 280}
          centerValue={centerValue}
          centerLabel={centerLabel}
        />
      )}
    </ParentSize>
  )
}

export default ModernPieChart
