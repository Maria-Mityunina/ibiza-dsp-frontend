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
          color: 'status-draft',
          icon: Clock,
          statusClass: 'status-draft'
        }
      case 'pending':
        return {
          label: 'На модерации',
          color: 'status-pending',
          icon: Clock,
          statusClass: 'status-pending'
        }
      case 'active':
        return {
          label: 'Активна',
          color: 'status-active',
          icon: Play,
          statusClass: 'status-active'
        }
      case 'paused':
        return {
          label: 'Приостановлена',
          color: 'status-paused',
          icon: Pause,
          statusClass: 'status-paused'
        }

      case 'completed':
        return {
          label: 'Завершена',
          color: 'status-completed',
          icon: CheckCircle,
          statusClass: 'status-completed'
        }
      case 'rejected':
        return {
          label: 'Отклонена',
          color: 'status-rejected',
          icon: X,
          statusClass: 'status-rejected'
        }
      default:
        return {
          label: 'Неизвестно',
          color: 'status-inactive',
          icon: Clock,
          statusClass: 'status-inactive'
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
          gap: 'gap-1'
        }
      case 'md':
        return {
          button: 'px-3 py-2 text-sm',
          icon: 'h-4 w-4',
          gap: 'gap-2'
        }
      case 'lg':
        return {
          button: 'px-4 py-3 text-base',
          icon: 'h-5 w-5',
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
      {/* Status Badge */}
      <div 
        className={`
          inline-flex items-center ${sizeClasses.gap} ${sizeClasses.button} 
          ${statusConfig.statusClass}
          border rounded-lg font-normal
        `}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <Icon className={sizeClasses.icon} />
        {showLabel && <span>{statusConfig.label}</span>}
      </div>

      {/* Control Buttons */}
      {!disabled && (status !== 'completed' && status !== 'rejected') && (
        <div className="flex items-center gap-1">
          {canStart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('start')}
              className={`
                flex items-center justify-center ${sizeClasses.button}
                bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400
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
                bg-sky-500 text-white rounded-lg hover:bg-sky-600 
                transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400
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
                bg-rose-400 text-white rounded-lg hover:bg-rose-500 
                transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300
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
