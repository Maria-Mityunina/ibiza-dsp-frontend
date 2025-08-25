import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, Edit2, Trash2, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useAuthStore } from '@stores/authStore'
import { GlassCard } from '@components/ui'
import clsx from 'clsx'

// Мок данные для демонстрации
const mockSegments = [
  {
    id: '1',
    name: 'Сегмент Премиум',
    description: 'Пользователи с высоким доходом',
    size: 125000,
    createdAt: '2024-01-15',
    status: 'Активный'
  },
  {
    id: '2', 
    name: 'Сегмент Молодежь',
    description: 'Возраст 18-25 лет',
    size: 89500,
    createdAt: '2024-02-01',
    status: 'Активный'
  },
  {
    id: '3',
    name: 'Сегмент Геймеры',
    description: 'Интересуются играми',
    size: 67000,
    createdAt: '2024-02-10',
    status: 'Неактивный'
  },
]

const SegmentsPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { hasPermission } = useAuthStore()

  const canCreateSegment = hasPermission('create_segment')
  const canEditSegment = hasPermission('edit_segment')
  const canDeleteSegment = hasPermission('delete_segment')

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
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
        <div className="flex flex-col">
          <div className="flex items-center space-x-4 mb-4 mt-6">
            {canCreateSegment && (
              <Link
                to="/segments/upload"
                className="inline-flex items-center px-4 py-2 bg-white border border-black text-black text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Загрузить сегмент
              </Link>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-normal text-black">Сегменты</h1>
            <p className="text-sm text-gray-600 mt-1 font-normal">Управление аудиторными сегментами</p>
          </div>
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSegments.map((segment) => (
          <GlassCard key={segment.id} className="p-6 min-h-[280px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-normal text-black mb-2">
                  {segment.name}
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  {segment.description}
                </p>
              </div>
              
              {(canEditSegment || canDeleteSegment) && (
                <div className="flex items-center space-x-2 ml-4">
                  {canEditSegment && (
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100/50 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                  {canDeleteSegment && (
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Размер аудитории:</span>
                <span className="text-sm font-semibold text-black">
                  {formatNumber(segment.size)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Создан:</span>
                <span className="text-sm font-normal text-gray-700">
                  {new Date(segment.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Статус:</span>
                <span className={clsx(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  segment.status === 'Активный'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                )}>
                  {segment.status}
                </span>
              </div>
            </div>

            {canCreateSegment && (
              <button className="w-full mt-4 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Использовать в кампании
              </button>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Empty State */}
      {mockSegments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Upload className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-normal text-gray-900 mb-2">
            Нет сегментов
          </h3>
          <p className="text-gray-600 mb-6 font-normal">
            Загрузите первый сегмент для начала работы с таргетингом
          </p>
          {canCreateSegment && (
            <Link
              to="/segments/upload"
              className="inline-flex items-center px-4 py-2 bg-white border border-black text-black text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Загрузить сегмент
            </Link>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default SegmentsPage
