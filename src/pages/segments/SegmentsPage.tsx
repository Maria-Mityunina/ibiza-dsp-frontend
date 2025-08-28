import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Upload, Edit, Trash2, Eye } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { DataTable, Pagination, SearchFilters, ActionButton } from '@components/ui'
import { PageHeader } from '@components/layout'
import { EditSegmentForm } from '@components/forms'
import { Status } from '@types/common'
import { STATUS_LABELS } from '@constants/formats'

interface Segment {
  id: string
  name: string
  description: string
  size: number
  createdAt: string
  status: Status
  type: 'uploaded' | 'custom'
  lastUsed?: string
}

const SegmentsPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const [segments, setSegments] = useState<Segment[]>([
    {
      id: '1',
      name: 'Сегмент Премиум',
      description: 'Пользователи с высоким доходом и активностью',
      size: 125000,
      createdAt: '2024-01-15T10:00:00Z',
      status: 'active',
      type: 'uploaded',
      lastUsed: '2024-03-10T14:30:00Z'
    },
    {
      id: '2',
      name: 'Сегмент Молодежь',
      description: 'Возраст 18-25 лет, активные пользователи соцсетей',
      size: 89500,
      createdAt: '2024-02-01T09:15:00Z',
      status: 'active',
      type: 'custom',
      lastUsed: '2024-03-08T11:20:00Z'
    },
    {
      id: '3',
      name: 'Сегмент Геймеры',
      description: 'Интересуются играми и игровыми устройствами',
      size: 67000,
      createdAt: '2024-02-10T15:45:00Z',
      status: 'paused',
      type: 'uploaded'
    },
    {
      id: '4',
      name: 'Мобильные покупатели',
      description: 'Совершают покупки через мобильные приложения',
      size: 156000,
      createdAt: '2024-03-01T08:30:00Z',
      status: 'active',
      type: 'custom',
      lastUsed: '2024-03-12T16:45:00Z'
    },
    {
      id: '5',
      name: 'Владельцы автомобилей',
      description: 'Пользователи, интересующиеся автомобильной тематикой',
      size: 234000,
      createdAt: '2024-03-05T12:00:00Z',
      status: 'pending',
      type: 'uploaded'
    },
    // Дополнительные сегменты для демонстрации пагинации
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 6}`,
      name: `Сегмент ${i + 6}`,
      description: `Описание сегмента ${i + 6}`,
      size: Math.floor(Math.random() * 500000) + 10000,
      createdAt: `2024-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
      status: ['draft', 'pending', 'active', 'paused', 'rejected', 'completed'][Math.floor(Math.random() * 6)] as Status,
      type: ['uploaded', 'custom'][Math.floor(Math.random() * 2)] as any,
      lastUsed: Math.random() > 0.3 ? `2024-03-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z` : undefined
    }))
  ])

  // Filtered and paginated data
  const filteredSegments = useMemo(() => {
    return segments.filter(segment => {
      const matchesSearch = segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           segment.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || segment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [segments, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredSegments.length / itemsPerPage)
  const paginatedSegments = filteredSegments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleUploadSegment = (data: any) => {
    const newSegment: Segment = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      size: Math.floor(Math.random() * 500000) + 10000,
      createdAt: new Date().toISOString(),
      status: 'pending',
      type: 'uploaded'
    }

    setSegments(prev => [newSegment, ...prev])
    success('Сегмент успешно загружен')
  }

  const handleDeleteSegment = (id: string) => {
    setSegments(prev => prev.filter(segment => segment.id !== id))
    success('Сегмент удален')
  }

  const handleUseSegment = (id: string) => {
    setSegments(prev => prev.map(segment => 
      segment.id === id 
        ? { ...segment, lastUsed: new Date().toISOString() }
        : segment
    ))
    success('Сегмент применен к кампании')
  }

  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment)
    setShowEditForm(true)
  }

  const handleUpdateSegment = (data: Partial<Segment>) => {
    if (!editingSegment) return

    setSegments(prev => prev.map(segment =>
      segment.id === editingSegment.id
        ? { ...segment, ...data }
        : segment
    ))
    
    setEditingSegment(null)
    setShowEditForm(false)
    success('Сегмент успешно обновлен')
  }

  const handleCloseEditForm = () => {
    setEditingSegment(null)
    setShowEditForm(false)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const columns = [
    {
      key: 'name',
      title: 'Название',
      priority: 'high' as const,
      render: (value: any, segment: Segment) => (
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEditSegment(segment)
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Редактировать"
          >
            <Edit className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => {
                // navigate(`/segments/${segment.id}/details`)
              }}
              className="text-sm font-normal text-gray-900 hover:text-gray-700 transition-colors text-left block truncate w-full"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {segment.name}
            </button>
            <p 
              className="text-xs text-gray-500 mt-1 truncate font-normal"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {segment.description}
            </p>
          </div>
        </div>
      ),
      width: 'w-1/2'
    },
    {
      key: 'size',
      title: 'Размер аудитории',
      priority: 'high' as const,
      render: (value: any, segment: Segment) => (
        <span 
          className="text-sm font-normal text-gray-900"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {formatNumber(segment.size)}
        </span>
      ),
      width: 'w-32'
    },
    {
      key: 'type',
      title: 'Тип',
      priority: 'medium' as const,
      render: (value: any, segment: Segment) => (
        <span 
          className="text-xs font-normal text-gray-900"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {segment.type === 'uploaded' ? 'Загружен' : 'Созданный'}
        </span>
      ),
      width: 'w-24'
    },
    {
      key: 'lastUsed',
      title: 'Последнее использование',
      priority: 'low' as const,
      render: (value: any, segment: Segment) => (
        <span 
          className="text-sm font-normal text-gray-900"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {segment.lastUsed ? formatDate(segment.lastUsed) : 'Не использовался'}
        </span>
      ),
      width: 'w-32'
    },
    {
      key: 'status',
      title: 'Статус',
      priority: 'high' as const,
      render: (value: any, segment: Segment) => (
        <span 
          className={`px-3 py-1 rounded-lg text-xs font-normal border ${
            segment.status === 'active' 
              ? 'status-active' 
              : segment.status === 'pending'
              ? 'status-pending'
              : segment.status === 'paused'
              ? 'status-paused'
              : segment.status === 'rejected'
              ? 'status-rejected'
              : segment.status === 'completed'
              ? 'status-completed'
              : 'status-draft'
          }`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {STATUS_LABELS[segment.status] || segment.status}
        </span>
      ),
      width: 'w-28'
    },
    {
      key: 'actions',
      title: 'Действия',
      priority: 'high' as const,
      render: (value: any, segment: Segment) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleUseSegment(segment.id)
            }}
            className="px-2 py-1 bg-gray-900 text-white text-xs font-normal rounded-lg hover:bg-gray-800 transition-colors"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            title="Использовать"
          >
            Использовать
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteSegment(segment.id)
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      width: 'w-32'
    }
  ]

  return (
    <>
      <PageHeader
        title="Сегменты"
        subtitle={`Всего: ${filteredSegments.length} сегментов`}
        actionButton={
          <ActionButton
            onClick={() => setShowUploadForm(true)}
            icon={Upload}
            shortText="Загрузить"
          >
            Загрузить сегмент
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
          searchPlaceholder="Поиск по названию, описанию..."
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
          statusOptions={[
            { value: 'all', label: 'Все статусы' },
            { value: 'draft', label: STATUS_LABELS.draft },
            { value: 'pending', label: STATUS_LABELS.pending },
            { value: 'active', label: STATUS_LABELS.active },
            { value: 'paused', label: STATUS_LABELS.paused },
            { value: 'rejected', label: STATUS_LABELS.rejected },
            { value: 'completed', label: STATUS_LABELS.completed }
          ]}
        />

        {/* Segments Table */}
        <DataTable
          data={paginatedSegments}
          columns={columns}
          mobileCardView={true}
          emptyMessage={
            searchTerm || statusFilter !== 'all' 
              ? 'Сегменты не найдены' 
              : 'Пока нет сегментов'
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

      {/* Upload Segment Form - placeholder */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Загрузить сегмент
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Функция загрузки сегментов будет добавлена в следующих версиях.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Segment Form */}
      <EditSegmentForm
        isOpen={showEditForm}
        onClose={handleCloseEditForm}
        onSubmit={handleUpdateSegment}
        segment={editingSegment}
      />
    </>
  )
}

export default SegmentsPage