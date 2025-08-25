import React from 'react'
import { Group } from '@visx/group'
import { Pie } from '@visx/shape'
import { scaleOrdinal } from '@visx/scale'
import { ParentSize } from '@visx/responsive'

interface PieData {
  label: string
  value: number
  count: string
}

interface PieChartProps {
  data: PieData[]
  width?: number
  height?: number
}

const PieChartInner: React.FC<PieChartProps> = ({ 
  data, 
  width = 300, 
  height = 300 
}) => {
  const radius = Math.min(width, height) / 2 - 40
  const centerY = height / 2
  const centerX = width / 2

  // Modern color palette
  const colorScale = scaleOrdinal({
    domain: data.map(d => d.label),
    range: ['#10b981', '#f59e0b', '#8b5cf6'],
  })

  const getValue = (d: PieData) => d.value

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1 flex justify-center">
        <svg width={width * 0.6} height={height}>
          <Group top={centerY} left={(width * 0.6) / 2}>
            <Pie
              data={data}
              pieValue={getValue}
              outerRadius={radius}
              innerRadius={radius * 0.6}
              cornerRadius={3}
              padAngle={0.02}
            >
              {pie => 
                pie.arcs.map((arc, index) => {
                  const [centroidX, centroidY] = pie.path.centroid(arc)
                  const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
                  
                  return (
                    <g key={`arc-${index}`}>
                      <path
                        d={pie.path(arc) || ''}
                        fill={colorScale(arc.data.label)}
                        className="transition-all duration-300 hover:brightness-110"
                        style={{
                          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                        }}
                      />
                      {hasSpaceForLabel && (
                        <text
                          x={centroidX}
                          y={centroidY}
                          dy=".33em"
                          fontSize={12}
                          textAnchor="middle"
                          pointerEvents="none"
                          fill="white"
                          fontWeight="600"
                        >
                          {arc.data.value}%
                        </text>
                      )}
                    </g>
                  )
                })
              }
            </Pie>
            
            {/* Center text */}
            <text
              x={0}
              y={-8}
              textAnchor="middle"
              fontSize={18}
              fontWeight="600"
              fill="#111827"
            >
              2.8%
            </text>
            <text
              x={0}
              y={10}
              textAnchor="middle"
              fontSize={12}
              fill="#6b7280"
            >
              avg CTR
            </text>
          </Group>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex-1 space-y-4 px-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: colorScale(item.label) }}
            />
            <div className="flex-1">
              <div className="text-sm font-normal text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.value}% ({item.count})</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PieChart: React.FC<Omit<PieChartProps, 'width' | 'height'>> = ({ data }) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <PieChartInner data={data} width={width} height={height || 250} />
      )}
    </ParentSize>
  )
}

export default PieChart
export type { PieData }
