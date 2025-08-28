import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Upload, AlertCircle } from 'lucide-react'
import { useToast } from '@hooks/useToast'
import { Status } from '@types/common'
import { STATUS_LABELS } from '@constants/formats'

interface Segment {
  id: string
  name: string
  description: string
  size: number
  status: Status
  type: 'uploaded' | 'custom'
  createdAt: string
  lastUsed?: string
}

interface EditSegmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Segment>) => void
  segment: Segment | null
}

const EditSegmentForm: React.FC<EditSegmentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  segment
}) => {
  const { error } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as Status,
    type: 'custom' as 'uploaded' | 'custom'
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Заполнение формы данными сегмента при редактировании
  useEffect(() => {
    if (segment) {
      setFormData({
        name: segment.name || '',
        description: segment.description || '',
        status: segment.status || 'active',
        type: segment.type || 'custom'
      })
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        type: 'custom'
      })
    }
    setErrors({})
  }, [segment, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Название сегмента обязательно'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Название должно содержать минимум 3 символа'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Название не должно превышать 100 символов'
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Описание сегмента обязательно'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      error('Пожалуйста, исправьте ошибки в форме')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      error('Ошибка при сохранении сегмента')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
      type: 'custom'
    })
    setErrors({})
    onClose()
  }

  const statusOptions = [
    { value: 'draft', label: STATUS_LABELS.draft },
    { value: 'pending', label: STATUS_LABELS.pending },
    { value: 'active', label: STATUS_LABELS.active },
    { value: 'paused', label: STATUS_LABELS.paused },
    { value: 'rejected', label: STATUS_LABELS.rejected },
    { value: 'completed', label: STATUS_LABELS.completed }
  ]

  const typeOptions = [
    { value: 'custom', label: 'Созданный' },
    { value: 'uploaded', label: 'Загруженный' }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl mx-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 
                  className="text-xl font-medium text-gray-900"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {segment ? 'Редактировать сегмент' : 'Создать сегмент'}
                </h2>
                <p 
                  className="text-sm text-gray-600 mt-1 font-normal"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {segment ? 'Изменение параметров сегмента' : 'Создание нового сегмента аудитории'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {/* Название */}
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Название сегмента *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`glass-input ${errors.name ? 'error' : ''}`}
                placeholder="Введите название сегмента"
                maxLength={100}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Описание */}
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Описание сегмента *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`glass-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Опишите характеристики сегмента"
                rows={4}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 символов
              </p>
            </div>

            {/* Статус и Тип */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Статус */}
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="glass-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Тип */}
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Тип сегмента
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="glass-select"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Информация о сегменте */}
            {segment && (
              <div className="bg-gray-50/50 border border-gray-200/50 rounded-2xl p-4">
                <h4 
                  className="text-sm font-medium text-gray-700 mb-3"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Информация о сегменте
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Размер аудитории:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Intl.NumberFormat('ru-RU').format(segment.size)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Дата создания:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(segment.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {segment.lastUsed && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Последнее использование:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(segment.lastUsed).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-100/50 bg-gray-50/30">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-normal text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Отменить
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors font-normal text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {segment ? 'Сохранить изменения' : 'Создать сегмент'}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EditSegmentForm

