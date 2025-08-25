import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit, Trash2, Play, Pause, Copy, Eye, TrendingUp, DollarSign, MousePointer, Image as ImageIcon } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateCreativeForm, EditCreativeForm } from '@components/forms'

interface Creative {
  id: string
  name: string
  type: 'text' | 'image'
  status: 'active' | 'paused' | 'draft'
  title?: string
  text?: string
  imageUrl?: string
  link: string
  cpm: number
  impressions: number
  clicks: number
  ctr: number
  spent: number
}

const CreativesListPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success } = useToast()
  const navigate = useNavigate()
  const { advertiserId, campaignId, adGroupId } = useParams()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null)
  const [creatives, setCreatives] = useState<Creative[]>([
    {
      id: '1',
      name: 'Большой крео 1',
      type: 'image',
      status: 'active',
      title: 'Где лучше тусовать?',
      text: 'Килограммы денег просто так...',
      imageUrl: 'https://i.postimg.cc/L8QhXGqp/matinee-ibiza.jpg',
      link: 'https://runavklube.com',
      cpm: 2.5,
      impressions: 2000,
      clicks: 60,
      ctr: 3.0,
      spent: 4
    },
    {
      id: '2',
      name: 'Большой крео 2',
      type: 'image',
      status: 'paused',
      title: 'Где люди живут хипхопом!',
      text: 'Где люди живут хипхопом!',
      imageUrl: 'https://i.postimg.cc/kgHCxqPP/illuzion.jpg',
      link: 'https://runavklube.com',
      cpm: 2.5,
      impressions: 50000,
      clicks: 1500,
      ctr: 3.0,
      spent: 100
    },
    {
      id: '3',
      name: 'Берхгайн',
      type: 'image',
      status: 'paused',
      title: 'Если и нужен тебе ищи хмель...',
      text: 'Если и нужен тебе ищи хмель...',
      imageUrl: 'https://i.postimg.cc/yY8QNmJK/berghain.jpg',
      link: 'https://runavklube.com',
      cpm: 2.5,
      impressions: 2000,
      clicks: 60,
      ctr: 3.0,
      spent: 4
    },
    {
      id: '3',
      name: 'Летняя акция',
      type: 'text',
      status: 'paused',
      title: 'Скидка 50%',
      text: 'На все поездки в июле',
      link: 'https://taxi-app.com/summer',
      cpm: 1.8,
      impressions: 120000,
      clicks: 1800,
      ctr: 1.5,
      spent: 216
    }
  ])

  const handleCreateCreative = (data: any) => {
    const newCreative: Creative = {
      id: Date.now().toString(),
      name: data.title || `Creative ${Date.now()}`,
      type: data.image ? 'image' : 'text',
      status: data.launchAfterSave ? 'active' : 'draft',
      title: data.title,
      text: data.text,
      imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
      link: data.link,
      cpm: parseFloat(data.cpm) || 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      spent: 0
    }
    
    setCreatives(prev => [newCreative, ...prev])
  }

  const handleDeleteCreative = (creativeId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот креатив?')) {
      setCreatives(prev => prev.filter(creative => creative.id !== creativeId))
    }
  }

  const handleEditCreative = (data: any) => {
    if (!selectedCreative) return
    
    const updatedCreative: Creative = {
      ...selectedCreative,
      name: data.name || selectedCreative.name,
      title: data.title,
      text: data.text,
      link: data.link,
      cpm: parseFloat(data.cpm) || selectedCreative.cpm
    }
    
    setCreatives(prev => prev.map(creative => 
      creative.id === selectedCreative.id ? updatedCreative : creative
    ))
    success('Креатив успешно обновлен')
    setSelectedCreative(null)
    setShowEditForm(false)
  }

  const openEditForm = (creative: Creative) => {
    setSelectedCreative(creative)
    setShowEditForm(true)
  }

  const toggleCreativeStatus = (id: string) => {
    setCreatives(prev => prev.map(creative => 
      creative.id === id 
        ? { ...creative, status: creative.status === 'active' ? 'paused' : 'active' as any }
        : creative
    ))
  }

  const copyCreative = (creative: Creative) => {
    const newCreative: Creative = {
      ...creative,
      id: Date.now().toString(),
      name: `${creative.name} (копия)`,
      status: 'draft',
      impressions: 0,
      clicks: 0,
      spent: 0
    }
    
    setCreatives(prev => [newCreative, ...prev])
    success(t('creative.copied_successfully'))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'active' ? Pause : Play
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
            {t('nav.creatives')}
          </h1>
          <p className="text-gray-600 font-light">
            Управление креативными материалами
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 font-medium"
        >
          <Plus className="h-4 w-4" />
          Создать креатив
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-blue-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <ImageIcon className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Всего креативов</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {creatives.length}
          </div>
        </motion.div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('metric.clicks')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {creatives.reduce((sum, creative) => sum + creative.clicks, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('metric.ctr')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {(creatives.reduce((sum, creative) => sum + creative.ctr, 0) / creatives.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="bg-orange-50 p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">Потрачено</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            ${creatives.reduce((sum, creative) => sum + creative.spent, 0).toLocaleString()}
          </div>
        </motion.div>
      </div>

      {/* Creatives List Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Все креативы
        </h2>
      </div>

      {/* Creatives List */}
      <div className="space-y-4">
        
        <div className="divide-y divide-gray-200">
          {creatives.map((creative) => {
            const StatusIcon = getStatusIcon(creative.status)
            
            return (
              <motion.div
                key={creative.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-start space-x-4">
                    {/* Creative Preview */}
                    <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {creative.type === 'image' && creative.imageUrl ? (
                        <img
                          src={creative.imageUrl}
                          alt={creative.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <p className="text-xs font-medium text-gray-700 truncate">
                            {creative.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {creative.text}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-slate-600 transition-colors cursor-pointer">
                            {creative.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {creative.type === 'text' ? t('creative.text_ad') : t('creative.image_ad')} • CPM: ${creative.cpm}
                          </p>
                          <p className="text-xs text-blue-600 truncate max-w-md mt-1">
                            {creative.link}
                          </p>
                        </div>
                        
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(creative.status)}`}>
                          {t(`status.${creative.status}`)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">{t('metric.impressions')}</p>
                          <p className="text-sm font-medium text-gray-900">{creative.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{t('metric.clicks')}</p>
                          <p className="text-sm font-medium text-gray-900">{creative.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{t('metric.ctr')}</p>
                          <p className="text-sm font-medium text-gray-900">{creative.ctr}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{t('metric.spend')}</p>
                          <p className="text-sm font-medium text-gray-900">${creative.spent}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => copyCreative(creative)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.duplicate')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditForm(creative)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCreative(creative.id)
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => toggleCreativeStatus(creative.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        creative.status === 'active' 
                          ? 'text-yellow-600 hover:bg-yellow-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={creative.status === 'active' ? t('action.pause') : t('action.resume')}
                    >
                      <StatusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Create Creative Form */}
      <CreateCreativeForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateCreative}
      />

      {/* Edit Creative Form */}
      <EditCreativeForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setSelectedCreative(null)
        }}
        onSubmit={handleEditCreative}
        creative={selectedCreative}
      />
    </motion.div>
  )
}

export default CreativesListPage