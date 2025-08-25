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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t('form.required_field')
    if (!formData.legalName.trim()) newErrors.legalName = t('form.required_field')
    if (!formData.inn.trim() || formData.inn.length !== 12) newErrors.inn = t('form.invalid_inn')
    if (!formData.kpp.trim() || formData.kpp.length !== 9) newErrors.kpp = t('form.invalid_kpp')
    if (!formData.ogrn.trim() || formData.ogrn.length !== 15) newErrors.ogrn = t('form.invalid_ogrn')
    if (!formData.legalAddress.trim()) newErrors.legalAddress = t('form.required_field')
    if (!formData.bik.trim() || formData.bik.length !== 9) newErrors.bik = t('form.invalid_bik')
    if (!formData.account.trim() || formData.account.length !== 20) newErrors.account = t('form.invalid_account')
    if (!formData.contractNumber.trim()) newErrors.contractNumber = t('form.required_field')
    if (!formData.contractDate.trim()) newErrors.contractDate = t('form.required_field')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      success(t('advertiser.created_successfully'))
      onClose()
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
    } else {
      error(t('form.validation_error'))
    }
  }

  const handleInputChange = (field: keyof AdvertiserFormData, value: string | boolean) => {
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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{t('advertiser.create_new')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Наименование рекламодателя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.advertiser_name')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('form.enter_advertiser_name')}
                maxLength={64}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Наименование юр лица */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.legal_name')} *
              </label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => handleInputChange('legalName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.legalName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('form.enter_legal_name')}
                maxLength={64}
              />
              {errors.legalName && <p className="text-red-500 text-sm mt-1">{errors.legalName}</p>}
            </div>

            {/* ИНН */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.inn')} *
              </label>
              <input
                type="text"
                value={formData.inn}
                onChange={(e) => handleInputChange('inn', e.target.value.replace(/\D/g, ''))}
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
                {t('form.kpp')} *
              </label>
              <input
                type="text"
                value={formData.kpp}
                onChange={(e) => handleInputChange('kpp', e.target.value.replace(/\D/g, ''))}
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
                {t('form.ogrn')} *
              </label>
              <input
                type="text"
                value={formData.ogrn}
                onChange={(e) => handleInputChange('ogrn', e.target.value.replace(/\D/g, ''))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.ogrn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456789012345"
                maxLength={15}
              />
              {errors.ogrn && <p className="text-red-500 text-sm mt-1">{errors.ogrn}</p>}
            </div>

            {/* БИК */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.bik')} *
              </label>
              <input
                type="text"
                value={formData.bik}
                onChange={(e) => handleInputChange('bik', e.target.value.replace(/\D/g, ''))}
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
                {t('form.account')} *
              </label>
              <input
                type="text"
                value={formData.account}
                onChange={(e) => handleInputChange('account', e.target.value.replace(/\D/g, ''))}
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
                {t('form.contract_number')} *
              </label>
              <input
                type="text"
                value={formData.contractNumber}
                onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                  errors.contractNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('form.enter_contract_number')}
                maxLength={20}
              />
              {errors.contractNumber && <p className="text-red-500 text-sm mt-1">{errors.contractNumber}</p>}
            </div>

            {/* Дата заключения договора */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.contract_date')} *
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
          </div>

          {/* Юридический адрес */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.legal_address')} *
            </label>
            <textarea
              value={formData.legalAddress}
              onChange={(e) => handleInputChange('legalAddress', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
                errors.legalAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('form.enter_legal_address')}
              rows={3}
              maxLength={500}
            />
            {errors.legalAddress && <p className="text-red-500 text-sm mt-1">{errors.legalAddress}</p>}
          </div>

          {/* Автомаркировка в ОРД */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoMarking"
              checked={formData.useAutoMarking}
              onChange={(e) => handleInputChange('useAutoMarking', e.target.checked)}
              className="w-5 h-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
            />
            <label htmlFor="autoMarking" className="text-sm font-medium text-gray-700">
              {t('form.use_auto_marking')}
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
      </motion.div>
    </div>
  )
}

export default CreateAdvertiserForm
