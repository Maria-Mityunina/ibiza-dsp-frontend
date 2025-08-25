import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'

// Схема валидации для формы регистрации
const registerSchema = z.object({
  email: z.string().email('Введите корректный email'),
  name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  agree: z.boolean().refine(val => val === true, {
    message: 'Необходимо согласие на обработку данных'
  })
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Здесь будет логика регистрации через API
      // Register implementation
      
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // После успешной регистрации перенаправить на логин
      alert('Регистрация успешна! Переходим на страницу входа.')
      window.location.href = '/login'
      
    } catch (error) {
      setError('Ошибка при регистрации. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-normal text-black">
          Registration
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
              type="email"
              placeholder="email"
              className="w-full px-4 py-3 bg-white/30 border-0 rounded-lg placeholder:text-gray-700 text-black focus:outline-none focus:bg-white/40 transition-all font-normal backdrop-blur-sm"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 font-normal">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="name"
              className="w-full px-4 py-3 bg-white/30 border-0 rounded-lg placeholder:text-gray-700 text-black focus:outline-none focus:bg-white/40 transition-all font-normal backdrop-blur-sm"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1 font-normal">{errors.name.message}</p>
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

        {/* Checkbox agreement */}
        <div className="pt-4">
          <label className="flex items-start space-x-3 text-sm text-gray-700 font-normal">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-400 text-black focus:ring-black/20 bg-white/30 backdrop-blur-sm"
              {...register('agree')}
            />
            <span>
              by clicking the button, you accept the{' '}
              <a href="#" className="underline hover:text-black transition-colors">terms</a>{' '}
              and agree to the processing of your data
            </span>
          </label>
          {errors.agree && (
            <p className="text-xs text-red-600 mt-2 font-normal">{errors.agree.message}</p>
          )}
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
            to="/login" 
            className="text-sm text-gray-700 hover:text-black underline transition-colors font-normal"
          >
            do you already have an account?
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage
