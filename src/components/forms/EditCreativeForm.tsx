import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface EditCreativeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreativeFormData) => void
  creative?: CreativeFormData & { id: string }
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
  imageUrl?: string
  launchAfterSave: boolean
}

const EditCreativeForm: React.FC<EditCreativeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  creative
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
      type: 'small'
    },
    { 
      value: '16_small', 
      label: 'Компактный 300x100',
      type: 'small'
    },
    { 
      value: '2_small', 
      label: 'Узкий баннер 728x90',
      type: 'small'
    },
    { 
      value: '1_big', 
      label: 'Большой баннер 1200x675',
      type: 'big'
    },
    { 
      value: '8_big', 
      label: 'Прямоугольный 600x500',
      type: 'big'
    },
    { 
      value: '12_big', 
      label: 'Квадратный 400x400',
      type: 'big'
    }
  ]

  // Заполняем форму данными креатива при открытии
  useEffect(() => {
    if (creative && isOpen) {
      setFormData({
        placement: creative.placement || '6_small',
        name: creative.name || '',
        budget: creative.budget || '',
        title: creative.title || '',
        text: creative.text || '',
        link: creative.link || '',
        cpm: creative.cpm || '',
        launchAfterSave: creative.launchAfterSave || false
      })
      
      // Установить превью изображения, если есть
      if (creative.imageUrl) {
        setImagePreview(creative.imageUrl)
      }
    }
  }, [creative, isOpen])

  const selectedPlacement = placementOptions.find(p => p.value === formData.placement)
  const isSmallFormat = selectedPlacement?.type === 'small'
  const isBigFormat = selectedPlacement?.type === 'big'

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.placement) newErrors.placement = 'Поле обязательно для заполнения'
    
    if (!formData.name.trim()) newErrors.name = 'Поле обязательно для заполнения'
    else if (formData.name.length > 64) newErrors.name = 'Максимум 64 символа'
    
    if (!formData.budget.trim()) newErrors.budget = 'Поле обязательно для заполнения'
    else if (!/^\d+$/.test(formData.budget)) newErrors.budget = 'Только цифры'
    else if (formData.budget.length > 7) newErrors.budget = 'Максимум 7 цифр'
    
    if (!formData.link.trim()) newErrors.link = 'Поле обязательно для заполнения'
    else if (formData.link.length > 500) newErrors.link = 'Максимум 500 символов'
    
    if (!formData.cpm.trim()) newErrors.cpm = 'Поле обязательно для заполнения'
    else if (!/^\d+$/.test(formData.cpm)) newErrors.cpm = 'Только цифры'
    else if (formData.cpm.length > 4) newErrors.cpm = 'Максимум 4 цифры'
    
    if (isSmallFormat) {
      if (!formData.title.trim()) newErrors.title = 'Поле обязательно для заполнения'
      else if (formData.title.length > 16) newErrors.title = 'Максимум 16 символов'
      
      if (!formData.text.trim()) newErrors.text = 'Поле обязательно для заполнения'
      else if (formData.text.length > 32) newErrors.text = 'Максимум 32 символа'
    }

    if (isBigFormat && !formData.image && !imagePreview) {
      newErrors.image = 'Поле обязательно для заполнения'
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
    success('Креатив успешно обновлен')
    onClose()
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
        error('Неподдерживаемый формат изображения')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        error('Размер файла не должен превышать 5MB')
        return
      }

      setFormData(prev => ({ ...prev, image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }))
      }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex"
      >
        <div className="flex-1 flex flex-col">
          {/* Simple Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Редактировать креатив</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
                    Введите заголовок креатива * ({formData.title.length}/16)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value.slice(0, 16))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Заголовок креатива"
                    maxLength={16}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Текст креатива */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Введите текст креатива * ({formData.text.length}/32)
                  </label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => handleInputChange('text', e.target.value.slice(0, 32))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none ${
                      errors.text ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Текст креатива"
                    rows={3}
                    maxLength={32}
                  />
                  {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
                </div>
              </>
            )}

            {isBigFormat && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Изображение *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto max-h-40 rounded-lg cursor-pointer"
                        onClick={handleImageClick}
                      />
                      <p className="text-sm text-gray-500">
                        Нажмите на изображение, чтобы изменить
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer" 
                      onClick={handleImageClick}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">⬇</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Перетащите сюда изображение для загрузки или нажмите на кнопку чтобы выбрать в проводнике
                      </p>
                      <p className="text-xs text-gray-500">
                        Размеры креативов 1200x675, 1080x608, 600x324 пикселей
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>
            )}

            {/* Ссылка */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Введите ссылку *
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.link ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://runawayclub.com"
                maxLength={500}
              />
              {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
            </div>

            {/* CPM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPM *
              </label>
              <input
                type="text"
                value={formData.cpm}
                onChange={(e) => handleInputChange('cpm', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.cpm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100"
                maxLength={4}
              />
              {errors.cpm && <p className="text-red-500 text-sm mt-1">{errors.cpm}</p>}
            </div>

            {/* Предпросмотр */}
            <div>
              <button
                type="button"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Предпросмотр
              </button>
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
                Запуск после сохранения
              </label>
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
        </div>
      </motion.div>
    </div>
  )
}

export default EditCreativeForm
