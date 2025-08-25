import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Play, Pause, Copy, Eye, TrendingUp, DollarSign, MousePointer, Target } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateAdGroupForm } from '@components/forms'

interface AdGroup {
  id: string
  name: string
  status: 'active' | 'paused' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  cpm: number
  targeting: string
}

const AdGroupsListPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success } = useToast()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [adGroups, setAdGroups] = useState<AdGroup[]>([
    {
      id: '1',
      name: 'Москва 18-35',
      status: 'active',
      budget: 25000,
      spent: 18400,
      impressions: 650000,
      clicks: 9750,
      ctr: 1.5,
      cpm: 1.89,
      targeting: 'Москва, 18-35, iOS'
    },
    {
      id: '2',
      name: 'СПб мужчины',
      status: 'paused',
      budget: 15000,
      spent: 8600,
      impressions: 320000,
      clicks: 6400,
      ctr: 2.0,
      cpm: 1.34,
      targeting: 'СПб, мужчины, Android'
    },
    {
      id: '3',
      name: 'Регионы премиум',
      status: 'active',
      budget: 35000,
      spent: 22100,
      impressions: 890000,
      clicks: 26700,
      ctr: 3.0,
      cpm: 0.83,
      targeting: 'Регионы, высокий доход'
    }
  ])

  const handleCreateAdGroup = (data: any) => {
    const newAdGroup: AdGroup = {
      id: Date.now().toString(),
      name: data.name,
      status: 'draft',
      budget: parseInt(data.budget) || 0,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpm: 0,
      targeting: `${data.region || ''}, ${data.phoneModel || ''}, ${data.language || ''}`.replace(/^,\s*|,\s*$/g, '')
    }
    
    setAdGroups(prev => [newAdGroup, ...prev])
  }

  const toggleAdGroupStatus = (id: string) => {
    setAdGroups(prev => prev.map(adGroup => 
      adGroup.id === id 
        ? { ...adGroup, status: adGroup.status === 'active' ? 'paused' : 'active' as any }
        : adGroup
    ))
  }

  const copyAdGroup = (adGroup: AdGroup) => {
    const newAdGroup: AdGroup = {
      ...adGroup,
      id: Date.now().toString(),
      name: `${adGroup.name} (копия)`,
      status: 'draft',
      spent: 0,
      impressions: 0,
      clicks: 0
    }
    
    setAdGroups(prev => [newAdGroup, ...prev])
    success(t('adgroup.copied_successfully'))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'active' ? Pause : Play
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.adgroups')}</h1>
          <p className="text-gray-600 mt-1">{t('adgroup.manage_adgroups')}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t('adgroup.create_new')}</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('adgroup.total_groups')}</p>
              <p className="text-2xl font-bold text-gray-900">{adGroups.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('metric.clicks')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {adGroups.reduce((sum, group) => sum + group.clicks, 0).toLocaleString()}
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
              <p className="text-sm text-gray-600">{t('metric.ctr')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {(adGroups.reduce((sum, group) => sum + group.ctr, 0) / adGroups.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('metric.spend')}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${adGroups.reduce((sum, group) => sum + group.spent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Groups List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('adgroup.all_adgroups')}</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {adGroups.map((adGroup) => {
            const StatusIcon = getStatusIcon(adGroup.status)
            
            return (
              <motion.div
                key={adGroup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-slate-600 transition-colors cursor-pointer">
                          {adGroup.name}
                        </h3>
                        <p className="text-sm text-gray-500">{adGroup.targeting}</p>
                      </div>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(adGroup.status)}`}>
                        {t(`status.${adGroup.status}`)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">{t('form.budget')}</p>
                        <p className="text-sm font-medium text-gray-900">${adGroup.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.spend')}</p>
                        <p className="text-sm font-medium text-gray-900">${adGroup.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.impressions')}</p>
                        <p className="text-sm font-medium text-gray-900">{adGroup.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.clicks')}</p>
                        <p className="text-sm font-medium text-gray-900">{adGroup.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.ctr')}</p>
                        <p className="text-sm font-medium text-gray-900">{adGroup.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.cpm')}</p>
                        <p className="text-sm font-medium text-gray-900">${adGroup.cpm}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => copyAdGroup(adGroup)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.duplicate')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => {/* Handle edit */}}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => toggleAdGroupStatus(adGroup.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        adGroup.status === 'active' 
                          ? 'text-yellow-600 hover:bg-yellow-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={adGroup.status === 'active' ? t('action.pause') : t('action.resume')}
                    >
                      <StatusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Create Ad Group Form */}
      <CreateAdGroupForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateAdGroup}
      />
    </div>
  )
}

export default AdGroupsListPage