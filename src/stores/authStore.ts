import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginCredentials, Permission, UserRole } from '@types/auth'
import { getPermissionsForRole, getRoleDisplayName } from '@utils/rolePermissions'

interface AuthState {
  // Состояние
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Действия
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Проверка разрешений
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  getRoleDisplayName: () => string
}

// Мок пользователи для демонстрации разных ролей
const MOCK_USERS: Record<string, { password: string; role: UserRole; email: string }> = {
  // Сотрудники
  admin: { 
    password: 'admin', 
    role: 'employee_admin', 
    email: 'admin@ibiza-dsp.com' 
  },
  manager: { 
    password: 'manager', 
    role: 'employee_traffic', 
    email: 'manager@ibiza-dsp.com' 
  },
  
  // Рекламодатели
  advertiser: { 
    password: 'advertiser', 
    role: 'advertiser_admin', 
    email: 'admin@advertiser.com' 
  },
  traffic: { 
    password: 'traffic', 
    role: 'advertiser_traffic', 
    email: 'traffic@advertiser.com' 
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Действия
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })

          // Имитация задержки API
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Проверяем пользователя в мок базе
          const mockUserData = MOCK_USERS[credentials.username]
          
          if (mockUserData && mockUserData.password === credentials.password) {
            // Создаем пользователя с разрешениями на основе роли
            const user: User = {
              id: credentials.username,
              username: credentials.username,
              email: mockUserData.email,
              role: mockUserData.role,
              permissions: getPermissionsForRole(mockUserData.role),
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            }

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            
            // Сохраняем токен в localStorage
            localStorage.setItem('accessToken', 'mock_token_' + Date.now())
          } else {
            throw new Error('Неверные учетные данные')
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Произошла ошибка при входе',
          })
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      // Проверка разрешений
      hasPermission: (permission: Permission) => {
        const { user } = get()
        return user?.permissions.includes(permission) ?? false
      },

      hasAnyPermission: (permissions: Permission[]) => {
        const { user } = get()
        if (!user) return false
        return permissions.some(permission => user.permissions.includes(permission))
      },

      hasAllPermissions: (permissions: Permission[]) => {
        const { user } = get()
        if (!user) return false
        return permissions.every(permission => user.permissions.includes(permission))
      },

      getRoleDisplayName: () => {
        const { user } = get()
        return user ? getRoleDisplayName(user.role) : ''
      },
    }),
    {
      name: 'auth-storage',
      // Не сохраняем isLoading и error в localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
