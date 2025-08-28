import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Copy, Edit, Trash2, TrendingUp, Eye, BarChart3, Search, Filter } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { StatusControl, BudgetControl, DataTable, Pagination, SearchFilters, ActionButton } from '@components/ui'
import { PageHeader } from '@components/layout'
import { CreateCampaignForm } from '@components/forms'

interface Campaign {
  id: string
  name: string
  advertiserId: string
  budget: number
  spent: number
  cpm: number
  impressions: number
  clicks: number
  ctr: number
  status: 'active' | 'paused' | 'draft' | 'completed' | 'pending' | 'stopped' | 'rejected'
  createdAt: string
}

// Mock data for demonstration
const mockAdvertiser = {
  id: '1',
  name: 'ООО Зеленоглазое такси',
  budget: 1000
}

const CampaignsPage: React.FC = () => {
  const { advertiserId } = useParams<{ advertiserId: string }>()
  const { t } = useLanguageStore()
  const { success } = useToast()
  const navigate = useNavigate()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'РК 1',
      advertiserId: advertiserId || '1',
      budget: 100,
      spent: 45,
      cpm: 2,
      impressions: 2000,
      clicks: 60,
      ctr: 3,
      status: 'paused',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2', 
      name: 'РК 2',
      advertiserId: advertiserId || '1',
      budget: 0,
      spent: 100,
      cpm: 2,
      impressions: 50000,
      clicks: 1500,
      ctr: 3,
      status: 'stopped',
      createdAt: '2024-02-01T09:15:00Z'
    },
    {
      id: '3',
      name: 'РК 3',
      advertiserId: advertiserId || '1', 
      budget: 100,
      spent: 45,
      cpm: 2,
      impressions: 2000,
      clicks: 60,
      ctr: 3,
      status: 'paused',
      createdAt: '2024-03-01T08:30:00Z'
    },
    {
      id: '4',
      name: 'РК 4',
      advertiserId: advertiserId || '1',
      budget: 100,
      spent: 45,
      cpm: 2,
      impressions: 2000,
      clicks: 60,
      ctr: 3,
      status: 'paused',
      createdAt: '2024-04-01T12:00:00Z'
    },
    {
      id: '5',
      name: '',
      advertiserId: advertiserId || '1',
      budget: 100,
      spent: 45,
      cpm: 2,
      impressions: 50000,
      clicks: 1500,
      ctr: 3,
      status: 'stopped',
      createdAt: '2024-05-01T14:20:00Z'
    },
    {
      id: '6',
      name: 'РК 6',
      advertiserId: advertiserId || '1',
      budget: 100,
      spent: 45,
      cpm: 2,
      impressions: 2000,
      clicks: 60,
      ctr: 3,
      status: 'paused',
      createdAt: '2024-06-01T16:45:00Z'
    },
    // Дополнительные кампании для демонстрации пагинации
    ...Array.from({ length: 150 }, (_, i) => ({
      id: `${i + 7}`,
      name: `РК ${i + 7}`,
      advertiserId: advertiserId || '1',
      budget: Math.floor(Math.random() * 1000) + 100,
      spent: Math.floor(Math.random() * 500) + 10,
      cpm: Math.floor(Math.random() * 10) + 1,
      impressions: Math.floor(Math.random() * 100000) + 1000,
      clicks: Math.floor(Math.random() * 5000) + 50,
      ctr: Math.floor(Math.random() * 10) + 1,
      status: ['active', 'paused', 'draft', 'completed', 'pending'][Math.floor(Math.random() * 5)] as any,
      createdAt: `2024-0${Math.floor(Math.random() * 12) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`
    }))
  ])

  // Filtered and paginated data
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [campaigns, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateCampaign = (data: any) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: data.name,
      advertiserId: advertiserId || '1',
      budget: parseInt(data.budget) || 0,
      spent: 0,
      cpm: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      status: data.status || 'draft',
      createdAt: new Date().toISOString()
    }

    setCampaigns(prev => [newCampaign, ...prev])
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
  }

  const handleCopyCampaign = (campaignId: string) => {
    const originalCampaign = campaigns.find(c => c.id === campaignId)
    if (!originalCampaign) return

    // Find the highest copy number for this campaign
    const baseName = originalCampaign.name.replace(/ \d+$/, '')
    const copyNumbers = campaigns
      .filter(c => c.name.startsWith(baseName))
      .map(c => {
        const match = c.name.match(/ (\d+)$/)
        return match ? parseInt(match[1]) : 0
      })
    
    const nextNumber = Math.max(0, ...copyNumbers) + 1
    const newName = `${baseName} ${nextNumber}`

    const newCampaign: Campaign = {
      ...originalCampaign,
      id: Date.now().toString(),
      name: newName,
      spent: 0
    }

    setCampaigns(prev => [newCampaign, ...prev])
    success('Кампания скопирована')
  }

  const handleDeleteCampaign = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить кампанию "${name}"?`)) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id))
      success('Кампания успешно удалена')
    }
  }

  const formatCurrency = (value: number) => `${value}$`

  const columns = [
    {
      key: 'actions',
      title: 'Название',
      priority: 'high' as const,
      render: (value: any, campaign: Campaign) => (
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCopyCampaign(campaign.id)
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Копировать"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/advertisers/${advertiserId}/campaigns/${campaign.id}/edit`)
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Редактировать"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteCampaign(campaign.id, campaign.name)
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => navigate(`/advertisers/${advertiserId}/campaigns/${campaign.id}/adgroups`)}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors text-left block truncate w-full"
            >
              {campaign.name || 'Без названия'}
            </button>
          </div>
        </div>
      ),
      width: 'w-1/2'
    },
    {
      key: 'status',
      title: 'Статус',
      priority: 'high' as const,
      render: (value: any, campaign: Campaign) => (
        <StatusControl
          status={campaign.status}
          onStatusChange={(newStatus) => handleStatusChange(campaign.id, newStatus)}
          size="sm"
        />
      ),
      width: 'w-32'
    },
    {
      key: 'budget',
      title: 'Бюджет',
      priority: 'high' as const,
      render: (value: any, campaign: Campaign) => (
        <BudgetControl
          budget={campaign.budget}
          spent={campaign.spent}
          onBudgetChange={(newBudget) => handleBudgetChange(campaign.id, newBudget)}
          size="sm"
          showProgress={false}
        />
      ),
      width: 'w-32'
    },
    {
      key: 'cpm',
      title: 'CPM',
      priority: 'medium' as const,
      render: (value: any, campaign: Campaign) => `${campaign.cpm}$`,
      width: 'w-20'
    },
    {
      key: 'impressions',
      title: 'Показы',
      priority: 'medium' as const,
      render: (value: any, campaign: Campaign) => campaign.impressions.toLocaleString(),
      width: 'w-24'
    },
    {
      key: 'clicks',
      title: 'Переходы',
      priority: 'low' as const,
      render: (value: any, campaign: Campaign) => campaign.clicks.toLocaleString(),
      width: 'w-24'
    },
    {
      key: 'ctr',
      title: 'CTR',
      priority: 'low' as const,
      render: (value: any, campaign: Campaign) => `${campaign.ctr}%`,
      width: 'w-20'
    },
    {
      key: 'spent',
      title: 'Потрачено',
      priority: 'medium' as const,
      render: (value: any, campaign: Campaign) => formatCurrency(campaign.spent),
      width: 'w-24'
    }
  ]

  return (
    <>
      <PageHeader
        title="Рекламные кампании"
        subtitle={`${mockAdvertiser.name} • Всего: ${filteredCampaigns.length} кампаний`}
        backPath="/advertisers"
        actionButton={
          <ActionButton
            onClick={() => setShowCreateForm(true)}
            icon={Plus}
            shortText="Создать"
          >
            Создать кампанию
          </ActionButton>
        }
      />

      <div className="space-y-6">
        {/* Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setCurrentPage(1)
          }}
          searchPlaceholder="Поиск кампаний..."
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
        />

        {/* Campaigns Table */}
        <DataTable
          data={paginatedCampaigns}
          columns={columns}
          mobileCardView={true}
          emptyMessage={
            searchTerm || statusFilter !== 'all' 
              ? 'Кампании не найдены' 
              : 'Пока нет кампаний'
          }
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>

      {/* Create Campaign Form */}
      <CreateCampaignForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateCampaign}
        advertiserName={mockAdvertiser.name}
        advertiserBudget={formatCurrency(mockAdvertiser.budget)}
      />
    </>
  )
}

export default CampaignsPage