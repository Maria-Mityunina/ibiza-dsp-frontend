import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// API Types
interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

interface ApiError {
  message: string
  code?: string
  details?: any
}

// Базовый URL API (в продакшене будет заменен на реальный)
const API_BASE_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:8000/api'

// Создание экземпляра axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерсептор запросов - добавляем токен авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерсептор ответов - обработка ошибок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    
    // Нормализация ошибок
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Произошла неизвестная ошибка',
      code: error.response?.data?.code || error.code,
      details: error.response?.data?.details,
    }
    
    return Promise.reject(apiError)
  }
)

// Универсальный API клиент
export class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = apiClient
  }

  // GET запрос
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return response.data.data as T
  }

  // POST запрос
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return response.data.data as T
  }

  // PUT запрос
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return response.data.data as T
  }

  // PATCH запрос
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return response.data.data as T
  }

  // DELETE запрос
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return response.data.data as T
  }

  // Загрузка файлов
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data.data as T
  }

  // Скачивание файлов
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    })

    // Создаем URL для blob
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)

    // Создаем временную ссылку для скачивания
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()

    // Очистка
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Установка токена авторизации
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('accessToken', token)
  }

  // Удаление токена авторизации
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization']
    localStorage.removeItem('accessToken')
  }
}

// Экземпляр API клиента для использования в приложении
export const api = new ApiClient()

export default api
