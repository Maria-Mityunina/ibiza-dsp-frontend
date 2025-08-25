import React from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Users, Copy } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { notify } from '@stores/notificationStore'

// Мок данные для демонстрации
const mockAdvertisers = [
  {
    id: '1',
    name: 'ООО "Технологии будущего"',
    legalName: 'Общество с ограниченной ответственностью "Технологии будущего"',
    inn: '123456789012',
    kpp: '123456789',
    ogrn: '123456789012345',
    legalAddress: 'г. Москва, ул. Примерная, д. 1',
    bik: '123456789',
    accountNumber: '12345678901234567890',
    contractNumber: 'Д-001/2024',
    contractDate: '2024-01-15',
    useAutoMarketing: true,
    budget: 500000,
    statistics: {
      ctr: 2.45,
      spent: 125000,
      campaigns: 5,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2', 
    name: 'ИП Петров А.И.',
    legalName: 'Индивидуальный предприниматель Петров Андрей Иванович',
    inn: '123456789013',
    kpp: '123456790',
    ogrn: '123456789012346',
    legalAddress: 'г. Санкт-Петербург, ул. Невская, д. 10',
    bik: '123456790',
    accountNumber: '12345678901234567891',
    contractNumber: 'Д-002/2024',
    contractDate: '2024-02-01',
    useAutoMarketing: false,
    budget: 250000,
    statistics: {
      ctr: 1.87,
      spent: 89500,
      campaigns: 3,
    },
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-05T11:45:00Z',
  },
]

const AdvertisersPage: React.FC = () => {
  const { hasPermission } = useAuthStore()
  const [searchQuery, setSearchQuery] = React.useState('')
  
  // Фильтрация рекламодателей по поисковому запросу
  const filteredAdvertisers = React.useMemo(() => {
    if (!searchQuery.trim()) return mockAdvertisers
    
    return mockAdvertisers.filter(advertiser => 
      advertiser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advertiser.legalName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const canCreateAdvertiser = hasPermission('create_advertiser')
  const canEditAdvertiser = hasPermission('edit_advertiser')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex items-start mt-6">
        {canCreateAdvertiser && (
          <Link
            to="/advertisers/create"
            className="px-4 py-2 bg-white border border-black text-black text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors"
          >
            Добавить рекламодателя
          </Link>
        )}
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2 text-sm font-medium text-gray-600 border-b border-gray-200">
        <div className="col-span-2">Рекламодатель</div>
        <div className="text-center">Бюджет</div>
        <div className="text-center">CTR</div>
        <div className="text-center">Потрачено</div>
        <div className="text-center">Действия</div>
      </div>

      {/* Advertisers List */}
      <div className="space-y-3">
        {filteredAdvertisers.map((advertiser) => (
          <div key={advertiser.id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg hover:shadow-md transition-all">
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-4 items-center">
              {/* Advertiser name */}
              <div className="col-span-2">
                <Link
                  to={`/advertisers/${advertiser.id}/campaigns`}
                  className="text-sm font-medium text-black hover:text-gray-700 transition-colors"
                >
                  {advertiser.name}
                </Link>
              </div>
              
              {/* Statistics */}
              <div className="text-center text-sm font-normal text-gray-900">
                ${(advertiser.budget / 1000).toFixed(0)}k
              </div>
              <div className="text-center text-sm font-normal text-gray-900">
                {advertiser.statistics.ctr.toFixed(1)}%
              </div>
              <div className="text-center text-sm font-normal text-gray-900">
                ${(advertiser.statistics.spent / 1000).toFixed(0)}k
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => {
                    console.log('Copy advertiser:', advertiser.id)
                    notify.success('Скопировано', 'Рекламодатель скопирован')
                  }}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Копировать"
                >
                  <Copy className="h-4 w-4" />
                </button>
                {canEditAdvertiser && (
                  <Link
                    to={`/advertisers/${advertiser.id}/edit`}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <Link
                  to={`/advertisers/${advertiser.id}/campaigns`}
                  className="text-sm font-medium text-black hover:text-gray-700 transition-colors"
                >
                  {advertiser.name}
                </Link>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      console.log('Copy advertiser:', advertiser.id)
                      notify.success('Скопировано', 'Рекламодатель скопирован')
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Копировать"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {canEditAdvertiser && (
                    <Link
                      to={`/advertisers/${advertiser.id}/edit`}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Редактировать"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-600 mb-1">Бюджет</div>
                  <div className="font-medium text-gray-900 text-xs truncate">${(advertiser.budget / 1000).toFixed(0)}k</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">CTR</div>
                  <div className="font-medium text-gray-900">{advertiser.statistics.ctr.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Потрачено</div>
                  <div className="font-medium text-gray-900 text-xs truncate">${(advertiser.statistics.spent / 1000).toFixed(0)}k</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAdvertisers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-normal text-gray-900 mb-2">
            {searchQuery ? 'Рекламодатели не найдены' : 'Нет рекламодателей'}
          </h3>
          <p className="text-gray-600 mb-6 font-normal">
            {searchQuery 
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте первого рекламодателя для начала работы'
            }
          </p>
          {!searchQuery && canCreateAdvertiser && (
            <Link
              to="/advertisers/create"
              className="inline-flex items-center px-4 py-2 bg-white border border-black text-black text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors"
            >
              Добавить рекламодателя
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvertisersPage
