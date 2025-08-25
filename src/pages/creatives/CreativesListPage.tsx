import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Play, Pause, Copy, Eye, TrendingUp, DollarSign, MousePointer, Image as ImageIcon } from 'lucide-react'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { CreateCreativeForm } from '@components/forms'

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
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creatives, setCreatives] = useState<Creative[]>([
    {
      id: '1',
      name: 'Текстовый баннер 1',
      type: 'text',
      status: 'active',
      title: 'Быстрое такси',
      text: 'Заказывайте такси в приложении',
      link: 'https://taxi-app.com',
      cpm: 2.5,
      impressions: 450000,
      clicks: 9000,
      ctr: 2.0,
      spent: 1125
    },
    {
      id: '2',
      name: 'Изображение промо',
      type: 'image',
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x169',
      link: 'https://taxi-app.com/promo',
      cpm: 3.2,
      impressions: 280000,
      clicks: 8400,
      ctr: 3.0,
      spent: 896
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.creatives')}</h1>
          <p className="text-gray-600 mt-1">{t('creative.manage_creatives')}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t('creative.create_new')}</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('creative.total_creatives')}</p>
              <p className="text-2xl font-bold text-gray-900">{creatives.length}</p>
            </div>
          </div>
        </div>
        
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
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('metric.spend')}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${creatives.reduce((sum, creative) => sum + creative.spent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creatives List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('creative.all_creatives')}</h2>
        </div>
        
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
                      onClick={() => {/* Handle edit */}}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('action.edit')}
                    >
                      <Edit className="w-4 h-4" />
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
    </div>
  )
}

export default CreativesListPage