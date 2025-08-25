import React from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { useNotificationStore } from '@stores/notificationStore'
import clsx from 'clsx'

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'error':
        return XCircle
      case 'warning':
        return AlertTriangle
      case 'info':
        return Info
      default:
        return Info
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800'
      case 'error':
        return 'bg-error-50 border-error-200 text-error-800'
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800'
      case 'info':
        return 'bg-primary-50 border-primary-200 text-primary-800'
      default:
        return 'bg-secondary-50 border-secondary-200 text-secondary-800'
    }
  }

  const getIconColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success-500'
      case 'error':
        return 'text-error-500'
      case 'warning':
        return 'text-warning-500'
      case 'info':
        return 'text-primary-500'
      default:
        return 'text-secondary-500'
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type)
        
        return (
          <div
            key={notification.id}
            className={clsx(
              'border rounded-md p-4 shadow-lg animate-fade-in',
              getColors(notification.type)
            )}
          >
            <div className="flex items-start">
              <Icon className={clsx('h-5 w-5 mt-0.5 flex-shrink-0', getIconColors(notification.type))} />
              
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">
                  {notification.title}
                </h3>
                {notification.message && (
                  <p className="mt-1 text-sm opacity-90">
                    {notification.message}
                  </p>
                )}
              </div>
              
              <button
                type="button"
                className="ml-4 flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white hover:bg-opacity-20 transition-colors"
                onClick={() => removeNotification(notification.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationContainer
