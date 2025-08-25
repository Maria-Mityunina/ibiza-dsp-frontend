import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown, Upload, Eye } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateCreativeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreativeFormData) => void
  advertiserName?: string
  advertiserBudget?: string
}

interface CreativeFormData {
  placement: string
  name: string
  budget: string
  title: string
  text: string
  link: string
  cpm: string
  image?: File
  launchAfterSave: boolean
}

const CreateCreativeForm: React.FC<CreateCreativeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  advertiserName = "ООО Зеленоглазое такси",
  advertiserBudget = "1000$"
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<CreativeFormData>({
    placement: '6_small',
    name: '',
    budget: '',
    title: '',
    text: '',
    link: '',
    cpm: '',
    launchAfterSave: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const placementOptions = [
    { 
      value: '6_small', 
      label: 'Маленький баннер 320x50',
      type: 'small',
      description: t('form.small_format_desc')
    },
    { 
      value: '16_small', 
      label: 'Компактный 300x100',
      type: 'small',
      description: t('form.small_format_desc')
    },
    { 
      value: '2_small', 
      label: 'Узкий баннер 728x90',
      type: 'small',
      description: t('form.small_format_desc')
    },
    { 
      value: '4_big', 
      label: 'Большой баннер 1200x675',
      type: 'big',
      description: t('form.big_format_desc')
    },
    { 
      value: '13_small', 
      label: 'Квадратный 250x250',
      type: 'small',
      description: t('form.small_format_desc')
    },
    { 
      value: '10_big', 
      label: 'Широкий баннер 1080x608',
      type: 'big',
      description: t('form.big_format_desc')
    },
    { 
      value: '3_small', 
      label: 'Мобильный 300x50',
      type: 'small',
      description: t('form.small_format_desc')
    },
    { 
      value: '15_small', 
      label: 'Средний 468x60',
      type: 'small',
      description: t('form.small_format_desc')
    },
    { 
      value: '97_small', 
      label: 'Вертикальный 160x600',
      type: 'small',
      description: t('form.small_format_desc')
    }
  ]

  const selectedPlacement = placementOptions.find(p => p.value === formData.placement)
  const isSmallFormat = selectedPlacement?.type === 'small'
  const isBigFormat = selectedPlacement?.type === 'big'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.placement) newErrors.placement = t('form.required_field')
    
    if (!formData.name.trim()) newErrors.name = 'Поле обязательно для заполнения'
    else if (formData.name.length > 64) newErrors.name = 'Максимум 64 символа'
    
    if (!formData.budget.trim()) newErrors.budget = 'Поле обязательно для заполнения'
    else if (!/^\d+$/.test(formData.budget)) newErrors.budget = 'Только цифры'
    else if (formData.budget.length > 7) newErrors.budget = 'Максимум 7 цифр'
    
    if (!formData.link.trim()) newErrors.link = t('form.required_field')
    else if (formData.link.length > 500) newErrors.link = 'Максимум 500 символов'
    
    if (!formData.cpm.trim()) newErrors.cpm = t('form.required_field')
    else if (!/^\d+$/.test(formData.cpm)) newErrors.cpm = 'Только цифры'
    else if (formData.cpm.length > 4) newErrors.cpm = 'Максимум 4 цифры'
    
    if (isSmallFormat) {
      if (!formData.title.trim()) newErrors.title = t('form.required_field')
      else if (formData.title.length > 16) newErrors.title = 'Максимум 16 символов'
      
      if (!formData.text.trim()) newErrors.text = t('form.required_field')
      else if (formData.text.length > 32) newErrors.text = 'Максимум 32 символа'
    }
    
    if (isBigFormat && !formData.image) {
      newErrors.image = t('form.image_required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      success(t('creative.created_successfully'))
      onClose()
      resetForm()
    } else {
      error(t('form.validation_error'))
    }
  }

  const resetForm = () => {
    setFormData({
      placement: '6_small',
      name: '',
      budget: '',
      title: '',
      text: '',
      link: '',
      cpm: '',
      launchAfterSave: false
    })
    setImagePreview(null)
    setErrors({})
  }

  const handleInputChange = (field: keyof CreativeFormData, value: string | boolean | File) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate image size and format
      const validFormats = ['image/jpeg', 'image/png', 'image/webp']
      if (!validFormats.includes(file.type)) {
        error(t('form.invalid_image_format'))
        return
      }

      const img = new Image()
      img.onload = () => {
        const validSizes = [
          { width: 1200, height: 675 },
          { width: 1080, height: 608 },
          { width: 5000, height: 2812 }
        ]
        
        const isValidSize = validSizes.some(size => 
          img.width === size.width && img.height === size.height
        )
        
        if (!isValidSize) {
          error(t('form.invalid_image_size'))
          return
        }

        handleInputChange('image', file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
      
      img.src = URL.createObjectURL(file)
    }
  }

  const generateMacros = (link: string) => {
    if (!link) return ''
    
    const macros = [
      '{campaign}', '{campaign_id}', '{group}', '{group_id}', 
      '{creo}', '{creo_id}', '{gaid}', '{click_id}'
    ]
    
    const separator = link.includes('?') ? '&' : '?'
    return `${link}${separator}${macros.map(m => `${m.slice(1, -1)}=${m}`).join('&')}`
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
          <h2 className="text-2xl font-bold text-gray-900">{t('creative.create_new')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 m-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {t('form.creative_notice')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Side notes */}
          <div className="hidden lg:block w-48 bg-blue-50 p-4 text-sm">
            <div className="bg-blue-100 p-3 rounded-lg mb-4">
              <p className="text-blue-700 font-medium">{t('form.note_creative')}</p>
              <p className="text-blue-600 text-xs mt-1">{t('form.creative_requirements')}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex">
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
              {/* Плейсмент */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Плейсмент *
                </label>
                <div className="relative">
                  <select
                    value={formData.placement}
                    onChange={(e) => handleInputChange('placement', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white ${
                      errors.placement ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >

                    {placementOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.placement && <p className="text-red-500 text-sm mt-1">{errors.placement}</p>}
              </div>

              {/* Название креатива */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название креатива *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите название креатива"
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

              {/* Dynamic fields based on placement type */}
              {isSmallFormat && (
                <>
                  {/* Заголовок креатива */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.creative_title')} * ({formData.title.length}/16)
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('form.enter_creative_title')}
                      maxLength={16}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  {/* Текст креатива */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.creative_text')} * ({formData.text.length}/32)
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => handleInputChange('text', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                        errors.text ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('form.enter_creative_text')}
                      rows={3}
                      maxLength={32}
                    />
                    {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
                  </div>
                </>
              )}

              {isBigFormat && (
                <>
                  {/* Изображение */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.image')} *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {!imagePreview ? (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            {t('form.upload_image')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t('form.supported_formats')}: JPG, PNG, WebP
                          </p>
                          <p className="text-xs text-gray-500">
                            {t('form.supported_sizes')}: 1200×675, 1080×608, 5000×2812
                          </p>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            {t('form.choose_file')}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto max-h-48 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            {t('form.change_image')}
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                  </div>

                  {/* Size info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {t('form.recommended_size')}: 1080×608 {t('form.pixels')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('form.size_requirements')}
                    </p>
                  </div>
                </>
              )}

              {/* Ссылка */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.link')} *
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.link ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com"
                  maxLength={500}
                />
                {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
                
                {formData.link && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">{t('form.generated_link_with_macros')}:</p>
                    <p className="text-xs text-gray-800 break-all font-mono">
                      {generateMacros(formData.link)}
                    </p>
                  </div>
                )}
              </div>

              {/* CPM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPM *
                </label>
                <input
                  type="text"
                  value={formData.cpm}
                  onChange={(e) => handleInputChange('cpm', e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.cpm ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  maxLength={4}
                />
                {errors.cpm && <p className="text-red-500 text-sm mt-1">{errors.cpm}</p>}
              </div>

              {/* Запуск после сохранения */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="launchAfterSave"
                  checked={formData.launchAfterSave}
                  onChange={(e) => handleInputChange('launchAfterSave', e.target.checked)}
                  className="w-5 h-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                />
                <label htmlFor="launchAfterSave" className="text-sm font-medium text-gray-700">
                  {t('form.launch_after_save')}
                </label>
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

            {/* Preview Panel */}
            {selectedPlacement && (
              <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900">{t('form.preview')}</h3>
                </div>
                
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  {isSmallFormat && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">
                        {formData.title || t('form.creative_title_placeholder')}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formData.text || t('form.creative_text_placeholder')}
                      </div>
                      <div className="text-xs text-blue-600 underline">
                        {formData.link || 'https://example.com'}
                      </div>
                      <div className="text-xs text-gray-500">
                        CPM: {formData.cpm || '0'}
                      </div>
                    </div>
                  )}
                  
                  {isBigFormat && (
                    <div className="space-y-3">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Creative preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="text-center text-gray-500">
                            <Upload className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">{t('form.image_placeholder')}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-blue-600 underline">
                        {formData.link || 'https://example.com'}
                      </div>
                      <div className="text-xs text-gray-500">
                        CPM: {formData.cpm || '0'}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    {t('form.format')}: {selectedPlacement.label}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateCreativeForm
