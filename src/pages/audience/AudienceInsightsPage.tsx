import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useFilters } from '@hooks/useFilters'
import { 
  Users, 
  Eye, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Heart,
  ShoppingBag,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Calendar,
  Filter,
  MoreHorizontal,
  PieChart,
  BarChart3
} from 'lucide-react'

const AudienceInsightsPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { filters, updateFilter } = useFilters()
  const [selectedSegment, setSelectedSegment] = useState('all')

  // Audience segments data
  const audienceSegments = [
    {
      id: 'high-value',
      name: 'High-Value Customers',
      size: '2.4M',
      growth: 12.5,
      ctr: 4.8,
      conversionRate: 8.2,
      color: 'bg-slate-900'
    },
    {
      id: 'lookalike',
      name: 'Lookalike Audience',
      size: '5.7M', 
      growth: 8.3,
      ctr: 3.2,
      conversionRate: 5.1,
      color: 'bg-slate-700'
    },
    {
      id: 'retargeting',
      name: 'Retargeting Pool',
      size: '1.8M',
      growth: -2.1,
      ctr: 6.7,
      conversionRate: 12.4,
      color: 'bg-slate-600'
    },
    {
      id: 'interest-based',
      name: 'Interest-Based',
      size: '8.9M',
      growth: 15.7,
      ctr: 2.9,
      conversionRate: 3.8,
      color: 'bg-slate-500'
    }
  ]

  return (
    <div className="py-6 space-y-6 min-h-screen bg-slate-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6"
      >
        <div className="flex items-center space-x-6">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('audience.title')}</h1>
            <p className="text-slate-600">{t('audience.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          >
            <option value="all">{t('audience.all_segments')}</option>
            <option value="high-value">{t('audience.high_value_customers')}</option>
            <option value="lookalike">{t('audience.lookalike_audience')}</option>
            <option value="retargeting">{t('audience.retargeting_pool')}</option>
          </select>
          <button 
            onClick={() => notify.info('Создание сегмента', 'Функция в разработке')}
            className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors"
          >
            {t('audience.create_segment')}
          </button>
        </div>
      </motion.div>

      {/* Audience Overview Cards */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {audienceSegments.map((segment, index) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSegment(segment.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="mb-4">
                <h3 className="text-slate-900 font-medium text-sm mb-2">{segment.name}</h3>
                <p className="text-2xl font-bold text-slate-900">{segment.size}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Growth:</span>
                  <span className={`font-medium ${
                    segment.growth > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {segment.growth > 0 ? '+' : ''}{segment.growth}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">CTR:</span>
                  <span className="text-slate-900 font-medium">{segment.ctr}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Conv Rate:</span>
                  <span className="text-slate-900 font-medium">{segment.conversionRate}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demographics & Psychographics */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Age & Gender Distribution */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Demographics</h3>
              <PieChart className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-slate-600 text-sm font-medium mb-3">Age Groups</h4>
                {[
                  { range: '18-24', percentage: 18.2, color: 'bg-slate-900' },
                  { range: '25-34', percentage: 34.7, color: 'bg-slate-700' },
                  { range: '35-44', percentage: 28.1, color: 'bg-slate-600' },
                  { range: '45-54', percentage: 12.8, color: 'bg-slate-500' },
                  { range: '55+', percentage: 6.2, color: 'bg-slate-400' }
                ].map((age, index) => (
                  <div key={age.range} className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${age.color}`}></div>
                      <span className="text-slate-900 text-sm">{age.range}</span>
                    </div>
                    <span className="text-slate-600 text-sm font-medium">{age.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-slate-600 text-sm font-medium mb-3">Gender Split</h4>
                <div className="flex space-x-4">
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-slate-900">52.3%</p>
                    <p className="text-slate-600 text-sm">Female</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-slate-900">47.7%</p>
                    <p className="text-slate-600 text-sm">Male</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interests & Behaviors */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Top Interests</h3>
              <Heart className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-3">
              {[
                { interest: 'Technology', affinity: 94.2, icon: '📱' },
                { interest: 'Fashion & Style', affinity: 87.6, icon: '👗' },
                { interest: 'Travel', affinity: 82.1, icon: '✈️' },
                { interest: 'Food & Dining', affinity: 78.9, icon: '🍕' },
                { interest: 'Sports', affinity: 71.3, icon: '⚽' },
                { interest: 'Music', affinity: 68.7, icon: '🎵' },
                { interest: 'Fitness', affinity: 65.4, icon: '💪' },
                { interest: 'Gaming', affinity: 59.8, icon: '🎮' }
              ].map((item, index) => (
                <div key={item.interest} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-slate-900 text-sm font-medium">{item.interest}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-slate-900 h-2 rounded-full" 
                        style={{ width: `${item.affinity}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-600 text-sm w-10 text-right">{item.affinity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Device & Platform Usage */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Device Usage</h3>
              <Smartphone className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-slate-600 text-sm font-medium mb-3">Devices</h4>
                {[
                  { device: 'Mobile', percentage: 58.3, icon: Smartphone, engagement: 'High' },
                  { device: 'Desktop', percentage: 32.1, icon: Monitor, engagement: 'Medium' },
                  { device: 'Tablet', percentage: 9.6, icon: Monitor, engagement: 'Low' }
                ].map((item, index) => (
                  <div key={item.device} className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-900 text-sm font-medium">{item.device}</p>
                        <p className="text-slate-500 text-xs">{item.engagement} engagement</p>
                      </div>
                    </div>
                    <span className="text-slate-600 text-sm font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-slate-600 text-sm font-medium mb-3">Operating Systems</h4>
                <div className="space-y-2">
                  {[
                    { os: 'iOS', share: 47.2 },
                    { os: 'Android', share: 42.8 },
                    { os: 'Windows', share: 8.1 },
                    { os: 'Other', share: 1.9 }
                  ].map((os, index) => (
                    <div key={os.os} className="flex items-center justify-between">
                      <span className="text-slate-900 text-sm">{os.os}</span>
                      <span className="text-slate-600 text-sm">{os.share}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Purchase Intent & Lookalike Analysis */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Intent Scoring */}
          <motion.div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-medium">Purchase Intent Analysis</h3>
              <ShoppingBag className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-white">8.7/10</p>
                <p className="text-slate-400 text-sm">Average Intent Score</p>
              </div>

              {[
                { behavior: 'Product Page Views', score: 9.2, trend: '+12%' },
                { behavior: 'Add to Cart', score: 8.8, trend: '+8%' },
                { behavior: 'Search Queries', score: 8.4, trend: '+15%' },
                { behavior: 'Price Comparisons', score: 7.9, trend: '+5%' },
                { behavior: 'Review Reading', score: 7.2, trend: '+22%' }
              ].map((item, index) => (
                <div key={item.behavior} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{item.behavior}</p>
                    <p className="text-slate-400 text-xs">{item.trend} vs last month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-bold">{item.score}</p>
                    <div className="w-16 bg-slate-700 rounded-full h-1 mt-1">
                      <div 
                        className="bg-emerald-400 h-1 rounded-full" 
                        style={{ width: `${item.score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Lookalike Performance */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Lookalike Performance</h3>
              <Target className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-6">
              {[
                {
                  similarity: '1% Lookalike',
                  size: '2.4M',
                  quality: 94.2,
                  ctr: 4.8,
                  convRate: 8.2,
                  color: 'bg-slate-900'
                },
                {
                  similarity: '2% Lookalike', 
                  size: '4.8M',
                  quality: 87.6,
                  ctr: 3.9,
                  convRate: 6.1,
                  color: 'bg-slate-700'
                },
                {
                  similarity: '5% Lookalike',
                  size: '12.1M', 
                  quality: 78.3,
                  ctr: 2.8,
                  convRate: 4.3,
                  color: 'bg-slate-500'
                }
              ].map((lookalike, index) => (
                <div key={lookalike.similarity} className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${lookalike.color}`}></div>
                      <h4 className="text-slate-900 font-medium">{lookalike.similarity}</h4>
                    </div>
                    <span className="text-slate-600 text-sm">{lookalike.size} users</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{lookalike.quality}%</p>
                      <p className="text-slate-600 text-xs">Quality Score</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{lookalike.ctr}%</p>
                      <p className="text-slate-600 text-xs">CTR</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{lookalike.convRate}%</p>
                      <p className="text-slate-600 text-xs">Conv Rate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AudienceInsightsPage
