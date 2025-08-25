// Типы для групп объявлений

export interface AdGroup {
  id: string
  name: string // Название группы объявлений
  campaignId: string
  advertiserId: string
  budget: number
  platform?: Platform
  status: AdGroupStatus
  schedule: Schedule // Время показа
  frequencyCap?: FrequencyCap
  showLimit?: ShowLimit
  clickLimit?: ClickLimit
  targetSegments: string[] // Готовые сегменты
  targetRegions: string[] // Регионы
  excludeSegments?: string[] // Исключить готовые сегменты
  excludeRegions?: string[] // Исключить регионы
  description?: string
  statistics: AdGroupStatistics
  createdAt: string
  updatedAt: string
}

export type Platform = 'rustore'

export type AdGroupStatus = 
  | 'draft'
  | 'moderation'
  | 'active'
  | 'paused'
  | 'rejected'
  | 'completed'

// Расписание показов (24/7 по умолчанию)
export interface Schedule {
  // Массив из 7 дней, каждый день содержит 24 часа (true - показывать, false - не показывать)
  days: boolean[][] // [день недели][час]
}

export interface FrequencyCap {
  shows: number
  period: 'day' | 'week' | 'month' | 'campaign'
}

export interface ShowLimit {
  shows: number
  period: 'day' | 'week' | 'month' | 'campaign'
}

export interface ClickLimit {
  clicks: number
  period: 'day' | 'week' | 'month' | 'campaign'
}

export interface AdGroupStatistics {
  cpm: number
  impressions: number
  clicks: number
  ctr: number
  spent: number
}

// Сегмент аудитории
export interface Segment {
  id: string
  name: string
  size: number // Размер аудитории
  createdAt: string
}

// Регионы (будет дополнено)
export type Region = string

export interface CreateAdGroupData {
  name: string
  campaignId: string
  budget: number
  platform?: Platform
  status?: AdGroupStatus
  schedule?: Schedule
  frequencyCap?: FrequencyCap
  showLimit?: ShowLimit
  clickLimit?: ClickLimit
  targetSegments?: string[]
  targetRegions?: string[]
  excludeSegments?: string[]
  excludeRegions?: string[]
  description?: string
}

export interface UpdateAdGroupData extends Partial<CreateAdGroupData> {}

export interface AdGroupFilter {
  campaignId?: string
  advertiserId?: string
  search?: string
  status?: AdGroupStatus[]
  platform?: Platform
  sortBy?: 'name' | 'budget' | 'cpm' | 'impressions' | 'clicks' | 'ctr' | 'spent' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface AdGroupListResponse {
  adGroups: AdGroup[]
  total: number
  page: number
  totalPages: number
}

// Для загрузки сегментов
export interface UploadSegmentData {
  name: string
  file: File
}
