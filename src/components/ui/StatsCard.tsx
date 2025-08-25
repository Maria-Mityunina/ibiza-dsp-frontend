import React from 'react'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  }

  return (
    <div className={clsx(
      'group relative bg-white/70 backdrop-blur-xl border border-black/5 rounded-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5 overflow-hidden',
      sizeClasses[size],
      className
    )}>
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start justify-between h-full">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3 tracking-wide uppercase font-['Montserrat'] truncate">
            {title}
          </h3>
          <div className="flex items-baseline space-x-3 mb-2">
            <p className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-['Montserrat'] truncate">
              {value}
            </p>
            {trendValue && (
              <span className={clsx("text-sm font-semibold font-['Montserrat'] flex-shrink-0", trendColors[trend])}>
                {trendValue}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 font-medium font-['Montserrat'] line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-gray-200/50 to-gray-300/50 backdrop-blur-sm rounded-xl border border-black/10 flex items-center justify-center group-hover:from-gray-300/50 group-hover:to-gray-400/50 transition-all duration-300 group-hover:scale-105">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 group-hover:text-black transition-colors duration-300" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard
