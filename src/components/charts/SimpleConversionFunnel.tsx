import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  MousePointer, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle,
  TrendingDown,
  ArrowDown
} from 'lucide-react'

interface FunnelStage {
  id: string
  name: string
  description: string
  value: number
  icon: React.ComponentType<any>
}

interface SimpleConversionFunnelProps {
  title: string
  className?: string
  data?: FunnelStage[]
}

const SimpleConversionFunnel: React.FC<SimpleConversionFunnelProps> = ({
  title,
  className = '',
  data = []
}) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  // Default data if none provided
  const defaultData: FunnelStage[] = [
    {
      id: 'impressions',
      name: 'Показы',
      description: 'Пользователи увидели рекламу',
      value: 1000000,
      icon: Eye
    },
    {
      id: 'clicks',
      name: 'Клики',
      description: 'Пользователи кликнули на рекламу',
      value: 25000,
      icon: MousePointer
    },
    {
      id: 'visits',
      name: 'Посещения',
      description: 'Пользователи посетили сайт',
      value: 22500,
      icon: ShoppingCart
    },
    {
      id: 'leads',
      name: 'Лиды',
      description: 'Пользователи проявили интерес',
      value: 4500,
      icon: CreditCard
    },
    {
      id: 'conversions',
      name: 'Конверсии',
      description: 'Пользователи совершили целевое действие',
      value: 1400,
      icon: CheckCircle
    }
  ]

  const funnelData = data.length > 0 ? data : defaultData
  const maxValue = Math.max(...funnelData.map(stage => stage.value))

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getConversionRate = (index: number): number => {
    if (index === 0) return 100
    return (funnelData[index].value / funnelData[0].value) * 100
  }

  const getDropoffRate = (index: number): number => {
    if (index === 0) return 0
    return ((funnelData[index - 1].value - funnelData[index].value) / funnelData[index - 1].value) * 100
  }

  const getStageWidth = (value: number): number => {
    return (value / maxValue) * 100
  }

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/30 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Путь пользователя от показа до конверсии</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>Общая конверсия: {getConversionRate(funnelData.length - 1).toFixed(2)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Stages */}
        <div className="lg:col-span-2 space-y-3">
          {funnelData.map((stage, index) => {
            const conversionRate = getConversionRate(index)
            const dropoffRate = index > 0 ? getDropoffRate(index) : 0
            const isHovered = hoveredStage === stage.id
            const width = getStageWidth(stage.value)

            return (
              <div key={stage.id}>
                <motion.div
                  className="relative"
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 transition-all duration-300 ${
                    isHovered ? 'bg-white/40 transform -translate-y-1 shadow-lg' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                          <stage.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{stage.name}</div>
                          <div className="text-xs text-gray-600">{stage.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatNumber(stage.value)}</div>
                        <div className="text-xs text-gray-600">{conversionRate.toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200/50 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-slate-700 to-slate-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Drop-off indicator */}
                {index < funnelData.length - 1 && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50/50 px-3 py-1 rounded-full border border-red-200/50">
                      <TrendingDown className="w-3 h-3" />
                      <span>Потеря: {dropoffRate.toFixed(1)}%</span>
                      <ArrowDown className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900">Ключевые показатели</h4>
          
          <div className="space-y-3">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-2xl font-bold text-gray-900">
                {getConversionRate(funnelData.length - 1).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Общая конверсия</div>
            </div>
            
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-2xl font-bold text-gray-900">
                {funnelData[1] && funnelData[0] ? 
                  ((funnelData[1].value / funnelData[0].value) * 100).toFixed(2) : '0'}%
              </div>
              <div className="text-sm text-gray-600">CTR</div>
            </div>
            
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-2xl font-bold text-gray-900">
                {funnelData[2] && funnelData[1] ? 
                  ((funnelData[2].value / funnelData[1].value) * 100).toFixed(2) : '0'}%
              </div>
              <div className="text-sm text-gray-600">Конверсия сайта</div>
            </div>
            
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-2xl font-bold text-gray-900">
                {funnelData[4] && funnelData[3] ? 
                  ((funnelData[4].value / funnelData[3].value) * 100).toFixed(2) : '0'}%
              </div>
              <div className="text-sm text-gray-600">Лид в конверсию</div>
            </div>
          </div>

          {/* Optimization Tips */}
          <div className="mt-6 p-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20">
            <h5 className="font-medium text-gray-900 mb-2">Рекомендации</h5>
            <div className="space-y-2 text-xs text-gray-700">
              {getDropoffRate(1) > 90 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Высокий отток после показов - улучшите релевантность рекламы</span>
                </div>
              )}
              {getDropoffRate(2) > 10 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Потери на посадочной странице - оптимизируйте UX</span>
                </div>
              )}
              {getDropoffRate(4) > 30 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Низкая конверсия лидов - проработайте воронку продаж</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Общая производительность воронки в норме</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleConversionFunnel
