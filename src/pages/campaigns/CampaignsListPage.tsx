import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Edit2, Copy, Play, Pause } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { notify } from '@stores/notificationStore'
import { GlassCard } from '@components/ui'

// Мок данные для демонстрации
const mockCampaigns = [
  {
    id: '1',
    name: 'РК 1',
    status: 'Запущена',
    budget: 100,
    cpm: 2,
    shows: 2000,
    clicks: 60,
    ctr: 3,
    spent: 4,
  },
  {
    id: '2', 
    name: 'РК 2',
    status: 'Остановлена',
    budget: 250,
    cpm: 2,
    shows: 50000,
    clicks: 1500,
    ctr: 3,
    spent: 100,
  },
  {
    id: '3',
    name: 'РК 3',
    status: 'На паузе',
    budget: 100,
    cpm: 2,
    shows: 2000,
    clicks: 60,
    ctr: 3,
    spent: 4,
  },
  {
    id: '4',
    name: 'РК 4',
    status: 'Запущена',
    budget: 100,
    cpm: 2,
    shows: 2000,
    clicks: 60,
    ctr: 3,
    spent: 4,
  },
]

const CampaignsListPage: React.FC = () => {
  const { advertiserId } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useAuthStore()

  const canCreateCampaign = hasPermission('create_campaign')
  const canEditCampaign = hasPermission('edit_campaign')

  const getStatusButton = (status: string) => {
    switch (status) {
      case 'Запущена':
        return <span className="px-2 py-1 bg-green-600 text-white text-xs font-normal rounded">{status}</span>
      case 'Остановлена':
        return <span className="px-2 py-1 bg-red-600 text-white text-xs font-normal rounded">{status}</span>
      case 'На паузе':
        return <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-normal rounded">{status}</span>
      default:
        return <span className="px-2 py-1 bg-gray-600 text-white text-xs font-normal rounded">{status}</span>
    }
  }

  const getActionIcons = (campaign: any) => {
    const isRunning = campaign.status === 'Запущена'
    
    const handleCopy = () => {
      // TODO: Реализовать копирование кампании
      console.log('Copy campaign:', campaign.id)
      notify.success('Скопировано', 'Кампания скопирована')
    }

    const handleEdit = () => {
      navigate(`/advertisers/${advertiserId}/campaigns/${campaign.id}/edit`)
    }

    const handleToggleStatus = () => {
      // TODO: Реализовать переключение статуса
      const newStatus = isRunning ? 'На паузе' : 'Запущена'
      console.log('Toggle campaign status:', campaign.id, newStatus)
      notify.success('Статус изменен', `Кампания ${newStatus}`)
    }

    return (
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleCopy}
          className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100/50 transition-colors"
          title="Копировать"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button 
          onClick={handleEdit}
          className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100/50 transition-colors"
          title="Редактировать"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button 
          onClick={handleToggleStatus}
          className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100/50 transition-colors"
          title={isRunning ? "Остановить" : "Запустить"}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6">
      {/* Advertiser Info */}
      {advertiserId && (
        <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-8 text-sm">
            <div>
              <span className="text-gray-600 font-normal">Рекламодатель:</span>
              <span className="ml-2 font-normal text-black">ООО "Технологии будущего"</span>
            </div>
            <div>
              <span className="text-gray-600 font-normal">Бюджет:</span>
              <span className="ml-2 font-normal text-black">500,000₽</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-start mt-6">
        {canCreateCampaign && (
          <Link
            to={`/advertisers/${advertiserId}/campaigns/create`}
            className="px-4 py-2 bg-white border border-black text-black text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors"
          >
            Создать кампанию
          </Link>
        )}
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden md:grid grid-cols-9 gap-2 px-4 py-2 text-sm font-medium text-gray-600 border-b border-gray-200">
        <div className="col-span-2">Название</div>
        <div className="text-center">Статус</div>
        <div className="text-center">Бюджет</div>
        <div className="text-center">CPM</div>
        <div className="text-center">Показы</div>
        <div className="text-center">Переходы</div>
        <div className="text-center">CTR</div>
        <div className="text-center">Действия</div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {mockCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg hover:shadow-md transition-all">
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-9 gap-2 px-4 py-4 items-center">
              {/* Campaign name */}
              <div className="col-span-2">
                <Link
                  to={`/advertisers/${advertiserId}/campaigns/${campaign.id}/adgroups`}
                  className="text-sm font-medium text-black hover:text-gray-700 transition-colors"
                >
                  {campaign.name}
                </Link>
              </div>
              
              {/* Status */}
              <div className="text-center">
                {getStatusButton(campaign.status)}
              </div>
              
              {/* Statistics */}
              <div className="text-center text-sm font-normal text-gray-900">
                ${campaign.budget}
              </div>
              <div className="text-center text-sm font-normal text-gray-900">
                ${campaign.cpm}
              </div>
              <div className="text-center text-sm font-normal text-gray-900">
                {campaign.shows.toLocaleString()}
              </div>
              <div className="text-center text-sm font-normal text-gray-900">
                {campaign.clicks.toLocaleString()}
              </div>
              <div className="text-center text-sm font-normal text-gray-900">
                {campaign.ctr}%
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-center space-x-1">
                {getActionIcons(campaign)}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/advertisers/${advertiserId}/campaigns/${campaign.id}/adgroups`}
                    className="text-sm font-medium text-black hover:text-gray-700 transition-colors"
                  >
                    {campaign.name}
                  </Link>
                  <div className="mt-1">
                    {getStatusButton(campaign.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {getActionIcons(campaign)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-600 mb-1">Бюджет</div>
                  <div className="font-medium text-gray-900 text-xs truncate">${campaign.budget}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Показы</div>
                  <div className="font-medium text-gray-900">{campaign.shows.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">CTR</div>
                  <div className="font-medium text-gray-900">{campaign.ctr}%</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center space-x-2 text-sm">
        <span className="text-gray-600">1</span>
        <span className="text-gray-600">2</span>
        <span className="text-gray-600">3</span>
        <span className="text-gray-600">4</span>
        <span className="text-gray-600">...&gt;</span>
      </div>
    </div>
  )
}

export default CampaignsListPage
