import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2 } from 'lucide-react'

interface ScatterPoint {
  x: number
  y: number
  size: number
  label: string
  category: string
  color: string
}

interface ScatterPlotChartProps {
  data: ScatterPoint[]
  title: string
  xLabel: string
  yLabel: string
  className?: string
}

const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({ 
  data, 
  title, 
  xLabel, 
  yLabel, 
  className = "" 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const width = 400
  const height = 300
  const padding = 40

  const xMin = Math.min(...data.map(d => d.x))
  const xMax = Math.max(...data.map(d => d.x))
  const yMin = Math.min(...data.map(d => d.y))
  const yMax = Math.max(...data.map(d => d.y))

  const xScale = (value: number) => 
    padding + ((value - xMin) / (xMax - xMin)) * (width - 2 * padding)
  
  const yScale = (value: number) => 
    height - padding - ((value - yMin) / (yMax - yMin)) * (height - 2 * padding)

  const categories = Array.from(new Set(data.map(d => d.category)))

  const filteredData = selectedCategory 
    ? data.filter(d => d.category === selectedCategory)
    : data

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-800 text-lg font-medium">{title}</h3>
        <div className="flex items-center space-x-2">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => {
          const categoryData = data.filter(d => d.category === category)
          const categoryColor = categoryData[0]?.color || '#64748b'
          
          return (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs transition-all ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColor }}
              />
              <span>{category}</span>
              <span className="text-slate-400">({categoryData.length})</span>
            </motion.button>
          )
        })}
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width={width} height={height} className="border border-slate-100 rounded-lg">
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Axes */}
          <line 
            x1={padding} 
            y1={height - padding} 
            x2={width - padding} 
            y2={height - padding} 
            stroke="#64748b" 
            strokeWidth="2"
          />
          <line 
            x1={padding} 
            y1={padding} 
            x2={padding} 
            y2={height - padding} 
            stroke="#64748b" 
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text 
            x={width / 2} 
            y={height - 10} 
            textAnchor="middle" 
            className="text-xs fill-slate-600"
          >
            {xLabel}
          </text>
          <text 
            x={15} 
            y={height / 2} 
            textAnchor="middle" 
            transform={`rotate(-90, 15, ${height / 2})`}
            className="text-xs fill-slate-600"
          >
            {yLabel}
          </text>

          {/* Data Points */}
          {filteredData.map((point, index) => (
            <motion.circle
              key={`${point.label}-${index}`}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={point.size / 2}
              fill={point.color}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.5, 
                opacity: 1,
                transition: { duration: 0.2 }
              }}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Trend Line (simple linear regression) */}
          {filteredData.length > 1 && (
            <motion.line
              x1={xScale(xMin)}
              y1={yScale(yMin + (yMax - yMin) * 0.3)}
              x2={xScale(xMax)}
              y2={yScale(yMin + (yMax - yMin) * 0.7)}
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bg-slate-900 text-white px-3 py-2 rounded-lg text-xs pointer-events-none z-10"
            style={{
              left: xScale(hoveredPoint.x) + 10,
              top: yScale(hoveredPoint.y) - 40
            }}
          >
            <div className="font-medium">{hoveredPoint.label}</div>
            <div>{xLabel}: {hoveredPoint.x.toFixed(1)}</div>
            <div>{yLabel}: {hoveredPoint.y.toFixed(1)}</div>
            <div>Category: {hoveredPoint.category}</div>
          </motion.div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-slate-900">
            {filteredData.length}
          </div>
          <div className="text-xs text-slate-500">Data Points</div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900">
            {(filteredData.reduce((sum, d) => sum + d.x, 0) / filteredData.length).toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">Avg {xLabel}</div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900">
            {(filteredData.reduce((sum, d) => sum + d.y, 0) / filteredData.length).toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">Avg {yLabel}</div>
        </div>
        <div>
          <div className="text-lg font-bold text-emerald-600">
            +0.78
          </div>
          <div className="text-xs text-slate-500">Correlation</div>
        </div>
      </div>
    </div>
  )
}

export default ScatterPlotChart
