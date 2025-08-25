import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface EditCampaignFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CampaignFormData) => void
  campaign?: CampaignFormData & { id: string }
}

interface CampaignFormData {
  name: string
  platform: string
  budget: string
  status: string
  startDate: string
  endDate: string
  userFrequencyLimit: string
  adFrequencyLimit: string
  clickLimit: string
  userFrequencyPeriod: string
  adFrequencyPeriod: string
  clickPeriod: string
  description: string
}

const EditCampaignForm: React.FC<EditCampaignFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  campaign
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    platform: 'rustore',
    budget: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    userFrequencyLimit: '',
    adFrequencyLimit: '',
    clickLimit: '',
    userFrequencyPeriod: 'day',
    adFrequencyPeriod: 'day',
    clickPeriod: 'day',
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Заполняем форму данными кампании при открытии
  useEffect(() => {
    if (campaign && isOpen) {
      setFormData({
        name: campaign.name || '',
        platform: campaign.platform || 'rustore',
        budget: campaign.budget || '',
        status: campaign.status || 'draft',
        startDate: campaign.startDate || '',
        endDate: campaign.endDate || '',
        userFrequencyLimit: campaign.userFrequencyLimit || '',
        adFrequencyLimit: campaign.adFrequencyLimit || '',
        clickLimit: campaign.clickLimit || '',
        userFrequencyPeriod: campaign.userFrequencyPeriod || 'day',
        adFrequencyPeriod: campaign.adFrequencyPeriod || 'day',
        clickPeriod: campaign.clickPeriod || 'day',
        description: campaign.description || ''
      })
    }
  }, [campaign, isOpen])

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
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
    success('Кампания успешно обновлена')
    onClose()
  }

  if (!isOpen) return null

  const platformOptions = [
    { value: 'rustore', label: 'RuStore' }
  ]

  const statusOptions = [
    { value: 'draft', label: 'Черновик' },
    { value: 'active', label: 'Активная' },
    { value: 'paused', label: 'Пауза' },
    { value: 'pending', label: 'На модерации' }
  ]

  const periodOptions = [
    { value: 'day', label: 'День' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' }
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
          <h2 className="text-2xl font-bold text-gray-900">Редактировать кампанию</h2>
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
                Площадка размещения *
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

            {/* Название кампании */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название кампании *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите название кампании"
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
                Статус *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                placeholder="Введите описание кампании"
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

export default EditCampaignForm
