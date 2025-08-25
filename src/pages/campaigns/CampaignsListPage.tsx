import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit, Trash2, Play, Pause, Copy, Eye, TrendingUp, DollarSign, MousePointer } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateCampaignForm, EditCampaignForm } from '@components/forms'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'draft' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  cpm: number
  startDate: string
  endDate: string
}

const CampaignsListPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success } = useToast()
  const navigate = useNavigate()
  const { advertiserId } = useParams()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Летняя акция такси',
      status: 'active',
      budget: 50000,
      spent: 32400,
      impressions: 1250000,
      clicks: 18750,
      ctr: 1.5,
      cpm: 1.73,
      startDate: '2024-01-15',
      endDate: '2024-02-15'
    },
    {
      id: '2',
      name: 'Продвижение приложения',
      status: 'paused',
      budget: 75000,
      spent: 45600,
      impressions: 890000,
      clicks: 22250,
      ctr: 2.5,
      cpm: 2.05,
      startDate: '2024-01-10',
      endDate: '2024-02-28'
    },
    {
      id: '3',
      name: 'Новогодняя кампания',
      status: 'completed',
      budget: 120000,
      spent: 120000,
      impressions: 2100000,
      clicks: 84000,
      ctr: 4.0,
      cpm: 1.43,
      startDate: '2023-12-01',
      endDate: '2023-12-31'
    }
  ])

  const handleCreateCampaign = (data: any) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: data.name,
      status: data.status || 'draft',
      budget: parseInt(data.budget) || 0,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpm: 0,
      startDate: data.startDate,
      endDate: data.endDate
    }
    
    setCampaigns(prev => [newCampaign, ...prev])
  }

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту кампанию?')) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId))
    }
  }

  const handleEditCampaign = (data: any) => {
    if (!selectedCampaign) return
    
    const updatedCampaign: Campaign = {
      ...selectedCampaign,
      name: data.name,
      status: data.status,
      budget: parseInt(data.budget) || selectedCampaign.budget,
      startDate: data.startDate,
      endDate: data.endDate
    }
    
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === selectedCampaign.id ? updatedCampaign : campaign
    ))
    success('Кампания успешно обновлена')
    setSelectedCampaign(null)
    setShowEditForm(false)
  }

  const openEditForm = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setShowEditForm(true)
  }

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' as any }
        : campaign
    ))
  }

  const copyCampaign = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (копия)`,
      status: 'draft',
      spent: 0,
      impressions: 0,
      clicks: 0
    }
    
    setCampaigns(prev => [newCampaign, ...prev])
    success(t('campaign.copied_successfully'))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
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
            {t('nav.campaigns')}
          </h1>
          <p className="text-gray-600 font-light">
            {t('campaign.manage_campaigns')}
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 font-medium"
        >
          <Plus className="h-4 w-4" />
          {t('campaign.create_new')}
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
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">{t('metric.impressions')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {campaigns.reduce((sum, camp) => sum + camp.impressions, 0).toLocaleString()}
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-green-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <MousePointer className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">{t('metric.clicks')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {campaigns.reduce((sum, camp) => sum + camp.clicks, 0).toLocaleString()}
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
            <span className="text-sm text-gray-600">{t('metric.ctr')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {(campaigns.reduce((sum, camp) => sum + camp.ctr, 0) / campaigns.length).toFixed(1)}%
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-orange-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">{t('metric.spend')}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            ${campaigns.reduce((sum, camp) => sum + camp.spent, 0).toLocaleString()}
          </div>
        </motion.div>
      </div>

      {/* Campaigns List Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t('campaign.all_campaigns')}
        </h2>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        
        <div className="divide-y divide-gray-200">
          {campaigns.map((campaign) => {
            const StatusIcon = getStatusIcon(campaign.status)
            
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-slate-600 transition-colors cursor-pointer">
                          {campaign.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {campaign.startDate} - {campaign.endDate}
                        </p>
                      </div>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                        {t(`status.${campaign.status}`)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">{t('form.budget')}</p>
                        <p className="text-sm font-medium text-gray-900">${campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.spend')}</p>
                        <p className="text-sm font-medium text-gray-900">${campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.impressions')}</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.clicks')}</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.ctr')}</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('metric.cpm')}</p>
                        <p className="text-sm font-medium text-gray-900">${campaign.cpm}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => copyCampaign(campaign)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.duplicate')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditForm(campaign)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCampaign(campaign.id)
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        campaign.status === 'active' 
                          ? 'text-yellow-600 hover:bg-yellow-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={campaign.status === 'active' ? t('action.pause') : t('action.resume')}
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

      {/* Create Campaign Form */}
      <CreateCampaignForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateCampaign}
      />

      {/* Edit Campaign Form */}
      <EditCampaignForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setSelectedCampaign(null)
        }}
        onSubmit={handleEditCampaign}
        campaign={selectedCampaign}
      />
    </motion.div>
  )
}

export default CampaignsListPage