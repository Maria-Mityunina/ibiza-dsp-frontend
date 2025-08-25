// Типы для рекламных кампаний

export interface Campaign {
  id: string
  name: string // Название РК
  advertiserId: string
  budget: number
  startDate: string // Интервал проведения РК - с
  endDate: string // Интервал проведения РК - до
  platform?: Platform // Площадка размещения
  status: CampaignStatus
  frequencyCap?: FrequencyCap // Частотный лимит показов пользователю
  showLimit?: ShowLimit // Лимит показов объявлений
  clickLimit?: ClickLimit // Лимит переходов
  description?: string
  statistics: CampaignStatistics
  createdAt: string
  updatedAt: string
}

export type Platform = 'rustore' // Пока единственная доступная площадка

export type CampaignStatus = 
  | 'draft' // Черновик
  | 'moderation' // На модерации
  | 'active' // Активна
  | 'paused' // Пауза
  | 'rejected' // Отклонена
  | 'completed' // Завершена

export interface FrequencyCap {
  shows: number // Количество показов
  period: 'day' | 'week' | 'month' | 'campaign' // Период
}

export interface ShowLimit {
  shows: number // Количество показов
  period: 'day' | 'week' | 'month' | 'campaign' // Период
}

export interface ClickLimit {
  clicks: number // Количество кликов (используется поле "Показ" из ТЗ)
  period: 'day' | 'week' | 'month' | 'campaign' // Период
}

export interface CampaignStatistics {
  cpm: number // CPM
  impressions: number // Показы
  clicks: number // Переходы
  ctr: number // CTR
  spent: number // Потрачено
}

export interface CreateCampaignData {
  name: string
  budget: number
  startDate: string
  endDate: string
  platform?: Platform
  status?: CampaignStatus
  frequencyCap?: FrequencyCap
  showLimit?: ShowLimit
  clickLimit?: ClickLimit
  description?: string
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {}

export interface CampaignFilter {
  advertiserId?: string
  search?: string
  status?: CampaignStatus[]
  platform?: Platform
  dateFrom?: string
  dateTo?: string
  sortBy?: 'name' | 'budget' | 'cpm' | 'impressions' | 'clicks' | 'ctr' | 'spent' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CampaignListResponse {
  campaigns: Campaign[]
  total: number
  page: number
  totalPages: number
}
