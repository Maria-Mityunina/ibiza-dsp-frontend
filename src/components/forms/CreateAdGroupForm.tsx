import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown, Plus, Minus, Upload } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateAdGroupFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AdGroupFormData) => void
  advertiserName?: string
  advertiserBudget?: string
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

const CreateAdGroupForm: React.FC<CreateAdGroupFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  advertiserName = "ООО Зеленоглазое такси",
  advertiserBudget = "1000$"
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState<AdGroupFormData>({
    platform: '',
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    userFrequencyLimit: '',
    userFrequencyPeriod: '',
    adFrequencyLimit: '',
    adFrequencyPeriod: '',
    clickLimit: '',
    clickPeriod: '',
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
  const [showExcludeAudience, setShowExcludeAudience] = useState(false)
  const [segmentFile, setSegmentFile] = useState<File | null>(null)

  const platformOptions = [
    { value: 'rustore', label: 'RuStore' },
    { value: 'yandex', label: 'Yandex Ads' },
    { value: 'vk', label: 'VK Ads' }
  ]

  const periodOptions = [
    { value: 'day', label: t('time.day') },
    { value: 'week', label: t('time.week') },
    { value: 'month', label: t('time.month') },
    { value: 'campaign', label: t('time.whole_campaign') }
  ]

  const segmentOptions = [
    { value: 'add_new', label: t('form.add_new_segment') },
    { value: 'segment_1', label: 'Segment 1' },
    { value: 'segment_2', label: 'Segment 2' },
    { value: 'segment_3', label: 'Segment 3' }
  ]

  const phoneModelOptions = [
    { value: '', label: t('form.select_phone_model') },
    { value: 'iphone', label: 'iPhone' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'xiaomi', label: 'Xiaomi' }
  ]

  const regionOptions = [
    { value: '', label: t('form.select_region') },
    { value: 'moscow', label: t('region.moscow') },
    { value: 'spb', label: t('region.spb') },
    { value: 'ekaterinburg', label: t('region.ekaterinburg') }
  ]

  const languageOptions = [
    { value: '', label: t('form.select_language') },
    { value: 'ru', label: t('language.russian') },
    { value: 'en', label: t('language.english') },
    { value: 'es', label: t('language.spanish') }
  ]

  const osVersionOptions = [
    { value: '', label: t('form.select_os_version') },
    { value: 'ios_16', label: 'iOS 16+' },
    { value: 'ios_15', label: 'iOS 15+' },
    { value: 'android_13', label: 'Android 13+' },
    { value: 'android_12', label: 'Android 12+' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t('form.required_field')
    if (!formData.budget.trim()) newErrors.budget = t('form.required_field')
    if (!formData.startDate.trim()) newErrors.startDate = t('form.required_field')
    if (!formData.endDate.trim()) newErrors.endDate = t('form.required_field')
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = t('form.invalid_date_range')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      success(t('adgroup.created_successfully'))
      onClose()
    } else {
      error(t('form.validation_error'))
    }
  }

  const handleInputChange = (field: keyof AdGroupFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSegmentChange = (value: string) => {
    if (value === 'add_new') {
      // Open file upload dialog
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.csv,.txt'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          setSegmentFile(file)
          success(t('form.segment_uploaded'))
        }
      }
      input.click()
    } else {
      const segments = formData.segments.includes(value)
        ? formData.segments.filter(s => s !== value)
        : [...formData.segments, value]
      handleInputChange('segments', segments)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSegmentFile(file)
      success(t('form.segment_uploaded'))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Simple Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{t('adgroup.create_new')}</h2>
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
                  {t('form.platform')}
                </label>
                <div className="relative">
                  <select
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">{t('form.select_platform')}</option>
                    {platformOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Название РК */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.adgroup_name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('form.enter_adgroup_name')}
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

              {/* Даты показа */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.show_dates')} *
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
                  </div>
                </div>
              </div>

              {/* Время показа */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.show_time')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('form.from')}</label>
                    <select
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">{t('form.select_time')}</option>
                      <option value="groups">{t('form.ad_groups')}</option>
                      <option value="all_day">{t('form.all_day')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('form.to')}</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Frequency Limits */}
              <div className="lg:col-span-2 space-y-4">
                {/* Лимит показов на пользователя */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.user_frequency_limit')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.userFrequencyLimit}
                      onChange={(e) => handleInputChange('userFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder={t('form.shows')}
                    />
                    <select
                      value={formData.userFrequencyPeriod}
                      onChange={(e) => handleInputChange('userFrequencyPeriod', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">{t('form.period')}</option>
                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Лимит показов объявления */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.ad_frequency_limit')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.adFrequencyLimit}
                      onChange={(e) => handleInputChange('adFrequencyLimit', e.target.value.replace(/\D/g, ''))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder={t('form.shows')}
                    />
                    <select
                      value={formData.adFrequencyPeriod}
                      onChange={(e) => handleInputChange('adFrequencyPeriod', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">{t('form.period')}</option>
                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Лимит переходов */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.click_limit')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.clickLimit}
                      onChange={(e) => handleInputChange('clickLimit', e.target.value.replace(/\D/g, ''))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder={t('form.shows')}
                    />
                    <select
                      value={formData.clickPeriod}
                      onChange={(e) => handleInputChange('clickPeriod', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">{t('form.period')}</option>
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
                  {t('form.ready_segment')}
                </label>
                <div className="space-y-2">
                  {segmentOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={option.value === 'add_new' ? !!segmentFile : formData.segments.includes(option.value)}
                        onChange={() => handleSegmentChange(option.value)}
                        className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                      {option.value === 'add_new' && (
                        <input
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="segment-upload"
                        />
                      )}
                    </label>
                  ))}
                  {segmentFile && (
                    <p className="text-sm text-green-600">
                      {t('form.file_uploaded')}: {segmentFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Targeting Options */}
              <div className="space-y-4">
                {/* Модель телефона */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.phone_model')}
                  </label>
                  <select
                    value={formData.phoneModel}
                    onChange={(e) => handleInputChange('phoneModel', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
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
                    {t('form.region')}
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
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
                    {t('form.os_language')}
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
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
                    {t('form.os_version')}
                  </label>
                  <select
                    value={formData.osVersion}
                    onChange={(e) => handleInputChange('osVersion', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white"
                  >
                    {osVersionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Исключить аудиторию */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowExcludeAudience(!showExcludeAudience)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{t('form.exclude_audience')}</span>
                {showExcludeAudience ? (
                  <Minus className="w-4 h-4 text-gray-400" />
                ) : (
                  <Plus className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {showExcludeAudience && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.exclude_segments')}
                    </label>
                    <select
                      multiple
                      value={formData.excludeSegments}
                      onChange={(e) => handleInputChange('excludeSegments', Array.from(e.target.selectedOptions, option => option.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      {segmentOptions.filter(opt => opt.value !== 'add_new').map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.exclude_regions')}
                    </label>
                    <select
                      multiple
                      value={formData.excludeRegions}
                      onChange={(e) => handleInputChange('excludeRegions', Array.from(e.target.selectedOptions, option => option.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      {regionOptions.filter(opt => opt.value !== '').map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
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

export default CreateAdGroupForm
