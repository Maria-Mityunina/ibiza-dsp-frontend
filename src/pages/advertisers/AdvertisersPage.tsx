import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, TrendingUp, Eye, BarChart3, Search, Filter } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { BudgetControl, DataTable, Pagination, SearchFilters, ActionButton } from '@components/ui'
import { PageHeader } from '@components/layout'
import { CreateAdvertiserForm } from '@components/forms'

interface Advertiser {
  id: string
  name: string
  legalName: string
  inn: string
  kpp?: string
  ogrn?: string
  legalAddress?: string
  bik?: string
  accountNumber?: string
  contractNumber?: string
  contractDate?: string
  useAutoMarketing?: boolean
  budget: number
  spent: number
  ctr: number
  campaigns: number
  status: 'active' | 'inactive' | 'pending' | 'draft' | 'paused' | 'stopped' | 'completed' | 'rejected'
  createdAt: string
}

const AdvertisersPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success } = useToast()
  const navigate = useNavigate()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const [advertisers, setAdvertisers] = useState<Advertiser[]>([
    {
      id: '1',
      name: 'ООО Зеленоглазое такси',
      legalName: 'ООО "Зеленоглазое такси"',
      inn: '1234567890',
      budget: 1000,
      spent: 45,
      ctr: 3,
      campaigns: 12,
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'ОАО Мама я в дубае',
      legalName: 'ОАО "Мама я в дубае"',
      inn: '0987654321',
      budget: 0,
      spent: 100,
      ctr: 3,
      campaigns: 8,
      status: 'active',
      createdAt: '2024-02-01T09:15:00Z'
    },
    {
      id: '3',
      name: 'ОАО Мой друг Лёша танцует лёжа',
      legalName: 'ОАО "Мой друг Лёша танцует лёжа"',
      inn: '5555666677',
      budget: 1500,
      spent: 45,
      ctr: 3,
      campaigns: 5,
      status: 'active',
      createdAt: '2024-03-01T08:30:00Z'
    },
    {
      id: '4',
      name: 'ООО Моя оборона',
      legalName: 'ООО "Моя оборона"',
      inn: '1111222233',
      budget: 900,
      spent: 45,
      ctr: 3,
      campaigns: 3,
      status: 'active',
      createdAt: '2024-04-01T12:00:00Z'
    },
    // Дополнительные рекламодатели для демонстрации пагинации
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 5}`,
      name: `Рекламодатель ${i + 5}`,
      legalName: `ООО "Рекламодатель ${i + 5}"`,
      inn: `${1000000000 + i}`,
      budget: Math.floor(Math.random() * 5000) + 500,
      spent: Math.floor(Math.random() * 200) + 10,
      ctr: Math.floor(Math.random() * 10) + 1,
      campaigns: Math.floor(Math.random() * 20) + 1,
      status: ['active', 'paused', 'draft', 'pending'][Math.floor(Math.random() * 4)] as any,
      createdAt: `2024-0${Math.floor(Math.random() * 5) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`
    }))
  ])

  // Filtered and paginated data
  const filteredAdvertisers = useMemo(() => {
    return advertisers.filter(advertiser => {
      const matchesSearch = advertiser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           advertiser.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           advertiser.inn.includes(searchTerm)
      const matchesStatus = statusFilter === 'all' || advertiser.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [advertisers, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredAdvertisers.length / itemsPerPage)
  const paginatedAdvertisers = filteredAdvertisers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateAdvertiser = (data: any) => {
    const newAdvertiser: Advertiser = {
      id: Date.now().toString(),
      name: data.name,
      legalName: data.legalName,
      inn: data.inn,
      kpp: data.kpp,
      ogrn: data.ogrn,
      legalAddress: data.legalAddress,
      bik: data.bik,
      accountNumber: data.account,
      contractNumber: data.contractNumber,
      contractDate: data.contractDate,
      useAutoMarketing: data.useAutoMarking,
      budget: 0,
      spent: 0,
      ctr: 0,
      campaigns: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setAdvertisers(prev => [newAdvertiser, ...prev])
  }

  const handleBudgetChange = (id: string, newBudget: number) => {
    setAdvertisers(prev => prev.map(advertiser => 
      advertiser.id === id 
        ? { ...advertiser, budget: newBudget }
        : advertiser
    ))
  }

  const handleDeleteAdvertiser = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить рекламодателя "${name}"?`)) {
      setAdvertisers(prev => prev.filter(advertiser => advertiser.id !== id))
      success('Рекламодатель успешно удален')
    }
  }

  const formatCurrency = (value: number) => {
    return `${value}$`
  }

  const columns = [
    {
      key: 'name',
      title: 'Название',
      priority: 'high' as const,
      render: (value: any, advertiser: Advertiser) => (
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/advertisers/${advertiser.id}/edit`)
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Редактировать"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteAdvertiser(advertiser.id, advertiser.name)
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => navigate(`/advertisers/${advertiser.id}/campaigns`)}
              className="text-sm font-normal text-gray-900 hover:text-gray-700 transition-colors text-left block truncate w-full"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {advertiser.name}
            </button>
            <p 
              className="text-xs text-gray-500 mt-1 truncate font-normal"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {advertiser.legalName}
            </p>
          </div>
        </div>
      ),
      width: 'w-1/2'
    },
    {
      key: 'budget',
      title: 'Бюджет',
      priority: 'high' as const,
      render: (value: any, advertiser: Advertiser) => (
        <BudgetControl
          budget={advertiser.budget}
          spent={advertiser.spent}
          onBudgetChange={(newBudget) => handleBudgetChange(advertiser.id, newBudget)}
          size="sm"
          showProgress={false}
        />
      ),
      width: 'w-32'
    },
    {
      key: 'ctr',
      title: 'CTR',
      priority: 'medium' as const,
      render: (value: any, advertiser: Advertiser) => (
        <span 
          className="text-sm font-normal text-gray-900"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {advertiser.ctr}%
        </span>
      ),
      width: 'w-20'
    },
    {
      key: 'spent',
      title: 'Потрачено',
      priority: 'low' as const,
      render: (value: any, advertiser: Advertiser) => (
        <span 
          className="text-sm font-normal text-gray-900"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {formatCurrency(advertiser.spent)}
        </span>
      ),
      width: 'w-24'
    },
    {
      key: 'status',
      title: 'Статус',
      priority: 'high' as const,
      render: (value: any, advertiser: Advertiser) => (
        <span 
          className={`px-3 py-1 rounded-lg text-xs font-normal border ${
            advertiser.status === 'active' 
              ? 'status-active' 
              : 'status-inactive'
          }`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {advertiser.status === 'active' ? 'Активен' : 'Неактивен'}
        </span>
      ),
      width: 'w-24'
    }
  ]

  return (
    <>
      <PageHeader
        title="Рекламодатели"
        subtitle={`Всего: ${filteredAdvertisers.length} рекламодателей`}
        actionButton={
          <ActionButton
            onClick={() => setShowCreateForm(true)}
            icon={Plus}
            shortText="Добавить"
          >
            Добавить рекламодателя
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
          searchPlaceholder="Поиск по названию, ИНН..."
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
        />

        {/* Advertisers Table */}
        <DataTable
          data={paginatedAdvertisers}
          columns={columns}
          mobileCardView={true}
          emptyMessage={
            searchTerm || statusFilter !== 'all' 
              ? 'Рекламодатели не найдены' 
              : 'Пока нет рекламодателей'
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

      {/* Create Advertiser Form */}
      <CreateAdvertiserForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateAdvertiser}
      />
    </>
  )
}

export default AdvertisersPage