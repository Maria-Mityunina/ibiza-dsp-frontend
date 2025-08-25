import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface EditAdGroupFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AdGroupFormData) => void
  adGroup?: AdGroupFormData & { id: string }
}

interface AdGroupFormData {
  platform: string
  name: string
  budget: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
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

const EditAdGroupForm: React.FC<EditAdGroupFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  adGroup
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState<AdGroupFormData>({
    platform: 'rustore',
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
    startTime: 'ad_groups',
    endTime: 'all_day',
    userFrequencyLimit: '',
    userFrequencyPeriod: 'day',
    adFrequencyLimit: '',
    adFrequencyPeriod: 'day',
    clickLimit: '',
    clickPeriod: 'day',
    segments: [],
    phoneModel: 'any',
    region: 'all_russia',
    language: 'ru',
    osVersion: 'any_version',
    excludeAudience: false,
    excludeSegments: [],
    excludeRegions: [],
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Заполняем форму данными группы объявлений при открытии
  useEffect(() => {
    if (adGroup && isOpen) {
      setFormData({
        platform: adGroup.platform || 'rustore',
        name: adGroup.name || '',
        budget: adGroup.budget || '',
        startDate: adGroup.startDate || '',
        endDate: adGroup.endDate || '',
        startTime: adGroup.startTime || 'ad_groups',
        endTime: adGroup.endTime || 'all_day',
        userFrequencyLimit: adGroup.userFrequencyLimit || '',
        userFrequencyPeriod: adGroup.userFrequencyPeriod || 'day',
        adFrequencyLimit: adGroup.adFrequencyLimit || '',
        adFrequencyPeriod: adGroup.adFrequencyPeriod || 'day',
        clickLimit: adGroup.clickLimit || '',
        clickPeriod: adGroup.clickPeriod || 'day',
        segments: adGroup.segments || [],
        phoneModel: adGroup.phoneModel || 'any',
        region: adGroup.region || 'all_russia',
        language: adGroup.language || 'ru',
        osVersion: adGroup.osVersion || 'any_version',
        excludeAudience: adGroup.excludeAudience || false,
        excludeSegments: adGroup.excludeSegments || [],
        excludeRegions: adGroup.excludeRegions || [],
        description: adGroup.description || ''
      })
    }
  }, [adGroup, isOpen])

  const handleInputChange = (field: keyof AdGroupFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Поле обязательно для заполнения'
    else if (formData.name.length > 64) newErrors.name = 'Максимум 64 символа'

    if (!formData.budget.trim()) newErrors.budget = 'Поле обязательно для заполнения'
    else if (!/^\d+$/.test(formData.budget)) newErrors.budget = 'Только цифры'
    else if (formData.budget.length > 7) newErrors.budget = 'Максимум 7 цифр'

    if (!formData.startDate) newErrors.startDate = 'Поле обязательно для заполнения'
    if (!formData.endDate) newErrors.endDate = 'Поле обязательно для заполнения'
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Дата окончания должна быть позже даты начала'
    }

    if (formData.userFrequencyLimit && (!/^\d+$/.test(formData.userFrequencyLimit) || formData.userFrequencyLimit.length > 8)) {
      newErrors.userFrequencyLimit = 'Максимум 8 цифр'
    }

    if (formData.adFrequencyLimit && (!/^\d+$/.test(formData.adFrequencyLimit) || formData.adFrequencyLimit.length > 8)) {
      newErrors.adFrequencyLimit = 'Максимум 8 цифр'
    }

    if (formData.clickLimit && (!/^\d+$/.test(formData.clickLimit) || formData.clickLimit.length > 8)) {
      newErrors.clickLimit = 'Максимум 8 цифр'
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Максимум 500 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      error('Пожалуйста, исправьте ошибки в форме')
      return
    }

    onSubmit(formData)
    success('Группа объявлений успешно обновлена')
    onClose()
  }

  if (!isOpen) return null

  const platformOptions = [
    { value: 'rustore', label: 'RuStore' }
  ]

  const periodOptions = [
    { value: 'day', label: 'День' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' }
  ]

  const segmentOptions = [
    { value: 'young_adults', label: 'Молодежь 18-25' },
    { value: 'middle_age', label: 'Средний возраст 26-40' },
    { value: 'seniors', label: 'Старший возраст 40+' },
    { value: 'gamers', label: 'Геймеры' },
    { value: 'shoppers', label: 'Покупатели онлайн' },
    { value: 'travelers', label: 'Путешественники' }
  ]

  const phoneModelOptions = [
    { value: 'any', label: 'Любое устройство' },
    { value: 'iphone', label: 'iPhone' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'xiaomi', label: 'Xiaomi' },
    { value: 'huawei', label: 'Huawei' },
    { value: 'oppo', label: 'OPPO' }
  ]

  const regionOptions = [
    { value: 'all_russia', label: 'Вся Россия' },
    { value: 'moscow', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'ekaterinburg', label: 'Екатеринбург' },
    { value: 'novosibirsk', label: 'Новосибирск' },
    { value: 'kazan', label: 'Казань' }
  ]

  const languageOptions = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'Английский' },
    { value: 'es', label: 'Испанский' },
    { value: 'de', label: 'Немецкий' },
    { value: 'fr', label: 'Французский' }
  ]

  const osVersionOptions = [
    { value: 'any_version', label: 'Любая версия ОС' },
    { value: 'ios_17', label: 'iOS 17+' },
    { value: 'ios_16', label: 'iOS 16+' },
    { value: 'ios_15', label: 'iOS 15+' },
    { value: 'android_14', label: 'Android 14+' },
    { value: 'android_13', label: 'Android 13+' },
    { value: 'android_12', label: 'Android 12+' }
  ]

  const timeOptions = [
    { value: 'ad_groups', label: 'Группы объявлений' },
    { value: 'all_day', label: 'Весь день' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Simple Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Редактировать группу объявлений</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Площадка размещения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Площадка размещения
              </label>
              <select
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Название группы объявлений */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название группы объявлений *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите название группы объявлений"
                maxLength={64}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Бюджет */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Бюджет *
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value.replace(/\D/g, '').slice(0, 7))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10000"
                maxLength={7}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <input
                type="text"
                value="Черновик"
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            {/* Интервал проведения РК */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            {/* Время показа */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Время показа
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Показ</label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    {timeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Период</label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    {timeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Лимит показов на пользователя */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Лимит показов на пользователя
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.userFrequencyLimit}
                    onChange={(e) => handleInputChange('userFrequencyLimit', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                      errors.userFrequencyLimit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Показ"
                    maxLength={8}
                  />
                  {errors.userFrequencyLimit && <p className="text-red-500 text-sm mt-1">{errors.userFrequencyLimit}</p>}
                </div>
                <div className="flex-1">
                  <select
                    value={formData.userFrequencyPeriod}
                    onChange={(e) => handleInputChange('userFrequencyPeriod', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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

            {/* Лимит показов объявления */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Лимит показов объявления
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.adFrequencyLimit}
                    onChange={(e) => handleInputChange('adFrequencyLimit', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                      errors.adFrequencyLimit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Показ"
                    maxLength={8}
                  />
                  {errors.adFrequencyLimit && <p className="text-red-500 text-sm mt-1">{errors.adFrequencyLimit}</p>}
                </div>
                <div className="flex-1">
                  <select
                    value={formData.adFrequencyPeriod}
                    onChange={(e) => handleInputChange('adFrequencyPeriod', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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

            {/* Лимит переходов */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Лимит переходов
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.clickLimit}
                    onChange={(e) => handleInputChange('clickLimit', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                      errors.clickLimit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Показ"
                    maxLength={8}
                  />
                  {errors.clickLimit && <p className="text-red-500 text-sm mt-1">{errors.clickLimit}</p>}
                </div>
                <div className="flex-1">
                  <select
                    value={formData.clickPeriod}
                    onChange={(e) => handleInputChange('clickPeriod', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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

            {/* Готовый сегмент */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Готовый сегмент
              </label>
              <select
                value={formData.segments[0] || ''}
                onChange={(e) => handleInputChange('segments', e.target.value ? [e.target.value] : [])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Перетащите файл сюда, чтобы загрузить новый сегмент</option>
                {segmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Модель телефона */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Модель телефона
              </label>
              <select
                value={formData.phoneModel}
                onChange={(e) => handleInputChange('phoneModel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {phoneModelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Регион */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Регион
              </label>
              <select
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {regionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Язык ОС */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Язык ОС
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Версия ОС */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Версия ОС
              </label>
              <select
                value={formData.osVersion}
                onChange={(e) => handleInputChange('osVersion', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {osVersionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Исключить аудиторию */}
            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={() => handleInputChange('excludeAudience', !formData.excludeAudience)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Исключить аудиторию +
              </button>
            </div>

            {/* Описание */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите описание группы объявлений"
                rows={3}
                maxLength={500}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Сохранить
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditAdGroupForm
