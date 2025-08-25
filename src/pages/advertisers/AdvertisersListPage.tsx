import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, TrendingUp, DollarSign, Eye, Users } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateAdvertiserForm } from '@components/forms'

interface Advertiser {
  id: string
  name: string
  legalName: string
  budget: number
  spent: number
  ctr: number
  campaigns: number
  status: 'active' | 'inactive' | 'pending'
}

const AdvertisersListPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success } = useToast()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([
    {
      id: '1',
      name: 'ООО Зеленоглазое такси',
      legalName: 'ООО "Зеленоглазое такси"',
      budget: 100000,
      spent: 45600,
      ctr: 2.4,
      campaigns: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'ТехноМарт',
      legalName: 'ООО "ТехноМарт"',
      budget: 250000,
      spent: 123400,
      ctr: 3.1,
      campaigns: 8,
      status: 'active'
    },
    {
      id: '3',
      name: 'Быстрая доставка',
      legalName: 'ИП Петров А.В.',
      budget: 50000,
      spent: 12300,
      ctr: 1.8,
      campaigns: 3,
      status: 'pending'
    }
  ])

  const handleCreateAdvertiser = (data: any) => {
    const newAdvertiser: Advertiser = {
      id: Date.now().toString(),
      name: data.name,
      legalName: data.legalName,
      budget: parseInt(data.budget) || 0,
      spent: 0,
      ctr: 0,
      campaigns: 0,
      status: 'pending'
    }
    
    setAdvertisers(prev => [newAdvertiser, ...prev])
    success(t('advertiser.created_successfully'))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.advertisers')}</h1>
          <p className="text-gray-600 mt-1">{t('advertiser.manage_advertisers')}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t('advertiser.create_new')}</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('advertiser.total_advertisers')}</p>
              <p className="text-2xl font-bold text-gray-900">{advertisers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('advertiser.total_budget')}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${advertisers.reduce((sum, adv) => sum + adv.budget, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('advertiser.total_spent')}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${advertisers.reduce((sum, adv) => sum + adv.spent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('advertiser.avg_ctr')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {(advertisers.reduce((sum, adv) => sum + adv.ctr, 0) / advertisers.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advertisers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('advertiser.all_advertisers')}</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {advertisers.map((advertiser) => (
            <motion.div
              key={advertiser.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {/* Navigate to campaigns */}}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-slate-600 transition-colors">
                        {advertiser.name}
                      </h3>
                      <p className="text-sm text-gray-500">{advertiser.legalName}</p>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(advertiser.status)}`}>
                      {t(`status.${advertiser.status}`)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">{t('form.budget')}</p>
                      <p className="text-sm font-medium text-gray-900">${advertiser.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('advertiser.spent')}</p>
                      <p className="text-sm font-medium text-gray-900">${advertiser.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CTR</p>
                      <p className="text-sm font-medium text-gray-900">{advertiser.ctr}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('advertiser.campaigns')}</p>
                      <p className="text-sm font-medium text-gray-900">{advertiser.campaigns}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle edit
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Advertiser Form */}
      <CreateAdvertiserForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateAdvertiser}
      />
    </div>
  )
}

export default AdvertisersListPage
