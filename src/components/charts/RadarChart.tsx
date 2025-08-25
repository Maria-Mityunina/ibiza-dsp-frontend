import React from 'react'

interface RadarChartData {
  subject: string
  value: number
  fullMark: number
}

interface RadarChartProps {
  data: RadarChartData[]
  title?: string
  className?: string
}

const RadarChart: React.FC<RadarChartProps> = ({ data, title, className = '' }) => {
  const width = 280
  const height = 280
  const margin = { top: 40, right: 40, bottom: 40, left: 40 }
  const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2

  // Calculate points for each data item
  const getPoint = (value: number, index: number, maxRadius: number = radius) => {
    const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2
    const scaledRadius = (value / 100) * maxRadius
    
    return {
      x: Math.cos(angle) * scaledRadius,
      y: Math.sin(angle) * scaledRadius
    }
  }

  // Generate path string for the radar area
  const getRadarPath = () => {
    const points = data.map((d, i) => getPoint(d.value, i))
    const pathCommands = points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ')
    return `${pathCommands} Z`
  }

  // Generate grid circles
  const gridLevels = [20, 40, 60, 80, 100]

  return (
    <div className={`bg-slate-900 rounded-2xl p-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-medium">{title}</h3>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      )}
      
      <div className="h-64 flex items-center justify-center">
        <svg width={width} height={height}>
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {/* Grid circles */}
            {gridLevels.map((level, i) => (
              <circle
                key={level}
                r={(level / 100) * radius}
                fill="none"
                stroke="#374151"
                strokeWidth={1}
                opacity={0.3}
              />
            ))}
            
            {/* Grid lines */}
            {data.map((_, index) => {
              const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              
              return (
                <line
                  key={index}
                  x1={0}
                  y1={0}
                  x2={x}
                  y2={y}
                  stroke="#374151"
                  strokeWidth={1}
                  opacity={0.3}
                />
              )
            })}
            
            {/* Data area */}
            <path
              d={getRadarPath()}
              fill="#3B82F6"
              fillOpacity={0.1}
              stroke="#3B82F6"
              strokeWidth={2}
            />
            
            {/* Data points */}
            {data.map((d, index) => {
              const point = getPoint(d.value, index)
              return (
                <circle
                  key={d.subject}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill="#3B82F6"
                  stroke="#1e293b"
                  strokeWidth={2}
                />
              )
            })}
            
            {/* Labels */}
            {data.map((d, index) => {
              const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2
              const labelRadius = radius + 20
              const x = Math.cos(angle) * labelRadius
              const y = Math.sin(angle) * labelRadius
              
              return (
                <text
                  key={d.subject}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#9CA3AF"
                  fontSize={12}
                  fontWeight={500}
                >
                  {d.subject}
                </text>
              )
            })}
          </g>
        </svg>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-gray-300">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full border-2 border-green-400"></div>
            <span className="text-gray-300">Target</span>
          </div>
        </div>
        <span className="text-gray-400 text-xs">Updated 2h ago</span>
      </div>
    </div>
  )
}

export default RadarChart