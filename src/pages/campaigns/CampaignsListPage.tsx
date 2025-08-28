import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit, Trash2, Copy, Eye, TrendingUp, DollarSign, MousePointer } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateCampaignForm, EditCampaignForm } from '@components/forms'
import { StatusControl, BudgetControl } from '@components/ui'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'draft' | 'completed' | 'pending' | 'stopped' | 'rejected'
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

  const handleStatusChange = (id: string, newStatus: 'active' | 'paused' | 'stopped') => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: newStatus }
        : campaign
    ))
    
    const statusMessages = {
      active: 'Кампания запущена',
      paused: 'Кампания приостановлена', 
      stopped: 'Кампания остановлена'
    }
    
    success(statusMessages[newStatus])
  }

  const handleBudgetChange = (id: string, newBudget: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? { ...campaign, budget: newBudget }
        : campaign
    ))
    
    success(`Бюджет кампании обновлен: $${newBudget.toLocaleString()}`)
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



      {/* Campaigns List Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t('campaign.all_campaigns')}
        </h2>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg hover:bg-white/25 transition-all duration-300"
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
                      
                      <StatusControl
                        status={campaign.status}
                        onStatusChange={(newStatus) => handleStatusChange(campaign.id, newStatus)}
                        size="sm"
                        showLabel={true}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">{t('form.budget')}</p>
                        <BudgetControl
                          budget={campaign.budget}
                          spent={campaign.spent}
                          onBudgetChange={(newBudget) => handleBudgetChange(campaign.id, newBudget)}
                          size="sm"
                          showProgress={true}
                          warningThreshold={85}
                        />
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
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200"
                      title={t('action.duplicate')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditForm(campaign)
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200"
                      title={t('action.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCampaign(campaign.id)
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
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