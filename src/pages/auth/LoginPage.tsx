import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { notify } from '@stores/notificationStore'
// import type { LoginCredentials } from '../../../types'
// Временно определим тип здесь
interface LoginCredentials {
  username: string
  password: string
}

// Схема валидации для формы входа
const loginSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  password: z.string().min(1, 'Введите пароль'),
})

const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      clearError()
      await login(data)
      notify.success('Успешный вход', 'Добро пожаловать в систему!')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  // Очищаем ошибку при вводе
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-normal text-black">
          Login
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-100/80 border border-red-300 rounded-lg p-3 text-sm text-red-800 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="email"
              className="w-full px-4 py-3 bg-white/30 border-0 rounded-lg placeholder:text-gray-700 text-black focus:outline-none focus:bg-white/40 transition-all font-normal backdrop-blur-sm"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-xs text-red-600 mt-1 font-normal">{errors.username.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="password"
              className="w-full px-4 py-3 bg-white/30 border-0 rounded-lg placeholder:text-gray-700 text-black focus:outline-none focus:bg-white/40 transition-all font-normal backdrop-blur-sm"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1 font-normal">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-normal hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? '→' : '→'}
          </button>
        </div>

        <div className="text-center pt-4">
          <Link 
            to="/register" 
            className="text-sm text-gray-700 hover:text-black underline transition-colors font-normal"
          >
            don't have an account yet?
          </Link>
        </div>
      </form>

      {/* Demo info (временно для разработки) */}
      <div className="text-xs text-gray-600 text-center space-y-1 pt-4 font-normal">
        <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-left">
          <p className="font-medium text-gray-800 mb-2">Демо аккаунт:</p>
          <div className="text-gray-700">
            <div><strong>admin / admin</strong> — Администратор</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
