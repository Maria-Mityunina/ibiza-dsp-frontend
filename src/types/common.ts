// Общие типы для приложения

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Типы для уведомлений
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  autoClose?: boolean
  duration?: number
}

// Пагинация
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Ответ API с пагинацией
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Общий ответ API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// Фильтры для списков
export interface BaseFilter {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Статусы сущностей - единый список для всего сайта
export type Status = 'draft' | 'pending' | 'active' | 'paused' | 'rejected' | 'completed'
export type EntityStatus = Status

// Базовая сущность
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  status: EntityStatus
}

// Метаданные файла
export interface FileMetadata {
  id: string
  name: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: Date
}

// Координаты для геолокации
export interface Coordinates {
  latitude: number
  longitude: number
}

// Временной диапазон
export interface DateRange {
  startDate: Date
  endDate: Date
}

// Статистика с изменениями
export interface StatWithChange {
  current: number
  previous: number
  change: number
  changePercent: number
}