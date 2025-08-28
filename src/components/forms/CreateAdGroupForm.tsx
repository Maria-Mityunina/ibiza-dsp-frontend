import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Check, Upload } from 'lucide-react'
import TimeScheduler from '@components/ui/TimeScheduler'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateAdGroupFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  advertiserName?: string
  advertiserBudget?: string
}

interface AdGroupFormData {
  platform: string
  name: string
  budget: string
  status: string
  scheduleStart: string
  scheduleEnd: string
  timeStart: string
  timeEnd: string
  allDay: boolean
  selectedDays: number[]
  userFrequencyLimit: string
  userFrequencyPeriod: string
  adFrequencyLimit: string
  adFrequencyPeriod: string
  clickLimit: string
  clickPeriod: string
  segments: string[]
  phoneModel: string
  region: string
  language: string
  osVersion: string
  excludeAudience: boolean
  excludeSegments: string[]
  excludeRegions: string[]
  description: string
}

const CreateAdGroupForm: React.FC<CreateAdGroupFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState<AdGroupFormData>({
    platform: '',
    name: '',
    budget: '',
    status: '',
    scheduleStart: '',
    scheduleEnd: '',
    timeStart: '00:00',
    timeEnd: '23:59',
    allDay: true,
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    userFrequencyLimit: '',
    userFrequencyPeriod: 'day',
    adFrequencyLimit: '',
    adFrequencyPeriod: 'day',
    clickLimit: '',
    clickPeriod: 'day',
    segments: [],
    phoneModel: '',
    region: '',
    language: '',
    osVersion: '',
    excludeAudience: false,
    excludeSegments: [],
    excludeRegions: [],
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSegmentUpload, setShowSegmentUpload] = useState(false)

  const platformOptions = [
    { value: 'rustore', label: 'RuStore' }
  ]

  const statusOptions = [
    { value: 'draft', label: 'Черновик' },
    { value: 'pending', label: 'На модерации' },
    { value: 'active', label: 'Активна' },
    { value: 'paused', label: 'Пауза' },
    { value: 'rejected', label: 'Отклонена' },
    { value: 'completed', label: 'Завершена' }
  ]

  const periodOptions = [
    { value: 'day', label: 'День' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'campaign', label: 'Вся РК' }
  ]

  const segmentOptions = [
    'Сегмент1',
    'Пол',
    'Лифт',
    'Модель телефона',
    'Регион',
    'Язык ОС',
    'Версия ОС',
    'Интерес'
  ]

  const regionOptions = [
    'Москва',
    'Санкт-Петербург',
    'Екатеринбург',
    'Новосибирск',
    'Нижний Новгород'
  ]

  const phoneModelOptions = [
    'iPhone',
    'Samsung Galaxy',
    'Xiaomi',
    'Huawei',
    'Honor',
    'Realme'
  ]

  const languageOptions = [
    'Русский',
    'Английский',
    'Немецкий',
    'Французский'
  ]

  const osVersionOptions = [
    'Android 10+',
    'Android 11+',
    'Android 12+',
    'iOS 14+',
    'iOS 15+'
  ]

  const handleInputChange = (field: keyof AdGroupFormData, value: string | boolean | string[] | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }



  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.platform) newErrors.platform = 'Выберите площадку размещения'
    if (!formData.name.trim()) newErrors.name = 'Введите название группы объявлений'
    if (!formData.budget.trim()) newErrors.budget = 'Введите бюджет'
    else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Введите корректную сумму'
    }
    if (!formData.status) newErrors.status = 'Выберите статус'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submissionData = {
      ...formData
    }

    onSubmit(submissionData)
    success('Группа объявлений создана успешно')
    onClose()
  }

  const handleSegmentUpload = () => {
    success('Функция загрузки сегментов будет реализована после интеграции с API')
    setShowSegmentUpload(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Создать группу объявлений
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Площадка размещения *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  className={`glass-select ${errors.platform ? 'error' : ''}`}
                >
                  <option value="">Выберите площадку</option>
                  {platformOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.platform && (
                  <p className="mt-1 text-sm text-red-500">{errors.platform}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название группы объявлений *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  maxLength={64}
                  className={`glass-input ${errors.name ? 'error' : ''}`}
                  placeholder="Введите название"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Бюджет *
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value.replace(/\D/g, ''))}
                  maxLength={7}
                  className={`glass-input ${errors.budget ? 'error' : ''}`}
                  placeholder="Введите бюджет"
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`glass-select ${errors.status ? 'error' : ''}`}
                >
                  <option value="">Выберите статус</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                )}
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Интервал проведения РК
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">с</label>
                    <input
                      type="date"
                      value={formData.scheduleStart}
                      onChange={(e) => handleInputChange('scheduleStart', e.target.value)}
                      className="glass-select"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">до</label>
                    <input
                      type="date"
                      value={formData.scheduleEnd}
                      onChange={(e) => handleInputChange('scheduleEnd', e.target.value)}
                      className="glass-select"
                    />
                  </div>
                </div>
              </div>

              {/* Time Schedule */}
              <div>
                <TimeScheduler
                  startTime={formData.timeStart}
                  endTime={formData.timeEnd}
                  selectedDays={formData.selectedDays}
                  allDay={formData.allDay}
                  onTimeChange={(startTime, endTime) => {
                    handleInputChange('timeStart', startTime)
                    handleInputChange('timeEnd', endTime)
                  }}
                  onDaysChange={(days) => handleInputChange('selectedDays', days)}
                  onAllDayChange={(allDay) => handleInputChange('allDay', allDay)}
                />
              </div>

              {/* Frequency Limits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лимит показов на пользователя
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 mt-3">Показ</span>
                      <input
                        type="text"
                        value={formData.userFrequencyLimit}
                        onChange={(e) => handleInputChange('userFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                        className="flex-1 glass-input"
                        placeholder="0"
                      />
                    </div>
                    <select
                      value={formData.userFrequencyPeriod}
                      onChange={(e) => handleInputChange('userFrequencyPeriod', e.target.value)}
                      className="w-full glass-select"
                    >
                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ad Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лимит показов объявления
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 mt-3">Показ</span>
                      <input
                        type="text"
                        value={formData.adFrequencyLimit}
                        onChange={(e) => handleInputChange('adFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                        className="flex-1 glass-input"
                        placeholder="0"
                      />
                    </div>
                    <select
                      value={formData.adFrequencyPeriod}
                      onChange={(e) => handleInputChange('adFrequencyPeriod', e.target.value)}
                      className="w-full glass-select"
                    >
                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Click Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лимит переходов
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 mt-3">Показ</span>
                      <input
                        type="text"
                        value={formData.clickLimit}
                        onChange={(e) => handleInputChange('clickLimit', e.target.value.replace(/\D/g, ''))}
                        className="flex-1 glass-input"
                        placeholder="0"
                      />
                    </div>
                    <select
                      value={formData.clickPeriod}
                      onChange={(e) => handleInputChange('clickPeriod', e.target.value)}
                      className="w-full glass-select"
                    >
                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Targeting */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Таргетинг</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Segments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Готовый сегмент
                    </label>
                    <select
                      multiple
                      value={formData.segments}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value)
                        handleInputChange('segments', values)
                      }}
                      className="glass-select"
                      size={4}
                    >
                      {segmentOptions.map(segment => (
                        <option key={segment} value={segment}>
                          {segment}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowSegmentUpload(true)}
                      className="mt-2 text-sm text-slate-600 hover:text-slate-800 underline"
                    >
                      Добавить новый сегмент
                    </button>
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Регион
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="glass-select"
                    >
                      <option value="">Выберите регион</option>
                      {regionOptions.map(region => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Модель телефона
                    </label>
                    <select
                      value={formData.phoneModel}
                      onChange={(e) => handleInputChange('phoneModel', e.target.value)}
                      className="glass-select"
                    >
                      <option value="">Выберите модель</option>
                      {phoneModelOptions.map(model => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Язык ОС
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="glass-select"
                    >
                      <option value="">Выберите язык</option>
                      {languageOptions.map(language => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* OS Version */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Версия ОС
                    </label>
                    <select
                      value={formData.osVersion}
                      onChange={(e) => handleInputChange('osVersion', e.target.value)}
                      className="glass-select"
                    >
                      <option value="">Выберите версию</option>
                      {osVersionOptions.map(version => (
                        <option key={version} value={version}>
                          {version}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Exclude Audience */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Исключить аудиторию
                  </h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.excludeAudience}
                      onChange={(e) => handleInputChange('excludeAudience', e.target.checked)}
                      className="w-5 h-5 text-slate-600 rounded border-gray-300 focus:ring-slate-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Включить исключения</span>
                  </label>
                </div>

                {formData.excludeAudience && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {/* Exclude Segments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Исключить сегменты
                      </label>
                      <select
                        multiple
                        value={formData.excludeSegments}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value)
                          handleInputChange('excludeSegments', values)
                        }}
                        className="glass-select"
                        size={4}
                      >
                        {segmentOptions.map(segment => (
                          <option key={segment} value={segment}>
                            {segment}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Exclude Regions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Исключить регионы
                      </label>
                      <select
                        multiple
                        value={formData.excludeRegions}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value)
                          handleInputChange('excludeRegions', values)
                        }}
                        className="glass-select"
                        size={4}
                      >
                        {regionOptions.map(region => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full glass-textarea"
                  placeholder="Введите описание группы объявлений"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Отменить
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                <Check className="w-5 h-5" />
                Сохранить
              </button>
            </div>
          </form>

          {/* Segment Upload Modal */}
          <AnimatePresence>
            {showSegmentUpload && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Добавить новый сегмент
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">
                      Перетащите файл сюда или нажмите для выбора
                    </p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleSegmentUpload}
                      className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSegmentUpload(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CreateAdGroupForm