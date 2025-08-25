// Константы для форматов

export const DATE_FORMATS = {
  DATE_DISPLAY: 'dd.MM.yyyy',
  DATE_INPUT: 'yyyy-MM-dd',
  DATETIME_DISPLAY: 'dd.MM.yyyy HH:mm',
  DATETIME_INPUT: 'yyyy-MM-dd HH:mm',
} as const

export const CURRENCY_FORMAT = {
  LOCALE: 'ru-RU',
  CURRENCY: 'RUB',
} as const

export const NUMBER_FORMATS = {
  INTEGER: { maximumFractionDigits: 0 },
  DECIMAL: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  PERCENTAGE: { style: 'percent', minimumFractionDigits: 2 },
} as const

// Ограничения полей для всех форм
export const FIELD_LIMITS = {
  // Рекламодатель
  ADVERTISER_NAME: 64,
  LEGAL_NAME: 64,
  INN: 12,
  KPP: 9,
  OGRN: 15,
  LEGAL_ADDRESS: 500,
  BIK: 9,
  ACCOUNT_NUMBER: 20,
  CONTRACT_NUMBER: 20,
  
  // Кампания
  CAMPAIGN_NAME: 64,
  CAMPAIGN_BUDGET: 7,
  CAMPAIGN_DESCRIPTION: 500,
  SHOW_LIMIT: 8,
  
  // Группа объявлений
  ADGROUP_NAME: 64,
  ADGROUP_BUDGET: 7,
  ADGROUP_DESCRIPTION: 500,
  
  // Креатив
  CREATIVE_NAME: 16,
  CREATIVE_TITLE: 16,
  CREATIVE_TEXT: 32,
  CREATIVE_URL: 500,
  CREATIVE_CPM: 4,
  CREATIVE_BUDGET: 7,
} as const

// Регулярные выражения для валидации
export const VALIDATION_PATTERNS = {
  INN: /^\d{10}$|^\d{12}$/,
  KPP: /^\d{9}$/,
  OGRN: /^\d{13}$|^\d{15}$/,
  BIK: /^\d{9}$/,
  ACCOUNT_NUMBER: /^\d{20}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  URL: /^https?:\/\/.+/,
  NUMBERS_ONLY: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
} as const

// Статусы на русском языке
export const STATUS_LABELS = {
  draft: 'Черновик',
  moderation: 'На модерации',
  active: 'Активна',
  paused: 'Пауза',
  rejected: 'Отклонена',
  completed: 'Завершена',
} as const

// Цвета статусов
export const STATUS_COLORS = {
  draft: 'gray',
  moderation: 'yellow',
  active: 'green',
  paused: 'blue',
  rejected: 'red',
  completed: 'gray',
} as const

// Периоды для лимитов
export const PERIOD_LABELS = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  campaign: 'Вся РК',
} as const

// Платформы
export const PLATFORM_LABELS = {
  rustore: 'RuStore',
} as const

// Форматы креативов
export const CREATIVE_FORMAT_LABELS = {
  '6_small': '6 маленький',
  '16_small': '16 маленький',
  '4_big': '4 большой',
  '13_small': '13 маленький',
  '10_big': '10 большой',
  '3_small': '3 маленький',
  '15_small': '15 маленький',
  '97_small': '97 маленький',
} as const

// Размеры изображений для больших форматов
export const IMAGE_SIZE_OPTIONS = [
  { width: 1200, height: 675, label: '1200×675' },
  { width: 1080, height: 608, label: '1080×608' },
  { width: 5000, height: 2812, label: '5000×2812' },
] as const

// Допустимые форматы изображений
export const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/gif'] as const
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'] as const

// Максимальный размер изображения (5MB)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
