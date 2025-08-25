import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit, Trash2, Play, Pause, Copy, Eye, TrendingUp, DollarSign, MousePointer, Target } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateAdGroupForm, EditAdGroupForm } from '@components/forms'

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
  const navigate = useNavigate()
  const { advertiserId, campaignId } = useParams()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedAdGroup, setSelectedAdGroup] = useState<AdGroup | null>(null)
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

  const handleDeleteAdGroup = (adGroupId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу объявлений?')) {
      setAdGroups(prev => prev.filter(adGroup => adGroup.id !== adGroupId))
    }
  }

  const handleEditAdGroup = (data: any) => {
    if (!selectedAdGroup) return
    
    const updatedAdGroup: AdGroup = {
      ...selectedAdGroup,
      name: data.name,
      budget: parseInt(data.budget) || selectedAdGroup.budget,
      targeting: `${data.region || ''}, ${data.phoneModel || ''}, ${data.language || ''}`.replace(/^,\s*|,\s*$/g, '')
    }
    
    setAdGroups(prev => prev.map(adGroup => 
      adGroup.id === selectedAdGroup.id ? updatedAdGroup : adGroup
    ))
    success('Группа объявлений успешно обновлена')
    setSelectedAdGroup(null)
    setShowEditForm(false)
  }

  const openEditForm = (adGroup: AdGroup) => {
    setSelectedAdGroup(adGroup)
    setShowEditForm(true)
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
            {t('nav.adgroups')}
          </h1>
          <p className="text-gray-600 font-light">
            Управление группами объявлений
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 font-medium"
        >
          <Plus className="h-4 w-4" />
          Создать группу объявлений
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
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Всего групп</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {adGroups.length}
          </div>
        </motion.div>
        
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
        
        <motion.div 
          className="bg-orange-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">Потрачено</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            ${adGroups.reduce((sum, group) => sum + group.spent, 0).toLocaleString()}
          </div>
        </motion.div>
      </div>

      {/* Ad Groups List Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Все группы объявлений
        </h2>
      </div>

      {/* Ad Groups List */}
      <div className="space-y-4">
        
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
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditForm(adGroup)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteAdGroup(adGroup.id)
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
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

      {/* Edit Ad Group Form */}
      <EditAdGroupForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setSelectedAdGroup(null)
        }}
        onSubmit={handleEditAdGroup}
        adGroup={selectedAdGroup}
      />
    </motion.div>
  )
}

export default AdGroupsListPage