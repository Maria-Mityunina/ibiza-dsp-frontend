import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateCampaignFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  advertiserName?: string
  advertiserBudget?: string
}

interface CampaignFormData {
  name: string
  budget: string
  startDate: string
  endDate: string
  platform: string
  status: string
  userFrequencyLimit: string
  userFrequencyPeriod: string
  adFrequencyLimit: string
  adFrequencyPeriod: string
  clickLimit: string
  clickPeriod: string
  description: string
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
    platform: '',
    status: '',
    userFrequencyLimit: '',
    userFrequencyPeriod: 'day',
    adFrequencyLimit: '',
    adFrequencyPeriod: 'day',
    clickLimit: '',
    clickPeriod: 'day',
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Введите название РК'
    else if (formData.name.length > 64) newErrors.name = 'Максимум 64 символа'

    if (!formData.budget.trim()) newErrors.budget = 'Введите бюджет'
    else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Введите корректную сумму'
    } else if (formData.budget.length > 7) {
      newErrors.budget = 'Максимум 7 символов'
    }

    if (!formData.startDate) newErrors.startDate = 'Выберите дату начала'
    if (!formData.endDate) newErrors.endDate = 'Выберите дату окончания'
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = 'Дата окончания должна быть позже даты начала'
      }
    }

    if (!formData.platform) newErrors.platform = 'Выберите площадку размещения'
    if (!formData.status) newErrors.status = 'Выберите статус'

    // Validate frequency limits if filled
    if (formData.userFrequencyLimit && (isNaN(Number(formData.userFrequencyLimit)) || Number(formData.userFrequencyLimit) < 0)) {
      newErrors.userFrequencyLimit = 'Введите корректное значение'
    }
    if (formData.adFrequencyLimit && (isNaN(Number(formData.adFrequencyLimit)) || Number(formData.adFrequencyLimit) < 0)) {
      newErrors.adFrequencyLimit = 'Введите корректное значение'
    }
    if (formData.clickLimit && (isNaN(Number(formData.clickLimit)) || Number(formData.clickLimit) < 0)) {
      newErrors.clickLimit = 'Введите корректное значение'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      error('Не все обязательные поля заполнены')
      return
    }

    onSubmit(formData)
    success('Рекламная кампания создана успешно')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Создать рекламную кампанию
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
              
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название РК *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  maxLength={64}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите название рекламной кампании"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите бюджет (только цифры)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Максимум 7 символов. Бюджет РК ограничивает совокупный бюджет всех групп объявлений
                </p>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
                )}
              </div>

              {/* Campaign Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Интервал проведения РК *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">с</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">до</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Площадка размещения *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.platform ? 'border-red-500' : 'border-gray-300'
                  }`}
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

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
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

              {/* Frequency Limits */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Лимиты</h3>
                
                {/* User Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Частота показов на пользователя
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Показ</label>
                      <input
                        type="text"
                        value={formData.userFrequencyLimit}
                        onChange={(e) => handleInputChange('userFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                        maxLength={8}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                          errors.userFrequencyLimit ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {errors.userFrequencyLimit && (
                        <p className="mt-1 text-sm text-red-500">{errors.userFrequencyLimit}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Период</label>
                      <select
                        value={formData.userFrequencyPeriod}
                        onChange={(e) => handleInputChange('userFrequencyPeriod', e.target.value)}
                        className="glass-select"
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

                {/* Ad Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лимит показов объявлений
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Показ</label>
                      <input
                        type="text"
                        value={formData.adFrequencyLimit}
                        onChange={(e) => handleInputChange('adFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                        maxLength={8}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                          errors.adFrequencyLimit ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {errors.adFrequencyLimit && (
                        <p className="mt-1 text-sm text-red-500">{errors.adFrequencyLimit}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Период</label>
                      <select
                        value={formData.adFrequencyPeriod}
                        onChange={(e) => handleInputChange('adFrequencyPeriod', e.target.value)}
                        className="glass-select"
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

                {/* Click Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лимит переходов
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Показ</label>
                      <input
                        type="text"
                        value={formData.clickLimit}
                        onChange={(e) => handleInputChange('clickLimit', e.target.value.replace(/\D/g, ''))}
                        maxLength={8}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                          errors.clickLimit ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {errors.clickLimit && (
                        <p className="mt-1 text-sm text-red-500">{errors.clickLimit}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Период</label>
                      <select
                        value={formData.clickPeriod}
                        onChange={(e) => handleInputChange('clickPeriod', e.target.value)}
                        className="glass-select"
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
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="glass-textarea"
                  placeholder="Введите описание рекламной кампании (необязательно)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Максимум 500 символов
                </p>
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
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CreateCampaignForm