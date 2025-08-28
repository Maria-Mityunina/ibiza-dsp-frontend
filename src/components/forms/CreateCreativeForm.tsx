import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Eye, Check } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateCreativeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  advertiserName?: string
  advertiserBudget?: string
}

interface CreativeFormData {
  placement: string
  name: string
  budget: string
  title: string
  text: string
  url: string
  cpm: string
  image?: File
  launchAfterSave: boolean
}

const CreateCreativeForm: React.FC<CreateCreativeFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<CreativeFormData>({
    placement: '',
    name: '',
    budget: '',
    title: '',
    text: '',
    url: '',
    cpm: '',
    launchAfterSave: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPlacementDropdown, setShowPlacementDropdown] = useState(false)

  const placementOptions = [
    { value: '6_small', label: '6 Маленький', type: 'small', description: 'Компактный формат для боковых панелей' },
    { value: '16_small', label: '16 Маленький', type: 'small', description: 'Стандартный баннер' },
    { value: '2_small', label: '2 Маленький', type: 'small', description: 'Мини-баннер в контенте' },
    { value: '4_big', label: '4 Большой', type: 'big', description: 'Большой баннер в шапке' },
    { value: '13_small', label: '13 Маленький', type: 'small', description: 'Баннер в списке приложений' },
    { value: '10_big', label: '10 Большой', type: 'big', description: 'Полноширинный баннер' },
    { value: '3_small', label: '3 Маленький', type: 'small', description: 'Текстовое объявление' },
    { value: '15_small', label: '15 Маленький', type: 'small', description: 'Карточка в каталоге' },
    { value: '97_small', label: '97 Маленький', type: 'small', description: 'Нативное объявление' }
  ]

  const selectedPlacement = placementOptions.find(opt => opt.value === formData.placement)
  const isBigFormat = selectedPlacement?.type === 'big'

  const handleInputChange = (field: keyof CreativeFormData, value: string | boolean | File) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Пожалуйста, выберите изображение')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error('Размер файла не должен превышать 5MB')
      return
    }

    handleInputChange('image', file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.placement) newErrors.placement = 'Выберите плейсмент'
    
    if (!isBigFormat) {
      if (!formData.name.trim()) newErrors.name = 'Введите название креатива'
      else if (formData.name.length > 16) newErrors.name = 'Максимум 16 символов'
      
      if (!formData.title.trim()) newErrors.title = 'Введите заголовок'
      else if (formData.title.length > 16) newErrors.title = 'Максимум 16 символов'
      
      if (!formData.text.trim()) newErrors.text = 'Введите текст'
      else if (formData.text.length > 32) newErrors.text = 'Максимум 32 символа'
    }

    if (!formData.budget.trim()) newErrors.budget = 'Введите бюджет'
    else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Введите корректную сумму'
    }

    if (!formData.url.trim()) newErrors.url = 'Введите ссылку'
    else if (!isValidUrl(formData.url)) newErrors.url = 'Введите корректную ссылку'

    if (!formData.cpm.trim()) newErrors.cpm = 'Введите CPM'
    else if (isNaN(Number(formData.cpm)) || Number(formData.cpm) <= 0) {
      newErrors.cpm = 'Введите корректную сумму'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const generateMacroUrl = (baseUrl: string) => {
    return `${baseUrl}?campaign={campaign}&campaign_id={campaign_id}&group={group}&group_id={group_id}&creo={creo}&creo_id={creo_id}&gaid={gaid}&click_id={click_id}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submissionData = {
      ...formData,
      url: generateMacroUrl(formData.url),
      type: isBigFormat ? 'big' : 'small'
    }

    onSubmit(submissionData)
    success('Креатив создан успешно')
    onClose()
  }

  const handlePreview = () => {
    success('Предпросмотр будет доступен после интеграции с API')
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
              Создать креатив
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
              
              {/* Placement Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Плейсмент *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPlacementDropdown(!showPlacementDropdown)}
                    className={`w-full px-4 py-2.5 text-left transition-all duration-200 text-sm font-normal rounded-2xl bg-white/15 backdrop-blur-lg border border-white/25 hover:bg-white/20 hover:border-white/30 ${
                      errors.placement 
                        ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400'
                        : 'focus:ring-2 focus:ring-gray-400 focus:border-white/40'
                    }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span className={`block truncate ${
                      !selectedPlacement && 'text-gray-500'
                    }`}>
                      {selectedPlacement ? selectedPlacement.label : 'Выберите плейсмент'}
                    </span>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        showPlacementDropdown ? 'transform rotate-180' : ''
                      }`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  
                  {showPlacementDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-10 rounded-2xl py-2 shadow-2xl border border-white/25"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.2) 0%, 
                            rgba(255, 255, 255, 0.1) 100%
                          )
                        `,
                        backdropFilter: 'blur(20px) saturate(180%)',
                        boxShadow: `
                          0 20px 40px rgba(0,0,0,0.1),
                          0 1px 0 rgba(255,255,255,0.2) inset
                        `,
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    >
                      {placementOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            handleInputChange('placement', option.value)
                            setShowPlacementDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-white/30 transition-all duration-200 text-gray-700 hover:text-gray-900 mx-1 rounded-lg font-normal"
                        >
                          <div>
                            <div className="font-normal">{option.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                {errors.placement && (
                  <p className="mt-1 text-sm text-red-500">{errors.placement}</p>
                )}
              </div>

              {/* Conditional Form Fields */}
              {selectedPlacement && (
                <AnimatePresence mode="wait">
                  {isBigFormat ? (
                    <motion.div
                      key="big-format"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      {/* Budget */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Бюджет *
                        </label>
                        <input
                          type="text"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.budget ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Введите бюджет"
                        />
                        {errors.budget && (
                          <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
                        )}
                      </div>

                      {/* Image from RuStore */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Изображение из RuStore
                        </label>
                        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50/50">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Изображения автоматически загружаются из RuStore
                          </p>
                          <p className="text-xs text-gray-500">
                            На основе выбранного плейсмента будет подобрано соответствующее изображение из каталога RuStore
                          </p>
                        </div>
                      </div>

                      {/* URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Введите ссылку *
                        </label>
                        <input
                          type="url"
                          value={formData.url}
                          onChange={(e) => handleInputChange('url', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.url ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="https://example.com"
                        />
                        {errors.url && (
                          <p className="mt-1 text-sm text-red-500">{errors.url}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          К ссылке автоматически будут добавлены макросы для отслеживания
                        </p>
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
                          className={`w-20 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.cpm ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0"
                        />
                        {errors.cpm && (
                          <p className="mt-1 text-sm text-red-500">{errors.cpm}</p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="small-format"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Название креатива *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          maxLength={16}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Название креатива"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Максимум 16 символов
                        </p>
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.budget ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Введите бюджет"
                        />
                        {errors.budget && (
                          <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Введите заголовок креатива *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          maxLength={16}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Где лучшие тусовки?..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Максимум 16 символов
                        </p>
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                        )}
                      </div>

                      {/* Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Введите текст креатива *
                        </label>
                        <textarea
                          value={formData.text}
                          onChange={(e) => handleInputChange('text', e.target.value)}
                          maxLength={32}
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none ${
                            errors.text ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Килограммы денег просто на чемоданы..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Максимум 32 символа
                        </p>
                        {errors.text && (
                          <p className="mt-1 text-sm text-red-500">{errors.text}</p>
                        )}
                      </div>

                      {/* URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Введите ссылку *
                        </label>
                        <input
                          type="url"
                          value={formData.url}
                          onChange={(e) => handleInputChange('url', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.url ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="https://runawaylube.com"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          К ссылке автоматически будут добавлены макросы для отслеживания
                        </p>
                        {errors.url && (
                          <p className="mt-1 text-sm text-red-500">{errors.url}</p>
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
                          className={`w-20 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                            errors.cpm ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0"
                        />
                        {errors.cpm && (
                          <p className="mt-1 text-sm text-red-500">{errors.cpm}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Preview Button */}
              {selectedPlacement && (
                <button
                  type="button"
                  onClick={handlePreview}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Предпросмотр
                </button>
              )}

              {/* Launch after save */}
              {selectedPlacement && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.launchAfterSave}
                    onChange={(e) => handleInputChange('launchAfterSave', e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded border-gray-300 focus:ring-slate-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Запуск после сохранения
                  </span>
                </label>
              )}
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
                disabled={!selectedPlacement}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
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

export default CreateCreativeForm