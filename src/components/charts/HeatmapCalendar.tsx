import React from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'

interface HeatmapData {
  date: Date
  value: number
  intensity: number // 0-4 scale for color intensity
}

interface HeatmapCalendarProps {
  data?: HeatmapData[]
  title?: string
  className?: string
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ 
  data = [], 
  title = "Weekly Clicks", 
  className = '' 
}) => {
  // Generate 5x5 grid for simplified calendar view
  const generateSimpleGrid = () => {
    const grid = []
    
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 5; day++) {
        // Random intensity for demo
        const intensity = Math.floor(Math.random() * 5)
        grid.push({
          week,
          day,
          intensity
        })
      }
    }
    return grid
  }

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-blue-100', // 0
      'bg-blue-200', // 1
      'bg-blue-400', // 2
      'bg-blue-600', // 3
      'bg-blue-800'  // 4
    ]
    return colors[intensity] || colors[0]
  }

  const gridData = generateSimpleGrid()

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-600 text-sm font-medium">{title}</h3>
        <button className="text-slate-400 hover:text-slate-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="text-2xl font-bold text-slate-900 mb-1">$60,598.00</div>
      </div>

      {/* Simplified 5x5 Calendar Grid */}
      <div className="grid grid-cols-5 gap-1">
        {gridData.map((cell, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded flex items-center justify-center text-xs font-medium
              transition-all duration-200 hover:scale-110 cursor-pointer
              ${getIntensityColor(cell.intensity)}
              ${cell.intensity > 2 ? 'text-white' : 'text-slate-600'}
            `}
            title={`Week ${cell.week + 1}, Day ${cell.day + 1}: ${Math.floor(Math.random() * 200 + 50)} clicks`}
          >
            {cell.day + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeatmapCalendar