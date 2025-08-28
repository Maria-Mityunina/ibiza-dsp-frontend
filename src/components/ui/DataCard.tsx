import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface DataCardProps {
  title: string
  subtitle?: string
  onClick?: () => void
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  onClick,
  actions,
  className = '',
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -3,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className={`
        bg-white/15 border border-white/25 rounded-2xl 
        shadow-lg hover:shadow-xl transition-all duration-300 ease-out
        relative overflow-hidden group
        ${onClick ? 'cursor-pointer hover:border-white/40 hover:bg-white/20' : ''}
        ${className}
      `}
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.08) 100%
          )
        `,
        backdropFilter: 'blur(10px) saturate(120%)',
        boxShadow: `
          0 8px 20px rgba(0,0,0,0.08),
          0 1px 0 rgba(255,255,255,0.15) inset
        `,
      }}
      onClick={onClick}
    >
      {/* Subtle highlight effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl"
        />
      </div>
      
      <div className="relative p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 transition-colors duration-200">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-4 relative z-10">
              {actions}
            </div>
          )}
        </div>
        
        {children && (
          <div className="space-y-3 relative">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface DataCardStatProps {
  label: string
  value: string | number
  icon?: LucideIcon
  format?: 'currency' | 'percentage' | 'number'
}

export const DataCardStat: React.FC<DataCardStatProps> = ({
  label,
  value,
  icon: Icon,
  format = 'number'
}) => {
  const formatValue = (val: string | number) => {
    if (format === 'currency') return `${val}$`
    if (format === 'percentage') return `${val}%`
    return val
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">
        {formatValue(value)}
      </span>
    </div>
  )
}

export default DataCard
