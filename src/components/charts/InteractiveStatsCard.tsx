import React, { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface InteractiveStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  Icon?: React.ComponentType<any>
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'cyan' | 'orange' | 'grey' | 'dark'
  className?: string
}

const InteractiveStatsCard: React.FC<InteractiveStatsCardProps> = ({
  title,
  value,
  subtitle,
  Icon,
  trend,
  trendValue,
  color = 'cyan',
  className
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    cyan: {
      bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
      border: 'border-cyan-200',
      icon: 'text-cyan-600',
      iconBg: 'bg-cyan-100',
      accent: 'text-cyan-600'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-red-100', 
      border: 'border-orange-200',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-100',
      accent: 'text-orange-600'
    },
    grey: {
      bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
      border: 'border-slate-200', 
      icon: 'text-slate-600',
      iconBg: 'bg-slate-100',
      accent: 'text-slate-600'
    },
    dark: {
      bg: 'bg-gradient-to-br from-slate-100 to-slate-200',
      border: 'border-slate-300',
      icon: 'text-slate-700',
      iconBg: 'bg-slate-200', 
      accent: 'text-slate-700'
    }
  }

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-red-500',
    neutral: 'text-slate-500'
  }

  const colorClass = colorClasses[color]

  return (
    <motion.div
      className={clsx(
        'relative overflow-hidden rounded-2xl border-2 p-6 cursor-pointer',
        colorClass.bg,
        colorClass.border,
        'hover:shadow-xl transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effect */}
      <motion.div
        className={clsx(
          'absolute inset-0 opacity-0',
          color === 'cyan' && 'bg-gradient-to-br from-cyan-400/10 to-cyan-600/10',
          color === 'orange' && 'bg-gradient-to-br from-orange-400/10 to-red-600/10',
          color === 'grey' && 'bg-gradient-to-br from-slate-400/10 to-slate-600/10',
          color === 'dark' && 'bg-gradient-to-br from-slate-500/10 to-slate-700/10'
        )}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <motion.h3 
            className="text-sm font-semibold text-slate-600 mb-3 tracking-wide uppercase font-['Montserrat']"
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>
          
          <div className="flex items-baseline space-x-3 mb-2">
            <motion.p 
              className="text-3xl font-bold text-slate-800 tracking-tight font-['Montserrat']"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.p>
            
            {trendValue && (
              <motion.span 
                className={clsx("text-sm font-semibold font-['Montserrat'] flex items-center", trendColors[trend || 'neutral'])}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {trend === 'up' && '↗'} 
                {trend === 'down' && '↘'}
                {trendValue}
              </motion.span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium font-['Montserrat']">
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <motion.div 
            className={clsx(
              'flex-shrink-0 rounded-xl p-3',
              colorClass.iconBg
            )}
            animate={{ 
              rotate: isHovered ? 5 : 0,
              scale: isHovered ? 1.1 : 1 
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={clsx('h-6 w-6', colorClass.icon)} />
          </motion.div>
        )}
      </div>

      {/* Animated border effect */}
      <motion.div
        className={clsx(
          'absolute inset-0 rounded-2xl border-2 opacity-0',
          color === 'cyan' && 'border-cyan-400',
          color === 'orange' && 'border-orange-400', 
          color === 'grey' && 'border-slate-400',
          color === 'dark' && 'border-slate-500'
        )}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default InteractiveStatsCard

