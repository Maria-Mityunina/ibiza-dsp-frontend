import { api } from './api'

// Типы данных DSP
export interface Advertiser {
  id: string
  name: string
  legalName: string
  inn: string
  kpp: string
  ogrn: string
  legalAddress: string
  bik: string
  account: string
  contractNumber: string
  contractDate: string
  useAutoMarking: boolean
  status: 'active' | 'inactive' | 'blocked'
  budget: number
  spent: number
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  advertiserId: string
  name: string
  budget: number
  spent: number
  startDate: string
  endDate: string
  platform: string
  status: 'draft' | 'pending' | 'active' | 'paused' | 'stopped' | 'completed' | 'rejected'
  userFrequencyLimit?: number
  userFrequencyPeriod?: string
  adFrequencyLimit?: number
  adFrequencyPeriod?: string
  clickLimit?: number
  clickPeriod?: string
  description?: string
  impressions: number
  clicks: number
  ctr: number
  cpm: number
  createdAt: string
  updatedAt: string
}

export interface AdGroup {
  id: string
  campaignId: string
  advertiserId: string
  name: string
  budget: number
  spent: number
  platform: string
  status: 'draft' | 'pending' | 'active' | 'paused' | 'stopped' | 'completed' | 'rejected'
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  userFrequencyLimit?: number
  userFrequencyPeriod?: string
  adFrequencyLimit?: number
  adFrequencyPeriod?: string
  clickLimit?: number
  clickPeriod?: string
  segments: string[]
  phoneModel?: string
  region?: string
  language?: string
  osVersion?: string
  excludeAudience: boolean
  excludeSegments: string[]
  excludeRegions: string[]
  description?: string
  impressions: number
  clicks: number
  ctr: number
  cpm: number
  targeting: string
  createdAt: string
  updatedAt: string
}

export interface Creative {
  id: string
  adGroupId: string
  campaignId: string
  advertiserId: string
  name: string
  type: 'text' | 'image'
  placement: string
  status: 'draft' | 'pending' | 'active' | 'paused' | 'stopped' | 'completed' | 'rejected'
  title?: string
  text?: string
  imageUrl?: string
  link: string
  cpm: number
  impressions: number
  clicks: number
  ctr: number
  spent: number
  launchAfterSave: boolean
  createdAt: string
  updatedAt: string
}

export interface Segment {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  size: number
  type: 'upload' | 'criteria'
  fileUrl?: string
  criteria?: any
  createdAt: string
  updatedAt: string
}

// API функции для рекламодателей
export const advertisersApi = {
  // Получить список рекламодателей
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ data: Advertiser[]; total: number; page: number; limit: number }> => {
    return api.get('/advertisers', { params })
  },

  // Получить рекламодателя по ID
  getById: async (id: string): Promise<Advertiser> => {
    return api.get(`/advertisers/${id}`)
  },

  // Создать рекламодателя
  create: async (data: Omit<Advertiser, 'id' | 'createdAt' | 'updatedAt'>): Promise<Advertiser> => {
    return api.post('/advertisers', data)
  },

  // Обновить рекламодателя
  update: async (id: string, data: Partial<Advertiser>): Promise<Advertiser> => {
    return api.put(`/advertisers/${id}`, data)
  },

  // Удалить рекламодателя
  delete: async (id: string): Promise<void> => {
    return api.delete(`/advertisers/${id}`)
  },

  // Обновить бюджет рекламодателя
  updateBudget: async (id: string, budget: number): Promise<Advertiser> => {
    return api.patch(`/advertisers/${id}/budget`, { budget })
  }
}

// API функции для кампаний
export const campaignsApi = {
  // Получить кампании рекламодателя
  getByAdvertiser: async (advertiserId: string, params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ data: Campaign[]; total: number; page: number; limit: number }> => {
    return api.get(`/advertisers/${advertiserId}/campaigns`, { params })
  },

  // Получить все кампании
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ data: Campaign[]; total: number; page: number; limit: number }> => {
    return api.get('/campaigns', { params })
  },

  // Получить кампанию по ID
  getById: async (id: string): Promise<Campaign> => {
    return api.get(`/campaigns/${id}`)
  },

  // Создать кампанию
  create: async (advertiserId: string, data: Omit<Campaign, 'id' | 'advertiserId' | 'createdAt' | 'updatedAt'>): Promise<Campaign> => {
    return api.post(`/advertisers/${advertiserId}/campaigns`, data)
  },

  // Обновить кампанию
  update: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    return api.put(`/campaigns/${id}`, data)
  },

  // Удалить кампанию
  delete: async (id: string): Promise<void> => {
    return api.delete(`/campaigns/${id}`)
  },

  // Изменить статус кампании
  updateStatus: async (id: string, status: Campaign['status']): Promise<Campaign> => {
    return api.patch(`/campaigns/${id}/status`, { status })
  },

  // Обновить бюджет кампании
  updateBudget: async (id: string, budget: number): Promise<Campaign> => {
    return api.patch(`/campaigns/${id}/budget`, { budget })
  },

  // Копировать кампанию
  copy: async (id: string, name?: string): Promise<Campaign> => {
    return api.post(`/campaigns/${id}/copy`, { name })
  }
}

// API функции для групп объявлений
export const adGroupsApi = {
  // Получить группы объявлений кампании
  getByCampaign: async (campaignId: string, params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ data: AdGroup[]; total: number; page: number; limit: number }> => {
    return api.get(`/campaigns/${campaignId}/adgroups`, { params })
  },

  // Получить все группы объявлений
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ data: AdGroup[]; total: number; page: number; limit: number }> => {
    return api.get('/adgroups', { params })
  },

  // Получить группу объявлений по ID
  getById: async (id: string): Promise<AdGroup> => {
    return api.get(`/adgroups/${id}`)
  },

  // Создать группу объявлений
  create: async (campaignId: string, data: Omit<AdGroup, 'id' | 'campaignId' | 'advertiserId' | 'createdAt' | 'updatedAt'>): Promise<AdGroup> => {
    return api.post(`/campaigns/${campaignId}/adgroups`, data)
  },

  // Обновить группу объявлений
  update: async (id: string, data: Partial<AdGroup>): Promise<AdGroup> => {
    return api.put(`/adgroups/${id}`, data)
  },

  // Удалить группу объявлений
  delete: async (id: string): Promise<void> => {
    return api.delete(`/adgroups/${id}`)
  },

  // Изменить статус группы объявлений
  updateStatus: async (id: string, status: AdGroup['status']): Promise<AdGroup> => {
    return api.patch(`/adgroups/${id}/status`, { status })
  },

  // Обновить бюджет группы объявлений
  updateBudget: async (id: string, budget: number): Promise<AdGroup> => {
    return api.patch(`/adgroups/${id}/budget`, { budget })
  },

  // Копировать группу объявлений
  copy: async (id: string, name?: string): Promise<AdGroup> => {
    return api.post(`/adgroups/${id}/copy`, { name })
  }
}

// API функции для креативов
export const creativesApi = {
  // Получить креативы группы объявлений
  getByAdGroup: async (adGroupId: string, params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ data: Creative[]; total: number; page: number; limit: number }> => {
    return api.get(`/adgroups/${adGroupId}/creatives`, { params })
  },

  // Получить все креативы
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    type?: string
  }): Promise<{ data: Creative[]; total: number; page: number; limit: number }> => {
    return api.get('/creatives', { params })
  },

  // Получить креатив по ID
  getById: async (id: string): Promise<Creative> => {
    return api.get(`/creatives/${id}`)
  },

  // Создать креатив
  create: async (adGroupId: string, data: Omit<Creative, 'id' | 'adGroupId' | 'campaignId' | 'advertiserId' | 'createdAt' | 'updatedAt'>): Promise<Creative> => {
    return api.post(`/adgroups/${adGroupId}/creatives`, data)
  },

  // Обновить креатив
  update: async (id: string, data: Partial<Creative>): Promise<Creative> => {
    return api.put(`/creatives/${id}`, data)
  },

  // Удалить креатив
  delete: async (id: string): Promise<void> => {
    return api.delete(`/creatives/${id}`)
  },

  // Изменить статус креатива
  updateStatus: async (id: string, status: Creative['status']): Promise<Creative> => {
    return api.patch(`/creatives/${id}/status`, { status })
  },

  // Загрузить изображение для креатива
  uploadImage: async (file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> => {
    return api.upload('/creatives/upload-image', file, onProgress)
  },

  // Копировать креатив
  copy: async (id: string, name?: string): Promise<Creative> => {
    return api.post(`/creatives/${id}/copy`, { name })
  }
}

// API функции для сегментов
export const segmentsApi = {
  // Получить список сегментов
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    type?: string
  }): Promise<{ data: Segment[]; total: number; page: number; limit: number }> => {
    return api.get('/segments', { params })
  },

  // Получить сегмент по ID
  getById: async (id: string): Promise<Segment> => {
    return api.get(`/segments/${id}`)
  },

  // Создать сегмент
  create: async (data: Omit<Segment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Segment> => {
    return api.post('/segments', data)
  },

  // Обновить сегмент
  update: async (id: string, data: Partial<Segment>): Promise<Segment> => {
    return api.put(`/segments/${id}`, data)
  },

  // Удалить сегмент
  delete: async (id: string): Promise<void> => {
    return api.delete(`/segments/${id}`)
  },

  // Загрузить файл сегмента
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<{ url: string; size: number }> => {
    return api.upload('/segments/upload', file, onProgress)
  }
}

// API функции для аналитики
export const analyticsApi = {
  // Получить общую статистику
  getOverview: async (params: {
    startDate: string
    endDate: string
    advertiserId?: string
    campaignId?: string
    adGroupId?: string
  }): Promise<{
    impressions: number
    clicks: number
    spend: number
    ctr: number
    cpm: number
    conversions: number
  }> => {
    return api.get('/analytics/overview', { params })
  },

  // Получить данные для графиков
  getMetrics: async (params: {
    startDate: string
    endDate: string
    metrics: string[]
    groupBy: 'day' | 'hour'
    advertiserId?: string
    campaignId?: string
    adGroupId?: string
  }): Promise<{
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      color: string
    }>
  }> => {
    return api.get('/analytics/metrics', { params })
  },

  // Экспорт данных
  exportData: async (params: {
    startDate: string
    endDate: string
    format: 'csv' | 'xlsx'
    advertiserId?: string
    campaignId?: string
  }, filename?: string): Promise<void> => {
    return api.download('/analytics/export', filename)
  }
}

// API функции для аутентификации
export const authApi = {
  // Авторизация
  login: async (credentials: { email: string; password: string }): Promise<{
    user: {
      id: string
      name: string
      email: string
      role: string
      permissions: string[]
    }
    accessToken: string
    refreshToken: string
  }> => {
    return api.post('/auth/login', credentials)
  },

  // Регистрация
  register: async (userData: {
    name: string
    email: string
    password: string
    role?: string
  }): Promise<{
    user: {
      id: string
      name: string
      email: string
      role: string
    }
    accessToken: string
    refreshToken: string
  }> => {
    return api.post('/auth/register', userData)
  },

  // Обновление токена
  refreshToken: async (refreshToken: string): Promise<{
    accessToken: string
    refreshToken: string
  }> => {
    return api.post('/auth/refresh', { refreshToken })
  },

  // Выход
  logout: async (): Promise<void> => {
    return api.post('/auth/logout')
  },

  // Получить текущего пользователя
  getCurrentUser: async (): Promise<{
    id: string
    name: string
    email: string
    role: string
    permissions: string[]
  }> => {
    return api.get('/auth/me')
  }
}

// Экспорт всех API функций
export const dspApi = {
  advertisers: advertisersApi,
  campaigns: campaignsApi,
  adGroups: adGroupsApi,
  creatives: creativesApi,
  segments: segmentsApi,
  analytics: analyticsApi,
  auth: authApi
}

export default dspApi
