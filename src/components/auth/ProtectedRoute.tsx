import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import type { Permission } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
  fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  fallback,
}) => {
  const { isAuthenticated, hasAllPermissions } = useAuthStore()

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Если указаны требуемые разрешения, проверяем их наличие
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    // Если есть fallback компонент, показываем его
    if (fallback) {
      return <>{fallback}</>
    }

    // Иначе показываем сообщение об отсутствии доступа
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Доступ запрещен
            </h2>
            <p className="text-secondary-600 mb-4">
              У вас нет необходимых разрешений для просмотра этой страницы.
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
