import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Copy, Edit, Trash2, Search, Filter, Play, Pause } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { StatusControl, BudgetControl, DataTable, Pagination, SearchFilters, ActionButton } from '@components/ui'
import { PageHeader } from '@components/layout'
import { CreateAdGroupForm } from '@components/forms'

interface AdGroup {
  id: string
  name: string
  campaignId: string
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

const mockCampaign = {
  id: '1',
  name: 'РК 1'
}

const AdGroupsPage: React.FC = () => {
  const { advertiserId, campaignId } = useParams<{ advertiserId: string; campaignId: string }>()
  const { t } = useLanguageStore()
  const { success } = useToast()
  const navigate = useNavigate()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const [adGroups, setAdGroups] = useState<AdGroup[]>([
    {
      id: '1',
      name: 'Объявление 1',
      campaignId: campaignId || '1',
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
      name: 'Объявление 2',
      campaignId: campaignId || '1',
      advertiserId: advertiserId || '1',
      budget: 0,
      spent: 45,
      cpm: 2,
      impressions: 50000,
      clicks: 1500,
      ctr: 3,
      status: 'stopped',
      createdAt: '2024-02-01T09:15:00Z'
    },
    {
      id: '3',
      name: 'Объявление 3',
      campaignId: campaignId || '1',
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
      name: 'Объявление 4',
      campaignId: campaignId || '1',
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
      campaignId: campaignId || '1',
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
      name: 'Объявление 6',
      campaignId: campaignId || '1',
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
    // Дополнительные группы для демонстрации пагинации
    ...Array.from({ length: 150 }, (_, i) => ({
      id: `${i + 7}`,
      name: `Группа ${i + 7}`,
      campaignId: campaignId || '1',
      advertiserId: advertiserId || '1',
      budget: Math.floor(Math.random() * 500) + 50,
      spent: Math.floor(Math.random() * 200) + 10,
      cpm: Math.floor(Math.random() * 5) + 1,
      impressions: Math.floor(Math.random() * 50000) + 1000,
      clicks: Math.floor(Math.random() * 2000) + 50,
      ctr: Math.floor(Math.random() * 10) + 1,
      status: ['active', 'paused', 'draft', 'completed', 'pending'][Math.floor(Math.random() * 5)] as any,
      createdAt: `2024-0${Math.floor(Math.random() * 12) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`
    }))
  ])

  // Filtered and paginated data
  const filteredAdGroups = useMemo(() => {
    return adGroups.filter(adGroup => {
      const matchesSearch = adGroup.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || adGroup.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [adGroups, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredAdGroups.length / itemsPerPage)
  const paginatedAdGroups = filteredAdGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )





  const handleCreateAdGroup = (data: any) => {
    const newAdGroup: AdGroup = {
      id: Date.now().toString(),
      name: data.name,
      campaignId: campaignId || '1',
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

    setAdGroups(prev => [newAdGroup, ...prev])
  }

  const handleStatusChange = (id: string, newStatus: 'active' | 'paused' | 'stopped') => {
    setAdGroups(prev => prev.map(adGroup => 
      adGroup.id === id 
        ? { ...adGroup, status: newStatus }
        : adGroup
    ))
    
    const statusMessages = {
      active: 'Группа объявлений запущена',
      paused: 'Группа объявлений приостановлена',
      stopped: 'Группа объявлений остановлена'
    }
    
    success(statusMessages[newStatus])
  }

  const handleBudgetChange = (id: string, newBudget: number) => {
    setAdGroups(prev => prev.map(adGroup => 
      adGroup.id === id 
        ? { ...adGroup, budget: newBudget }
        : adGroup
    ))
  }

  const handleCopyAdGroup = (adGroupId: string) => {
    const originalAdGroup = adGroups.find(ag => ag.id === adGroupId)
    if (!originalAdGroup) return

    // Find the highest copy number for this ad group
    const baseName = originalAdGroup.name.replace(/ \d+$/, '')
    const copyNumbers = adGroups
      .filter(ag => ag.name.startsWith(baseName))
      .map(ag => {
        const match = ag.name.match(/ (\d+)$/)
        return match ? parseInt(match[1]) : 0
      })
    
    const nextNumber = Math.max(0, ...copyNumbers) + 1
    const newName = `${baseName} ${nextNumber}`

    const newAdGroup: AdGroup = {
      ...originalAdGroup,
      id: Date.now().toString(),
      name: newName,
      spent: 0
    }

    setAdGroups(prev => [newAdGroup, ...prev])
    success('Группа объявлений скопирована')
  }

  const handleDeleteAdGroup = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить группу объявлений "${name}"?`)) {
      setAdGroups(prev => prev.filter(adGroup => adGroup.id !== id))
      success('Группа объявлений успешно удалена')
    }
  }

  const formatCurrency = (value: number) => `${value}$`

  const columns = [
    {
      key: 'name',
      title: 'Название',
      priority: 'high' as const,
      render: (value: any, adGroup: AdGroup) => (
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCopyAdGroup(adGroup.id)
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Копировать"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adGroup.id}/edit`)
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Редактировать"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteAdGroup(adGroup.id, adGroup.name)
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adGroup.id}/creatives`)}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors text-left block truncate w-full"
            >
              {adGroup.name}
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
      render: (value: any, adGroup: AdGroup) => (
        <StatusControl
          status={adGroup.status}
          onStatusChange={(newStatus) => handleStatusChange(adGroup.id, newStatus)}
          size="sm"
        />
      ),
      width: 'w-32'
    },
    {
      key: 'budget',
      title: 'Бюджет',
      priority: 'high' as const,
      render: (value: any, adGroup: AdGroup) => (
        <BudgetControl
          budget={adGroup.budget}
          spent={adGroup.spent}
          onBudgetChange={(newBudget) => handleBudgetChange(adGroup.id, newBudget)}
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
      render: (value: any, adGroup: AdGroup) => `${adGroup.cpm}$`,
      width: 'w-20'
    },
    {
      key: 'impressions',
      title: 'Показы',
      priority: 'medium' as const,
      render: (value: any, adGroup: AdGroup) => adGroup.impressions.toLocaleString(),
      width: 'w-24'
    },
    {
      key: 'clicks',
      title: 'Переходы',
      priority: 'low' as const,
      render: (value: any, adGroup: AdGroup) => adGroup.clicks.toLocaleString(),
      width: 'w-24'
    },
    {
      key: 'ctr',
      title: 'CTR',
      priority: 'low' as const,
      render: (value: any, adGroup: AdGroup) => `${adGroup.ctr}%`,
      width: 'w-20'
    },
    {
      key: 'spent',
      title: 'Потрачено',
      priority: 'medium' as const,
      render: (value: any, adGroup: AdGroup) => formatCurrency(adGroup.spent),
      width: 'w-24'
    }
  ]

  return (
    <>
      <PageHeader
        title="Группы объявлений"
        subtitle={`${mockCampaign.name} • Всего: ${filteredAdGroups.length} групп`}
        backPath={`/advertisers/${advertiserId}/campaigns`}
        actionButton={
          <ActionButton
            onClick={() => setShowCreateForm(true)}
            icon={Plus}
            shortText="Создать"
          >
            Создать группу
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
          searchPlaceholder="Поиск групп объявлений..."
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
        />

        {/* Ad Groups Table */}
        <DataTable
          data={paginatedAdGroups}
          columns={columns}
          mobileCardView={true}
          emptyMessage={
            searchTerm || statusFilter !== 'all' 
              ? 'Группы объявлений не найдены' 
              : 'Пока нет групп объявлений'
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

      {/* Create Ad Group Form */}
      <CreateAdGroupForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateAdGroup}
        advertiserName={mockAdvertiser.name}
        advertiserBudget={formatCurrency(mockAdvertiser.budget)}
      />
    </>
  )
}

export default AdGroupsPage