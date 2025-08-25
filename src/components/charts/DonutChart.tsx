import React from 'react'
import { Group } from '@visx/group'
import { Pie, pie } from '@visx/shape'
import { ParentSize } from '@visx/responsive'

interface DonutData {
  label: string
  value: number
  color?: string
}

interface DonutChartProps {
  data: DonutData[]
  width?: number
  height?: number
  title?: string
  centerValue?: string
  centerLabel?: string
}

const DonutChartInner: React.FC<DonutChartProps> = ({ 
  data, 
  width = 300, 
  height = 300,
  title,
  centerValue,
  centerLabel
}) => {
  const pieSize = Math.min(width * 0.6, height * 0.8)
  const radius = pieSize / 2
  const centerY = height / 2
  const centerX = pieSize / 2 + 30
  const donutThickness = 30

  // Infographic colors like in the reference image
  const colors = [
    '#26C6DA', // cyan - primary
    '#FF5722', // deep orange/red - secondary
    '#78909C', // blue grey - neutral
    '#546E7A', // darker grey
    '#00BCD4', // light cyan
  ]

  const pieGenerator = pie<DonutData>({
    value: (d) => d.value,
    padAngle: 0.01,
    sort: null,
  })

  const arcs = pieGenerator(data)

  return (
    <div className="w-full h-full flex items-center justify-between bg-white overflow-hidden">
      {/* Donut Chart */}
      <div className="flex-shrink-0" style={{ width: pieSize + 60 }}>
        <svg width={pieSize + 60} height={height}>
          <Group top={centerY} left={centerX}>
            <Pie
              data={data}
              pieValue={(d) => d.value}
              outerRadius={radius}
              innerRadius={radius - donutThickness}
              cornerRadius={0}
              padAngle={0.01}
            >
              {(pie) =>
                pie.arcs.map((arc, i) => {
                  const arcColor = colors[i % colors.length]
                  
                  return (
                    <path
                      key={`arc-${i}`}
                      d={pie.path(arc) || ''}
                      fill={arcColor}
                      stroke="white"
                      strokeWidth={2}
                    />
                  )
                })
              }
            </Pie>
            
            {/* Center content */}
            <g>
              <text
                textAnchor="middle"
                fontSize={24}
                fontWeight="700"
                fill="#37474F"
                fontFamily="Montserrat"
              >
                {centerValue || '100%'}
              </text>
              <text
                textAnchor="middle"
                y={18}
                fontSize={12}
                fill="#78909C"
                fontFamily="Montserrat"
                fontWeight="400"
              >
                {centerLabel || 'охват'}
              </text>
            </g>
          </Group>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex-1 space-y-4 ml-4 pr-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-sm font-medium text-gray-800 font-['Montserrat'] truncate">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-semibold font-['Montserrat'] flex-shrink-0" style={{ color: colors[i % colors.length] }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DonutChart: React.FC<Omit<DonutChartProps, 'width' | 'height'>> = (props) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <DonutChartInner {...props} width={width} height={height} />
      )}
    </ParentSize>
  )
}

export default DonutChart