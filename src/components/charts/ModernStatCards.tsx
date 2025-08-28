import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface StatCardData {
  title: string
  value: string
  change: number
  changeLabel: string
  progress: number
  color: 'green' | 'red' | 'blue' | 'gray'
}

interface ModernStatCardsProps {
  data: StatCardData[]
  className?: string
}

const ModernStatCards: React.FC<ModernStatCardsProps> = ({ data, className }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          progress: 'bg-emerald-400',
          text: 'text-emerald-600'
        }
      case 'red':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200', 
          progress: 'bg-rose-400',
          text: 'text-rose-600'
        }
      case 'blue':
        return {
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          progress: 'bg-sky-400', 
          text: 'text-sky-600'
        }
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          progress: 'bg-slate-400',
          text: 'text-slate-600'
        }
    }
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
      {data.map((item, index) => {
        const colors = getColorClasses(item.color)
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-white rounded-3xl p-6 shadow-lg border ${colors.border} hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
          >
            {/* Background pattern */}
            <div className={`absolute inset-0 ${colors.bg} opacity-30`} />
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/50 rounded-full -translate-y-10 translate-x-10" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 font-['Montserrat']">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-1">
                  {item.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${item.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              </div>

              {/* Main Value */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900 font-['Montserrat'] mb-1">
                  {item.value}
                </p>
                <p className="text-xs text-gray-500 font-['Montserrat']">
                  {item.changeLabel}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-['Montserrat']">Прогресс</span>
                  <span className="text-xs font-medium text-gray-700">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 ${colors.progress} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors font-['Montserrat']"
              >
                <span>Подробнее</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ModernStatCards
