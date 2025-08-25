import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatItem {
  id: string
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  color?: 'green' | 'red' | 'black' | 'blue'
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  className?: string
}

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  className
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const getTrendColor = (change?: number) => {
    if (!change) return 'text-gray-500'
    if (change > 0) return 'text-emerald-500'
    return 'text-red-500'
  }

  const getTrendBg = (change?: number) => {
    if (!change) return 'bg-gray-50'
    if (change > 0) return 'bg-emerald-50'
    return 'bg-red-50'
  }

  const getIconColor = (color?: string) => {
    switch (color) {
      case 'green': return 'text-emerald-600 bg-gray-50'
      case 'red': return 'text-red-600 bg-gray-50'
      case 'blue': return 'text-blue-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-6 ${gridCols[columns]} ${className}`}
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        
        return (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getIconColor(stat.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 font-['Montserrat']">
                    {stat.title}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-gray-900 font-['Montserrat']">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  
                  {stat.change !== undefined && (
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${getTrendBg(stat.change)} ${getTrendColor(stat.change)}`}>
                      <span>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </span>
                      {stat.changeLabel && (
                        <span className="text-gray-500 text-xs">
                          {stat.changeLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default StatsGrid
