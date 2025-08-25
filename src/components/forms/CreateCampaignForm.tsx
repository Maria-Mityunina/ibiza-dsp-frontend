import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateCampaignFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CampaignFormData) => void
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
  onSubmit,
  advertiserName = "ООО Зеленоглазое такси",
  advertiserBudget = "1000$"
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
    platform: 'rustore',
    status: 'draft',
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
    { value: 'draft', label: t('status.draft') },
    { value: 'pending', label: t('status.pending') },
    { value: 'active', label: t('status.active') },
    { value: 'paused', label: t('status.paused') },
    { value: 'rejected', label: t('status.rejected') },
    { value: 'completed', label: t('status.completed') }
  ]

  const periodOptions = [
    { value: 'day', label: t('time.day') },
    { value: 'week', label: t('time.week') },
    { value: 'month', label: t('time.month') },
    { value: 'campaign', label: t('time.whole_campaign') }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t('form.required_field')
    else if (formData.name.length > 64) newErrors.name = 'Максимум 64 символа'
    
    if (!formData.budget.trim()) newErrors.budget = t('form.required_field')
    else if (!/^\d+$/.test(formData.budget)) newErrors.budget = 'Только цифры'
    else if (formData.budget.length > 7) newErrors.budget = 'Максимум 7 цифр'
    
    if (!formData.startDate.trim()) newErrors.startDate = t('form.required_field')
    if (!formData.endDate.trim()) newErrors.endDate = t('form.required_field')
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = t('form.invalid_date_range')
      }
    }

    // Validate frequency limits
    if (formData.userFrequencyLimit && (!/^\d+$/.test(formData.userFrequencyLimit) || formData.userFrequencyLimit.length > 8)) {
      newErrors.userFrequencyLimit = 'Максимум 8 цифр'
    }
    if (formData.adFrequencyLimit && (!/^\d+$/.test(formData.adFrequencyLimit) || formData.adFrequencyLimit.length > 8)) {
      newErrors.adFrequencyLimit = 'Максимум 8 цифр'
    }
    if (formData.clickLimit && (!/^\d+$/.test(formData.clickLimit) || formData.clickLimit.length > 8)) {
      newErrors.clickLimit = 'Максимум 8 цифр'
    }

    // Validate description
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Максимум 500 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      success(t('campaign.created_successfully'))
      onClose()
      setFormData({
        name: '',
        budget: '',
        startDate: '',
        endDate: '',
        platform: '',
        status: '',
        userFrequencyLimit: '',
        userFrequencyPeriod: '',
        adFrequencyLimit: '',
        adFrequencyPeriod: '',
        clickLimit: '',
        clickPeriod: '',
        description: ''
      })
    } else {
      error(t('form.validation_error'))
    }
  }

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

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
          <h2 className="text-2xl font-bold text-gray-900">{t('campaign.create_new')}</h2>
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
            {/* Название РК */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.campaign_name')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('form.enter_campaign_name')}
                maxLength={64}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Бюджет */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.budget')} *
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value.replace(/\D/g, ''))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                maxLength={7}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            {/* Интервал проведения РК */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.campaign_period')} *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('form.from')}</label>
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
                  <label className="block text-xs text-gray-500 mb-1">{t('form.to')}</label>
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
              </div>
            </div>

            {/* Площадка размещения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.platform')}
              </label>
              <div className="relative">
                <select
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                >

                  {platformOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.status')}
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                >

                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Частота показов на пользователя */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.user_frequency_limit')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('form.shows')}</label>
                  <input
                    type="text"
                    value={formData.userFrequencyLimit}
                    onChange={(e) => handleInputChange('userFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="0"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('form.period')}</label>
                  <div className="relative">
                    <select
                      value={formData.userFrequencyPeriod}
                      onChange={(e) => handleInputChange('userFrequencyPeriod', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                    >

                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Лимит показов объявлений */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.ad_frequency_limit')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('form.shows')}</label>
                  <input
                    type="text"
                    value={formData.adFrequencyLimit}
                    onChange={(e) => handleInputChange('adFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="0"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('form.period')}</label>
                  <div className="relative">
                    <select
                      value={formData.adFrequencyPeriod}
                      onChange={(e) => handleInputChange('adFrequencyPeriod', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                    >

                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Лимит переходов */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.click_limit')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('form.shows')}</label>
                  <input
                    type="text"
                    value={formData.clickLimit}
                    onChange={(e) => handleInputChange('clickLimit', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="0"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('form.period')}</label>
                  <div className="relative">
                    <select
                      value={formData.clickPeriod}
                      onChange={(e) => handleInputChange('clickPeriod', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                    >

                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder={t('form.enter_description')}
              rows={4}
              maxLength={500}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('action.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {t('action.save')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateCampaignForm
