import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Copy, Edit, Search, Filter, Image as ImageIcon, FileText } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { StatusControl, BudgetControl, DataCard, DataCardStat, Pagination, ActionButton } from '@components/ui'
import { PageHeader } from '@components/layout'
import { CreateCreativeForm } from '@components/forms'

interface Creative {
  id: string
  name: string
  adGroupId: string
  campaignId: string
  advertiserId: string
  type: 'big' | 'small'
  budget: number
  spent: number
  cpm: number
  impressions: number
  clicks: number
  ctr: number
  status: 'active' | 'paused' | 'draft' | 'completed' | 'pending' | 'stopped' | 'rejected'
  
  // For big creatives
  imageUrl?: string
  imageAlt?: string
  url?: string
  
  // For small creatives
  title?: string
  text?: string
  
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

const mockAdGroup = {
  id: '1',
  name: 'Группа 1'
}

const CreativesPage: React.FC = () => {
  const { advertiserId, campaignId, adGroupId } = useParams<{ 
    advertiserId: string; 
    campaignId: string; 
    adGroupId: string; 
  }>()
  const { t } = useLanguageStore()
  const { success } = useToast()
  const navigate = useNavigate()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const [creatives, setCreatives] = useState<Creative[]>([
    {
      id: '1',
      name: 'Большой крео 1',
      adGroupId: adGroupId || '1',
      campaignId: campaignId || '1',
      advertiserId: advertiserId || '1',
      type: 'big',
      budget: 100,
      spent: 45,
      cpm: 2,
      impressions: 2000,
      clicks: 60,
      ctr: 3,
      status: 'active',
      imageUrl: 'https://picsum.photos/300/200?random=1',
      imageAlt: 'Creative Image 1',
      url: 'https://example.com',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Маленький крео 1',
      adGroupId: adGroupId || '1',
      campaignId: campaignId || '1',
      advertiserId: advertiserId || '1',
      type: 'small',
      budget: 50,
      spent: 20,
      cpm: 1.5,
      impressions: 1000,
      clicks: 30,
      ctr: 3,
      status: 'paused',
      title: 'Заголовок объявления',
      text: 'Текст объявления здесь...',
      url: 'https://example.com',
      createdAt: '2024-02-01T09:15:00Z'
    },
    {
      id: '3',
      name: 'Большой крео 2',
      adGroupId: adGroupId || '1',
      campaignId: campaignId || '1',
      advertiserId: advertiserId || '1',
      type: 'big',
      budget: 200,
      spent: 100,
      cpm: 3,
      impressions: 5000,
      clicks: 150,
      ctr: 3,
      status: 'active',
      imageUrl: 'https://picsum.photos/300/200?random=2',
      imageAlt: 'Creative Image 2',
      url: 'https://example.com',
      createdAt: '2024-03-01T08:30:00Z'
    },
    // Дополнительные креативы для демонстрации пагинации
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 4}`,
      name: `Креатив ${i + 4}`,
      adGroupId: adGroupId || '1',
      campaignId: campaignId || '1',
      advertiserId: advertiserId || '1',
      type: Math.random() > 0.5 ? 'big' : 'small' as 'big' | 'small',
      budget: Math.floor(Math.random() * 200) + 50,
      spent: Math.floor(Math.random() * 100) + 10,
      cpm: Math.floor(Math.random() * 5) + 1,
      impressions: Math.floor(Math.random() * 10000) + 500,
      clicks: Math.floor(Math.random() * 500) + 20,
      ctr: Math.floor(Math.random() * 10) + 1,
      status: ['active', 'paused', 'draft', 'completed', 'pending'][Math.floor(Math.random() * 5)] as any,
      imageUrl: Math.random() > 0.5 ? `https://picsum.photos/300/200?random=${i + 4}` : undefined,
      title: `Заголовок ${i + 4}`,
      text: `Текст объявления ${i + 4}`,
      url: 'https://example.com',
      createdAt: `2024-0${Math.floor(Math.random() * 12) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`
    }))
  ])

  // Filtered and paginated data
  const filteredCreatives = useMemo(() => {
    return creatives.filter(creative => {
      const matchesSearch = creative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creative.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creative.text?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || creative.status === statusFilter
      const matchesType = typeFilter === 'all' || creative.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [creatives, searchTerm, statusFilter, typeFilter])

  const totalPages = Math.ceil(filteredCreatives.length / itemsPerPage)
  const paginatedCreatives = filteredCreatives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleStatusChange = (id: string, newStatus: 'active' | 'paused' | 'stopped') => {
    setCreatives(prev => prev.map(creative => 
      creative.id === id 
        ? { ...creative, status: newStatus }
        : creative
    ))
    
    const statusMessages = {
      active: 'Креатив запущен',
      paused: 'Креатив приостановлен',
      stopped: 'Креатив остановлен'
    }
    
    success(statusMessages[newStatus])
  }

  const handleBudgetChange = (id: string, newBudget: number) => {
    setCreatives(prev => prev.map(creative => 
      creative.id === id 
        ? { ...creative, budget: newBudget }
        : creative
    ))
  }

  const handleCreateCreative = (data: any) => {
    const newCreative: Creative = {
      id: Date.now().toString(),
      name: data.name,
      adGroupId: adGroupId || '1',
      campaignId: campaignId || '1',
      advertiserId: advertiserId || '1',
      type: data.type,
      budget: Number(data.budget) || 0,
      spent: 0,
      cpm: Number(data.cpm) || 1,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      status: data.status || 'draft',
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      title: data.title,
      text: data.text,
      url: data.url,
      createdAt: new Date().toISOString()
    }

    setCreatives(prev => [newCreative, ...prev])
    success('Креатив создан успешно')
    setShowCreateForm(false)
  }

  const handleCopyCreative = (creativeId: string) => {
    const originalCreative = creatives.find(c => c.id === creativeId)
    if (!originalCreative) return

    // Find the highest copy number for this creative
    const baseName = originalCreative.name.replace(/ \d+$/, '')
    const copyNumbers = creatives
      .filter(c => c.name.startsWith(baseName))
      .map(c => {
        const match = c.name.match(/ (\d+)$/)
        return match ? parseInt(match[1]) : 0
      })
    
    const nextNumber = Math.max(0, ...copyNumbers) + 1
    const newName = `${baseName} ${nextNumber}`

    const newCreative: Creative = {
      ...originalCreative,
      id: Date.now().toString(),
      name: newName,
      spent: 0
    }

    setCreatives(prev => [newCreative, ...prev])
    success('Креатив скопирован')
  }

  const formatCurrency = (value: number) => `${value}$`

  return (
    <>
      <PageHeader
        title="Креативы"
        subtitle={`${mockAdGroup.name} • Всего: ${filteredCreatives.length} креативов`}
        backPath={`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups`}
        actionButton={
          <ActionButton
            onClick={() => setShowCreateForm(true)}
            icon={Plus}
            shortText="Создать"
          >
            Создать креатив
          </ActionButton>
        }
      />

      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск креативов..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="glass-input pl-10"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="glass-select pl-10"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="paused">На паузе</option>
                <option value="draft">Черновик</option>
                <option value="completed">Завершенные</option>
                <option value="pending">На модерации</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="glass-select"
            >
              <option value="all">Все типы</option>
              <option value="big">Большие</option>
              <option value="small">Маленькие</option>
            </select>
          </div>
        </div>

        {/* Creatives Grid */}
        {paginatedCreatives.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {paginatedCreatives.map((creative) => (
              <DataCard
                key={creative.id}
                title={creative.name}
                subtitle={creative.type === 'big' ? 'Большой креатив' : 'Маленький креатив'}
                actions={
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyCreative(creative.id)
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Копировать"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adGroupId}/creatives/${creative.id}/edit`)
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Редактировать"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                }
                className="h-full"
              >
                {/* Preview */}
                <div className="mb-4">
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {creative.type === 'big' && creative.imageUrl ? (
                      <img 
                        src={creative.imageUrl} 
                        alt={creative.imageAlt || creative.name}
                        className="w-full h-full object-cover"
                      />
                    ) : creative.type === 'big' ? (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    ) : (
                      <div className="text-center p-2">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 leading-tight">
                          {creative.title || creative.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <DataCardStat
                  label="CPM"
                  value={creative.cpm}
                  format="currency"
                />
                <DataCardStat
                  label="CTR"
                  value={creative.ctr}
                  format="percentage"
                />
                <DataCardStat
                  label="Показы"
                  value={creative.impressions}
                />
                <DataCardStat
                  label="Переходы"
                  value={creative.clicks}
                />
                <DataCardStat
                  label="Потрачено"
                  value={creative.spent}
                  format="currency"
                />
                
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <StatusControl
                    status={creative.status}
                    onStatusChange={(newStatus) => handleStatusChange(creative.id, newStatus)}
                    size="sm"
                  />
                  <div className="mt-2">
                    <BudgetControl
                      budget={creative.budget}
                      spent={creative.spent}
                      onBudgetChange={(newBudget) => handleBudgetChange(creative.id, newBudget)}
                      size="sm"
                      showProgress={true}
                    />
                  </div>
                </div>
              </DataCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Креативы не найдены' 
                : 'Пока нет креативов'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Создать первый креатив
              </button>
            )}
          </div>
        )}

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

      {/* Create Creative Form */}
      <CreateCreativeForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateCreative}
        advertiserName={mockAdvertiser.name}
        advertiserBudget={formatCurrency(mockAdvertiser.budget)}
      />
    </>
  )
}

export default CreativesPage
