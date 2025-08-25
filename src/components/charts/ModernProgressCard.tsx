import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ModernProgressCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ComponentType<any>
  className?: string
}

const ModernProgressCard: React.FC<ModernProgressCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs прошлый период',
  icon: Icon,
  className
}) => {
  const getTrendIcon = () => {
    if (!change) return <Minus className="h-4 w-4" />
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (!change) return 'text-gray-500'
    if (change > 0) return 'text-emerald-500'
    return 'text-red-500'
  }

  const getTrendBg = () => {
    if (!change) return 'bg-gray-50'
    if (change > 0) return 'bg-emerald-50'
    return 'bg-red-50'
  }

  return (
    <motion.div
      whileHover={{ y: -2, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-3 font-['Montserrat']">
            {title}
          </h3>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-3xl font-bold text-gray-900 font-['Montserrat']">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {change !== undefined && (
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${getTrendBg()} ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-gray-500 text-xs">
                  {changeLabel}
                </span>
              </div>
            )}
          </motion.div>
        </div>
        
        {Icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
              <Icon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ModernProgressCard
