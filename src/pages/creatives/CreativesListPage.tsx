import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Edit2, Copy, Play, Pause } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { notify } from '@stores/notificationStore'
import { GlassCard } from '@components/ui'

// Мок данные для демонстрации
const mockCreatives = [
  {
    id: '1',
    name: 'Большой крео 1',
    status: 'Запущено',
    budget: 100,
    cpm: 2,
    shows: 2000,
    clicks: 60,
    ctr: 3,
    spent: 4,
    type: 'big',
    image: 'https://via.placeholder.com/300x200',
    description: 'Где лучшие тусовки?...',
    link: 'https://runadevklube.com'
  },
  {
    id: '2', 
    name: 'Большой крео 2',
    status: 'Остановлено',
    budget: 100,
    cpm: 2,
    shows: 2000,
    clicks: 60,
    ctr: 3,
    spent: 4,
    type: 'big',
    image: 'https://via.placeholder.com/300x200',
    description: 'Где люди живут клиентской?...',
    link: 'https://runadevklube.com'
  },
  {
    id: '3',
    name: 'Большой крео 3',
    status: 'Остановлено',
    budget: 100,
    cpm: 2,
    shows: 2000,
    clicks: 60,
    ctr: 3,
    spent: 4,
    type: 'big',
    image: 'https://via.placeholder.com/300x200',
    description: 'Если и нужен тебе ищи меня...',
    link: 'https://runadevklube.com'
  },
  {
    id: '4',
    name: 'Маленький крео 1',
    status: 'Остановлено',
    budget: 100,
    cpm: 2,
    shows: 2000,
    clicks: 60,
    ctr: 3,
    spent: 4,
    type: 'small',
    title: 'Где лучшие тусовки?...',
    text: 'Колограммы денег просто ни к чему...',
    link: 'https://runadevklube.com'
  },
]

const CreativesListPage: React.FC = () => {
  const { advertiserId, campaignId, adgroupId } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useAuthStore()

  const canCreateCreative = hasPermission('create_creative')
  const canEditCreative = hasPermission('edit_creative')

  const getStatusButton = (status: string) => {
    switch (status) {
      case 'Запущено':
        return <span className="px-2 py-1 bg-green-600 text-white text-xs font-normal rounded">{status}</span>
      case 'Остановлено':
        return <span className="px-2 py-1 bg-red-600 text-white text-xs font-normal rounded">{status}</span>
      case 'На паузе':
        return <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-normal rounded">{status}</span>
      default:
        return <span className="px-2 py-1 bg-gray-600 text-white text-xs font-normal rounded">{status}</span>
    }
  }

  const getActionIcons = (creative: any) => {
    const isRunning = creative.status === 'Запущено'
    
    const handleCopy = () => {
      // TODO: Реализовать копирование креатива
      console.log('Copy creative:', creative.id)
      notify.success('Скопировано', 'Креатив скопирован')
    }

    const handleEdit = () => {
      navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adgroupId}/creatives/${creative.id}/edit`)
    }

    const handleToggleStatus = () => {
      // TODO: Реализовать переключение статуса
      const newStatus = isRunning ? 'На паузе' : 'Запущено'
      console.log('Toggle creative status:', creative.id, newStatus)
      notify.success('Статус изменен', `Креатив ${newStatus}`)
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

  const renderCreativeContent = (creative: any) => {
    if (creative.type === 'big') {
      return (
        <div className="flex items-center space-x-4">
          <div className="w-24 h-16 bg-black rounded overflow-hidden flex-shrink-0">
            <img src={creative.image} alt={creative.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-normal">{creative.description}</p>
            <p className="text-xs text-gray-500 font-normal">{creative.link}</p>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <p className="text-xs text-gray-600 font-normal">{creative.title}</p>
          <p className="text-xs text-gray-500 font-normal">{creative.text}</p>
          <p className="text-xs text-gray-400 font-normal">{creative.link}</p>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
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
        {canCreateCreative && (
          <Link
            to={`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adgroupId}/creatives/create`}
            className="px-4 py-2 bg-white border border-black text-black text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors"
          >
            Создать креатив
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

      {/* Creatives List */}
      <div className="space-y-3">
        {mockCreatives.map((creative) => (
          <div key={creative.id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg hover:shadow-md transition-all">
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-9 gap-2 px-4 py-4 items-start">
              {/* Creative name & content */}
              <div className="col-span-2">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-black mb-2">{creative.name}</h3>
                    {renderCreativeContent(creative)}
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div className="text-center pt-2">
                {getStatusButton(creative.status)}
              </div>
              
              {/* Statistics */}
              <div className="text-center text-sm font-normal text-gray-900 pt-2">
                ${creative.budget}
              </div>
              <div className="text-center text-sm font-normal text-gray-900 pt-2">
                ${creative.cpm}
              </div>
              <div className="text-center text-sm font-normal text-gray-900 pt-2">
                {creative.shows.toLocaleString()}
              </div>
              <div className="text-center text-sm font-normal text-gray-900 pt-2">
                {creative.clicks.toLocaleString()}
              </div>
              <div className="text-center text-sm font-normal text-gray-900 pt-2">
                {creative.ctr}%
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-center space-x-1 pt-2">
                {getActionIcons(creative)}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-black mb-1">{creative.name}</h3>
                  <div className="mb-2">
                    {getStatusButton(creative.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {getActionIcons(creative)}
                </div>
              </div>
              
              {/* Creative content */}
              <div className="mb-3">
                {renderCreativeContent(creative)}
              </div>
              
              {/* Statistics grid for mobile */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-600 mb-1">Бюджет</div>
                  <div className="font-medium text-gray-900 text-xs truncate">${creative.budget}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Показы</div>
                  <div className="font-medium text-gray-900">{creative.shows.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">CTR</div>
                  <div className="font-medium text-gray-900">{creative.ctr}%</div>
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

export default CreativesListPage
