// Типы для рекламодателей

export interface Advertiser {
  id: string
  name: string // Наименование рекламодателя
  legalName: string // Наименование юр лица
  inn: string // ИНН (12 символов)
  kpp: string // КПП (9 символов)
  ogrn: string // ОГРН/ОГРНИП (15 символов)
  legalAddress: string // Юридический адрес
  bik: string // БИК (9 символов)
  accountNumber: string // р/с (20 символов)
  contractNumber: string // Номер договора
  contractDate: string // Дата заключения договора
  useAutoMarketing: boolean // Использовать автомаркировку в ОРД
  budget: number // Бюджет рекламодателя
  statistics: AdvertiserStatistics
  createdAt: string
  updatedAt: string
}

export interface AdvertiserStatistics {
  ctr: number // CTR
  spent: number // Потрачено за всё время
  campaigns: number // Количество кампаний
}

export interface CreateAdvertiserData {
  name: string
  legalName: string
  inn: string
  kpp: string
  ogrn: string
  legalAddress: string
  bik: string
  accountNumber: string
  contractNumber: string
  contractDate: string
  useAutoMarketing: boolean
}

export interface UpdateAdvertiserData extends Partial<CreateAdvertiserData> {
  budget?: number
}

export interface AdvertiserFilter {
  search?: string
  sortBy?: 'name' | 'budget' | 'ctr' | 'spent' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface AdvertiserListResponse {
  advertisers: Advertiser[]
  total: number
  page: number
  totalPages: number
}
