import { create } from 'zustand'

// Notification types
type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  autoClose?: boolean
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

let notificationId = 0

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notification-${++notificationId}`
    const newNotification: Notification = {
      id,
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000,
      ...notification,
    }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Автоматическое удаление уведомления
    if (newNotification.autoClose && newNotification.duration) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))

// Хелперы для удобного добавления уведомлений
export const notify = {
  success: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({
      type: 'success',
      title,
      message,
    })
  },
  error: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration: 7000, // Ошибки показываем дольше
    })
  },
  warning: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({
      type: 'warning',
      title,
      message,
    })
  },
  info: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      title,
      message,
    })
  },
}
