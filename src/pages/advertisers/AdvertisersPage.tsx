import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Eye, Copy, TrendingUp, DollarSign, Users } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateAdvertiserForm } from '@components/forms'

interface Advertiser {
  id: string
  name: string
  legalName: string
  inn: string
  budget: number
  spent: number
  ctr: number
  campaigns: number
  status: 'active' | 'paused' | 'draft'
  createdAt: string
}

const AdvertisersPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success } = useToast()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([
    {
      id: '1',
      name: 'ООО "Технологии будущего"',
      legalName: 'Общество с ограниченной ответственностью "Технологии будущего"',
      inn: '123456789012',
      budget: 500000,
      spent: 125000,
      ctr: 2.45,
      campaigns: 5,
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'ИП Петров А.И.',
      legalName: 'Индивидуальный предприниматель Петров Андрей Иванович',
      inn: '123456789013',
      budget: 250000,
      spent: 89500,
      ctr: 1.87,
      campaigns: 3,
      status: 'active',
      createdAt: '2024-02-01T09:15:00Z'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700'
      case 'paused': return 'bg-yellow-100 text-yellow-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleCreateAdvertiser = (data: any) => {
    const newAdvertiser: Advertiser = {
      id: (advertisers.length + 1).toString(),
      name: data.name,
      legalName: data.legalName,
      inn: data.inn,
      budget: data.budget,
      spent: 0,
      ctr: 0,
      campaigns: 0,
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    
    setAdvertisers([...advertisers, newAdvertiser])
    setShowCreateForm(false)
    success('Рекламодатель создан успешно!')
  }

  const totalAdvertisers = advertisers.length
  const activeAdvertisers = advertisers.filter(a => a.status === 'active').length
  const totalBudget = advertisers.reduce((sum, a) => sum + a.budget, 0)
  const totalSpent = advertisers.reduce((sum, a) => sum + a.spent, 0)

  return (
    <motion.div 
      className="max-w-full overflow-x-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-light text-black mb-2">
            {t('nav.advertisers')}
          </h1>
          <p className="text-gray-600 font-light">
            {t('advertiser.manage_advertisers')}
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 font-medium"
        >
          <Plus className="h-4 w-4" />
          {t('advertiser.create_new')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-blue-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">{t('metric.impressions')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {totalAdvertisers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {activeAdvertisers} {t('status.active').toLowerCase()}
          </div>
        </motion.div>

        <motion.div 
          className="bg-green-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">{t('metric.budget')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {formatCurrency(totalBudget)}
          </div>
        </motion.div>

        <motion.div 
          className="bg-purple-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">{t('metric.spend')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {formatCurrency(totalSpent)}
          </div>
        </motion.div>

        <motion.div 
          className="bg-orange-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">{t('metric.ctr')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {((totalSpent / totalBudget) * 100 || 0).toFixed(1)}%
          </div>
        </motion.div>
      </div>

      {/* Advertisers List Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t('advertiser.all_advertisers')}
        </h2>
      </div>

      {/* Advertisers List */}
      <div className="space-y-4">
        {advertisers.map((advertiser, index) => (
          <motion.div
            key={advertiser.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {advertiser.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(advertiser.status)}`}>
                    {t(`status.${advertiser.status}`)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {advertiser.legalName} • ИНН: {advertiser.inn}
                </p>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t('form.budget')}:</span>
                    <span className="text-sm font-medium">{formatCurrency(advertiser.budget)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t('metric.spend')}:</span>
                    <span className="text-sm font-medium">{formatCurrency(advertiser.spent)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t('metric.ctr')}:</span>
                    <span className="text-sm font-medium">{advertiser.ctr}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t('metric.cpm')}:</span>
                    <span className="text-sm font-medium">{advertiser.campaigns}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => success('Рекламодатель скопирован')}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  title={t('action.copy')}
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  title={t('action.edit')}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  title={t('advertiser.view_campaigns')}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {advertiser.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(advertiser.status)}`}>
                    {t(`status.${advertiser.status}`)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => success('Рекламодатель скопирован')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                ИНН: {advertiser.inn}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 block">{t('form.budget')}</span>
                  <span className="text-sm font-medium">{formatCurrency(advertiser.budget)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{t('metric.spend')}</span>
                  <span className="text-sm font-medium">{formatCurrency(advertiser.spent)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{t('metric.ctr')}</span>
                  <span className="text-sm font-medium">{advertiser.ctr}%</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Кампаний</span>
                  <span className="text-sm font-medium">{advertiser.campaigns}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {advertisers.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет рекламодателей
          </h3>
          <p className="text-gray-500 mb-6">
            Создайте первого рекламодателя для начала работы
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 font-medium"
          >
            <Plus className="h-4 w-4" />
            {t('advertiser.create_new')}
          </button>
        </motion.div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CreateAdvertiserForm
              onSubmit={handleCreateAdvertiser}
              onClose={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AdvertisersPage