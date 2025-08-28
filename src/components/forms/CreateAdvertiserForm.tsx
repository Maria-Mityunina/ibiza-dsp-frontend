import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateAdvertiserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

interface AdvertiserFormData {
  name: string
  legalName: string
  inn: string
  kpp: string
  ogrn: string
  legalAddress: string
  bik: string
  account: string
  contractNumber: string
  contractDate: string
  useAutoMarking: boolean
}

const CreateAdvertiserForm: React.FC<CreateAdvertiserFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState<AdvertiserFormData>({
    name: '',
    legalName: '',
    inn: '',
    kpp: '',
    ogrn: '',
    legalAddress: '',
    bik: '',
    account: '',
    contractNumber: '',
    contractDate: '',
    useAutoMarking: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof AdvertiserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    if (!formData.name.trim()) newErrors.name = 'Поле обязательно для заполнения'
    else if (formData.name.length > 64) newErrors.name = 'Максимум 64 символа'

    if (!formData.legalName.trim()) newErrors.legalName = 'Поле обязательно для заполнения'
    else if (formData.legalName.length > 64) newErrors.legalName = 'Максимум 64 символа'

    if (!formData.inn.trim()) newErrors.inn = 'Поле обязательно для заполнения'
    else if (!/^\d{10}$|^\d{12}$/.test(formData.inn)) newErrors.inn = 'ИНН должен содержать 10 или 12 цифр'

    if (!formData.kpp.trim()) newErrors.kpp = 'Поле обязательно для заполнения'
    else if (!/^\d{9}$/.test(formData.kpp)) newErrors.kpp = 'КПП должен содержать 9 цифр'

    if (!formData.ogrn.trim()) newErrors.ogrn = 'Поле обязательно для заполнения'
    else if (!/^\d{13}$|^\d{15}$/.test(formData.ogrn)) newErrors.ogrn = 'ОГРН должен содержать 13 или 15 цифр'

    if (!formData.legalAddress.trim()) newErrors.legalAddress = 'Поле обязательно для заполнения'
    else if (formData.legalAddress.length > 500) newErrors.legalAddress = 'Максимум 500 символов'

    if (!formData.bik.trim()) newErrors.bik = 'Поле обязательно для заполнения'
    else if (!/^\d{9}$/.test(formData.bik)) newErrors.bik = 'БИК должен содержать 9 цифр'

    if (!formData.account.trim()) newErrors.account = 'Поле обязательно для заполнения'
    else if (!/^\d{20}$/.test(formData.account)) newErrors.account = 'Расчетный счет должен содержать 20 цифр'

    if (!formData.contractNumber.trim()) newErrors.contractNumber = 'Поле обязательно для заполнения'
    else if (formData.contractNumber.length > 20) newErrors.contractNumber = 'Максимум 20 символов'

    if (!formData.contractDate.trim()) newErrors.contractDate = 'Поле обязательно для заполнения'

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
    success('Рекламодатель создан успешно')
    onClose()
  }

  const formatInput = (field: string, value: string): string => {
    // Remove non-digits for numeric fields
    if (['inn', 'kpp', 'ogrn', 'bik', 'account'].includes(field)) {
      return value.replace(/\D/g, '')
    }
    return value
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
              Добавить рекламодателя
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Advertiser Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Наименование рекламодателя *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  maxLength={64}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите наименование рекламодателя"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Legal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Наименование юр лица *
                </label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  maxLength={64}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.legalName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите наименование юридического лица"
                />
                {errors.legalName && (
                  <p className="mt-1 text-sm text-red-500">{errors.legalName}</p>
                )}
              </div>

              {/* INN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ИНН *
                </label>
                <input
                  type="text"
                  value={formData.inn}
                  onChange={(e) => handleInputChange('inn', formatInput('inn', e.target.value))}
                  maxLength={12}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.inn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите ИНН (10 или 12 цифр)"
                />
                {errors.inn && (
                  <p className="mt-1 text-sm text-red-500">{errors.inn}</p>
                )}
              </div>

              {/* KPP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  КПП *
                </label>
                <input
                  type="text"
                  value={formData.kpp}
                  onChange={(e) => handleInputChange('kpp', formatInput('kpp', e.target.value))}
                  maxLength={9}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.kpp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите КПП (9 цифр)"
                />
                {errors.kpp && (
                  <p className="mt-1 text-sm text-red-500">{errors.kpp}</p>
                )}
              </div>

              {/* OGRN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ОГРН/ОГРНИП *
                </label>
                <input
                  type="text"
                  value={formData.ogrn}
                  onChange={(e) => handleInputChange('ogrn', formatInput('ogrn', e.target.value))}
                  maxLength={15}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.ogrn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите ОГРН/ОГРНИП (13 или 15 цифр)"
                />
                {errors.ogrn && (
                  <p className="mt-1 text-sm text-red-500">{errors.ogrn}</p>
                )}
              </div>

              {/* Legal Address */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Юридический адрес *
                </label>
                <textarea
                  value={formData.legalAddress}
                  onChange={(e) => handleInputChange('legalAddress', e.target.value)}
                  maxLength={500}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none ${
                    errors.legalAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите юридический адрес"
                />
                {errors.legalAddress && (
                  <p className="mt-1 text-sm text-red-500">{errors.legalAddress}</p>
                )}
              </div>

              {/* BIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  БИК *
                </label>
                <input
                  type="text"
                  value={formData.bik}
                  onChange={(e) => handleInputChange('bik', formatInput('bik', e.target.value))}
                  maxLength={9}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.bik ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите БИК (9 цифр)"
                />
                {errors.bik && (
                  <p className="mt-1 text-sm text-red-500">{errors.bik}</p>
                )}
              </div>

              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  р/с *
                </label>
                <input
                  type="text"
                  value={formData.account}
                  onChange={(e) => handleInputChange('account', formatInput('account', e.target.value))}
                  maxLength={20}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.account ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите расчетный счет (20 цифр)"
                />
                {errors.account && (
                  <p className="mt-1 text-sm text-red-500">{errors.account}</p>
                )}
              </div>

              {/* Contract Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер договора *
                </label>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                  maxLength={20}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.contractNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите номер договора"
                />
                {errors.contractNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.contractNumber}</p>
                )}
              </div>

              {/* Contract Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата заключения договора *
                </label>
                <input
                  type="date"
                  value={formData.contractDate}
                  onChange={(e) => handleInputChange('contractDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                    errors.contractDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contractDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.contractDate}</p>
                )}
              </div>

              {/* Auto Marking */}
              <div className="lg:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.useAutoMarking}
                    onChange={(e) => handleInputChange('useAutoMarking', e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded border-gray-300 focus:ring-slate-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Использовать автомаркировку в ОРД
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  При активации чекбокса данные о креативах будут автоматически отправляться в ОРД
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

export default CreateAdvertiserForm