import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'

interface CreateAdvertiserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AdvertiserFormData) => void
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

    if (!formData.name.trim()) newErrors.name = t('form.required_field')
    if (!formData.legalName.trim()) newErrors.legalName = t('form.required_field')
    if (!formData.inn.trim()) newErrors.inn = t('form.required_field')
    else if (!/^\d{12}$/.test(formData.inn)) newErrors.inn = t('form.invalid_inn')
    
    if (!formData.kpp.trim()) newErrors.kpp = t('form.required_field')
    else if (!/^\d{9}$/.test(formData.kpp)) newErrors.kpp = t('form.invalid_kpp')
    
    if (!formData.ogrn.trim()) newErrors.ogrn = t('form.required_field')
    else if (!/^\d{15}$/.test(formData.ogrn)) newErrors.ogrn = t('form.invalid_ogrn')
    
    if (!formData.legalAddress.trim()) newErrors.legalAddress = t('form.required_field')
    if (!formData.bik.trim()) newErrors.bik = t('form.required_field')
    else if (!/^\d{9}$/.test(formData.bik)) newErrors.bik = t('form.invalid_bik')
    
    if (!formData.account.trim()) newErrors.account = t('form.required_field')
    else if (!/^\d{20}$/.test(formData.account)) newErrors.account = t('form.invalid_account')
    
    if (!formData.contractNumber.trim()) newErrors.contractNumber = t('form.required_field')
    if (!formData.contractDate.trim()) newErrors.contractDate = t('form.required_field')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      error(t('form.validation_error'))
      return
    }

    onSubmit(formData)
    success('Рекламодатель успешно создан')
    onClose()
    
    // Reset form
    setFormData({
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
          <h2 className="text-2xl font-bold text-gray-900">Создать рекламодателя</h2>
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
            {/* Наименование рекламодателя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Наименование рекламодателя *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите наименование рекламодателя"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Наименование юр лица */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Наименование юр лица *
              </label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => handleInputChange('legalName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.legalName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите наименование юр лица"
              />
              {errors.legalName && <p className="text-red-500 text-sm mt-1">{errors.legalName}</p>}
            </div>

            {/* ИНН */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ИНН *
              </label>
              <input
                type="text"
                value={formData.inn}
                onChange={(e) => handleInputChange('inn', e.target.value.replace(/\D/g, '').slice(0, 12))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.inn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456789012"
                maxLength={12}
              />
              {errors.inn && <p className="text-red-500 text-sm mt-1">{errors.inn}</p>}
            </div>

            {/* КПП */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                КПП *
              </label>
              <input
                type="text"
                value={formData.kpp}
                onChange={(e) => handleInputChange('kpp', e.target.value.replace(/\D/g, '').slice(0, 9))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.kpp ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456789"
                maxLength={9}
              />
              {errors.kpp && <p className="text-red-500 text-sm mt-1">{errors.kpp}</p>}
            </div>

            {/* ОГРН/ОГРНИП */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ОГРН/ОГРНИП *
              </label>
              <input
                type="text"
                value={formData.ogrn}
                onChange={(e) => handleInputChange('ogrn', e.target.value.replace(/\D/g, '').slice(0, 15))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.ogrn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456789012345"
                maxLength={15}
              />
              {errors.ogrn && <p className="text-red-500 text-sm mt-1">{errors.ogrn}</p>}
            </div>

            {/* Юридический адрес */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Юридический адрес *
              </label>
              <textarea
                value={formData.legalAddress}
                onChange={(e) => handleInputChange('legalAddress', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.legalAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите юридический адрес"
                rows={3}
              />
              {errors.legalAddress && <p className="text-red-500 text-sm mt-1">{errors.legalAddress}</p>}
            </div>

            {/* БИК */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                БИК *
              </label>
              <input
                type="text"
                value={formData.bik}
                onChange={(e) => handleInputChange('bik', e.target.value.replace(/\D/g, '').slice(0, 9))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.bik ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456789"
                maxLength={9}
              />
              {errors.bik && <p className="text-red-500 text-sm mt-1">{errors.bik}</p>}
            </div>

            {/* р/с */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                р/с *
              </label>
              <input
                type="text"
                value={formData.account}
                onChange={(e) => handleInputChange('account', e.target.value.replace(/\D/g, '').slice(0, 20))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.account ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="12345678901234567890"
                maxLength={20}
              />
              {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account}</p>}
            </div>

            {/* Номер договора */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер договора *
              </label>
              <input
                type="text"
                value={formData.contractNumber}
                onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.contractNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите номер договора"
              />
              {errors.contractNumber && <p className="text-red-500 text-sm mt-1">{errors.contractNumber}</p>}
            </div>

            {/* Дата заключения договора */}
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
              {errors.contractDate && <p className="text-red-500 text-sm mt-1">{errors.contractDate}</p>}
            </div>

            {/* Использовать автомаркировку */}
            <div className="lg:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useAutoMarking}
                  onChange={(e) => handleInputChange('useAutoMarking', e.target.checked)}
                  className="w-5 h-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                />
                <span className="text-gray-700">Использовать автомаркировку в ОРД</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateAdvertiserForm