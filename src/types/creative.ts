// Типы для креативов

export interface Creative {
  id: string
  name: string // Название креатива (только для маленьких форматов)
  adGroupId: string
  campaignId: string
  advertiserId: string
  format: CreativeFormat
  budget: number
  cpm: number // CPM
  url: string // Ссылка с макросами
  autoStart: boolean // Запуск после сохранения
  
  // Поля для маленьких форматов
  title?: string // Заголовок креатива (16 символов)
  text?: string // Текст креатива (32 символа)
  
  // Поля для больших форматов  
  image?: CreativeImage // Изображение
  
  status: CreativeStatus
  statistics: CreativeStatistics
  createdAt: string
  updatedAt: string
}

// Форматы креативов из ТЗ
export type CreativeFormat = 
  | '6_small'   // 6 маленький
  | '16_small'  // 16 маленький  
  | '4_big'     // 4 большой
  | '13_small'  // 13 маленький
  | '10_big'    // 10 большой
  | '3_small'   // 3 маленький
  | '15_small'  // 15 маленький
  | '97_small'  // 97 маленький

export type CreativeStatus = 'active' | 'paused'

export interface CreativeImage {
  url: string
  filename: string
  size: number // размер в байтах
  width: number // ширина в пикселях
  height: number // высота в пикселях
  format: 'jpg' | 'png' | 'gif' // допустимые форматы
}

// Допустимые размеры изображений для больших форматов
export const ALLOWED_IMAGE_SIZES = [
  { width: 1200, height: 675 },
  { width: 1080, height: 608 },
  { width: 5000, height: 2812 }
] as const

export interface CreativeStatistics {
  cpm: number
  impressions: number
  clicks: number
  ctr: number
  spent: number
}

// Макросы для URL
export interface UrlMacros {
  campaign: string      // {campaign}
  campaign_id: string   // {campaign_id}
  group: string         // {group}
  group_id: string      // {group_id}
  creo: string          // {creo}
  creo_id: string       // {creo_id}
  gaid: string          // {gaid}
  click_id: string      // {click_id}
}

export interface CreateCreativeData {
  name?: string // только для маленьких форматов
  adGroupId: string
  format: CreativeFormat
  budget: number
  cpm: number
  url: string
  autoStart: boolean
  title?: string
  text?: string
  image?: File
}

export interface UpdateCreativeData extends Partial<Omit<CreateCreativeData, 'adGroupId' | 'image'>> {
  image?: File
}

export interface CreativeFilter {
  adGroupId?: string
  campaignId?: string
  advertiserId?: string
  search?: string
  format?: CreativeFormat[]
  status?: CreativeStatus[]
  sortBy?: 'name' | 'budget' | 'cpm' | 'impressions' | 'clicks' | 'ctr' | 'spent' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CreativeListResponse {
  creatives: Creative[]
  total: number
  page: number
  totalPages: number
}

// Помощники для определения типа формата
export const isSmallFormat = (format: CreativeFormat): boolean => {
  return format.includes('small')
}

export const isBigFormat = (format: CreativeFormat): boolean => {
  return format.includes('big')
}

// Лимиты полей
export const CREATIVE_LIMITS = {
  name: 16,        // Название креатива
  title: 16,       // Заголовок
  text: 32,        // Текст
  url: 500,        // URL
  cpm: 4,          // CPM (количество символов)
  budget: 7        // Бюджет (количество символов)
} as const
