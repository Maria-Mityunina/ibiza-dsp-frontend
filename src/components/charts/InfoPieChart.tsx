import React, { useState } from 'react'
import { Group } from '@visx/group'
import { Pie, pie } from '@visx/shape'
import { ParentSize } from '@visx/responsive'

interface InfoPieData {
  label: string
  value: number
  count: string
  color?: string
}

interface InfoPieChartProps {
  data: InfoPieData[]
  width?: number
  height?: number
  centerValue?: string
  centerLabel?: string
}

const InfoPieChartInner: React.FC<InfoPieChartProps> = ({ 
  data, 
  width = 350, 
  height = 300,
  centerValue = "2.8%",
  centerLabel = "AVG CTR"
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)
  
  // Compact layout for container
  const pieSize = Math.min(width * 0.5, height * 0.8)
  const radius = pieSize / 2
  const centerY = height / 2
  const centerX = pieSize / 2 + 30
  
  // Infographic colors like in the reference image
  const colors = [
    '#26C6DA', // cyan - primary
    '#FF5722', // deep orange/red - secondary
    '#78909C', // blue grey - neutral
    '#546E7A', // darker grey
    '#00BCD4', // light cyan
    '#FF7043', // lighter orange
  ]

  const pieGenerator = pie<InfoPieData>({
    value: (d) => d.value,
    padAngle: 0.01,
    sort: null,
  })

  const arcs = pieGenerator(data)

  return (
    <div className="w-full h-full flex items-center justify-between bg-white overflow-hidden">
      {/* Pie Chart */}
      <div className="flex-shrink-0" style={{ width: pieSize + 60 }}>
        <svg width={pieSize + 60} height={height}>
          <Group top={centerY} left={centerX}>
            <Pie
              data={data}
              pieValue={(d) => d.value}
              outerRadius={radius}
              innerRadius={0}
              cornerRadius={0}
              padAngle={0.01}
            >
              {(pie) =>
                pie.arcs.map((arc, i) => {
                  const [centroidX, centroidY] = pie.path.centroid(arc)
                  const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
                  const arcColor = colors[i % colors.length]
                  
                  return (
                    <g key={`arc-${i}`}>
                      {/* Main arc with clean style */}
                      <path
                        d={pie.path(arc) || ''}
                        fill={arcColor}
                        stroke="white"
                        strokeWidth={2}
                        onMouseEnter={() => setHoveredSlice(i)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        style={{
                          filter: hoveredSlice === i ? 'brightness(1.1)' : 'none',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                      />
                      
                      {/* Percentage label on slice */}
                      {hasSpaceForLabel && (
                        <text
                          x={centroidX}
                          y={centroidY}
                          dy="0.33em"
                          fontSize={12}
                          fontWeight="600"
                          fill="white"
                          textAnchor="middle"
                          pointerEvents="none"
                          fontFamily="Montserrat"
                        >
                          {arc.data.value}%
                        </text>
                      )}
                    </g>
                  )
                })
              }
            </Pie>
            
            {/* Center content */}
            <g>
              <text
                textAnchor="middle"
                fontSize={18}
                fontWeight="700"
                fill="#37474F"
                fontFamily="Montserrat"
              >
                {centerValue}
              </text>
              <text
                textAnchor="middle"
                y={16}
                fontSize={10}
                fill="#78909C"
                fontFamily="Montserrat"
                fontWeight="400"
              >
                {centerLabel}
              </text>
            </g>
          </Group>
        </svg>
      </div>
      
      {/* Compact Legend */}
      <div className="flex-1 min-w-0 ml-4 space-y-3 pr-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 font-['Montserrat'] truncate">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 font-['Montserrat'] truncate">
                  {item.count}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xl font-bold font-['Montserrat']" style={{ color: colors[i % colors.length] }}>
                {item.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const InfoPieChart: React.FC<Omit<InfoPieChartProps, 'width' | 'height'>> = (props) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <InfoPieChartInner {...props} width={width} height={height} />
      )}
    </ParentSize>
  )
}

export default InfoPieChart