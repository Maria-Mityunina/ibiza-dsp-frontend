import React from 'react'
import { Play, Pause, Square, Clock, CheckCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Status } from '@types/common'

interface StatusControlProps {
  status: Status
  onStatusChange: (newStatus: 'active' | 'paused' | 'rejected') => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const StatusControl: React.FC<StatusControlProps> = ({
  status,
  onStatusChange,
  disabled = false,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          label: 'Черновик',
          icon: Clock,
          bgClass: 'bg-white/20 backdrop-blur-sm',
          textClass: 'text-gray-600',
          borderClass: 'border-white/30'
        }
      case 'pending':
        return {
          label: 'На модерации',
          icon: Clock,
          bgClass: 'bg-white/20 backdrop-blur-sm',
          textClass: 'text-gray-600',
          borderClass: 'border-white/30'
        }
      case 'active':
        return {
          label: 'Активна',
          icon: Play,
          bgClass: 'bg-white/30 backdrop-blur-sm',
          textClass: 'text-slate-900',
          borderClass: 'border-white/40'
        }
      case 'paused':
        return {
          label: 'Приостановлена',
          icon: Pause,
          bgClass: 'bg-white/20 backdrop-blur-sm',
          textClass: 'text-gray-700',
          borderClass: 'border-white/30'
        }
      case 'completed':
        return {
          label: 'Завершена',
          icon: CheckCircle,
          bgClass: 'bg-white/25 backdrop-blur-sm',
          textClass: 'text-gray-600',
          borderClass: 'border-white/35'
        }
      case 'rejected':
        return {
          label: 'Отклонена',
          icon: X,
          bgClass: 'bg-white/20 backdrop-blur-sm',
          textClass: 'text-gray-600',
          borderClass: 'border-white/30'
        }
      default:
        return {
          label: 'Неизвестно',
          icon: Clock,
          bgClass: 'bg-white/15 backdrop-blur-sm',
          textClass: 'text-gray-500',
          borderClass: 'border-white/25'
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          badge: 'px-2 py-1 text-xs',
          button: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
          gap: 'gap-1'
        }
      case 'md':
        return {
          badge: 'px-2.5 py-1.5 text-xs',
          button: 'px-2.5 py-1.5 text-xs',
          icon: 'h-3.5 w-3.5',
          gap: 'gap-1.5'
        }
      case 'lg':
        return {
          badge: 'px-3 py-2 text-sm',
          button: 'px-3 py-2 text-sm',
          icon: 'h-4 w-4',
          gap: 'gap-2'
        }
    }
  }

  const statusConfig = getStatusConfig()
  const sizeClasses = getSizeClasses()
  const Icon = statusConfig.icon

  const canStart = ['draft', 'paused', 'stopped'].includes(status)
  const canPause = status === 'active'
  const canStop = ['active', 'paused'].includes(status)

  const handleAction = (action: 'start' | 'pause' | 'stop') => {
    if (disabled) return

    switch (action) {
      case 'start':
        onStatusChange('active')
        break
      case 'pause':
        onStatusChange('paused')
        break
      case 'stop':
        onStatusChange('stopped')
        break
    }
  }

  return (
    <div className={`flex items-center ${sizeClasses.gap} ${className}`}>
      {/* Status Badge - Glass Style */}
      <div 
        className={`
          inline-flex items-center ${sizeClasses.gap} ${sizeClasses.badge}
          ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}
          border rounded-lg font-medium transition-all duration-200 hover:bg-white/35
        `}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <Icon className={sizeClasses.icon} />
        {showLabel && <span className="truncate">{statusConfig.label}</span>}
      </div>

      {/* Control Buttons - Monochrome Style */}
      {!disabled && (status !== 'completed' && status !== 'rejected') && (
        <div className="flex items-center gap-1">
          {canStart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('start')}
              className={`
                flex items-center justify-center ${sizeClasses.button}
                bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 rounded-lg 
                hover:bg-white/30 hover:text-slate-900 transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              title="Запустить"
            >
              <Play className={sizeClasses.icon} />
              {size === 'lg' && <span className="ml-1">Запустить</span>}
            </motion.button>
          )}

          {canPause && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('pause')}
              className={`
                flex items-center justify-center ${sizeClasses.button}
                bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 rounded-lg 
                hover:bg-white/30 hover:text-slate-900 transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              title="Приостановить"
            >
              <Pause className={sizeClasses.icon} />
              {size === 'lg' && <span className="ml-1">Пауза</span>}
            </motion.button>
          )}

          {canStop && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('stop')}
              className={`
                flex items-center justify-center ${sizeClasses.button}
                bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 rounded-lg 
                hover:bg-white/30 hover:text-slate-900 transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              title="Остановить"
            >
              <Square className={sizeClasses.icon} />
              {size === 'lg' && <span className="ml-1">Стоп</span>}
            </motion.button>
          )}
        </div>
      )}
    </div>
  )
}

export default StatusControl
