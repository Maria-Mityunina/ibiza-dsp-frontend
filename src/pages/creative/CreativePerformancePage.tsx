import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useFilters } from '@hooks/useFilters'
import { useExport } from '@hooks/useExport'
import { 
  Image, 
  Video, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointer,
  Heart,
  Share,
  Play,
  Pause,
  RotateCcw,
  Upload,
  Download,
  Filter,
  Grid,
  BarChart3,
  PieChart
} from 'lucide-react'

const CreativePerformancePage: React.FC = () => {
  const { t } = useLanguageStore()
  const { filters, updateFilter } = useFilters()
  const { exportData, isExporting } = useExport()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Creative performance data
  const creativeAssets = [
    {
      id: 1,
      name: 'Summer Sale Banner - Mobile',
      type: 'banner',
      format: '320x50',
      impressions: 2400000,
      clicks: 84200,
      ctr: 3.51,
      conversions: 1247,
      conversionRate: 1.48,
      cpc: 0.87,
      thumbnail: '/api/placeholder/160/90',
      status: 'active',
      performance: 'high'
    },
    {
      id: 2,
      name: 'Product Video - Desktop',
      type: 'video',
      format: '728x90',
      impressions: 1800000,
      clicks: 62100,
      ctr: 3.45,
      conversions: 892,
      conversionRate: 1.44,
      cpc: 1.24,
      thumbnail: '/api/placeholder/160/90',
      status: 'active', 
      performance: 'medium'
    },
    {
      id: 3,
      name: 'Native Ad - Fashion',
      type: 'native',
      format: '300x250',
      impressions: 945000,
      clicks: 28350,
      ctr: 3.00,
      conversions: 456,
      conversionRate: 1.61,
      cpc: 2.15,
      thumbnail: '/api/placeholder/160/90',
      status: 'active',
      performance: 'high'
    },
    {
      id: 4,
      name: 'Retargeting Display',
      type: 'display',
      format: '970x250',
      impressions: 1200000,
      clicks: 36000,
      ctr: 3.00,
      conversions: 540,
      conversionRate: 1.50,
      cpc: 1.85,
      thumbnail: '/api/placeholder/160/90',
      status: 'paused',
      performance: 'low'
    }
  ]

  const formatStats = [
    { format: 'Banner (320x50)', impressions: '4.2M', ctr: 3.8, performance: 'high' },
    { format: 'Display (300x250)', impressions: '3.1M', ctr: 3.2, performance: 'medium' },
    { format: 'Video (Pre-roll)', impressions: '2.8M', ctr: 4.1, performance: 'high' },
    { format: 'Native', impressions: '1.9M', ctr: 3.9, performance: 'high' },
    { format: 'Rich Media', impressions: '1.4M', ctr: 2.8, performance: 'medium' }
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
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('creative.title')}</h1>
            <p className="text-slate-600">{t('creative.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={filters.format}
            onChange={(e) => updateFilter('format', e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          >
            <option value="all">{t('creative.all_formats')}</option>
            <option value="banner">{t('creative.banner')}</option>
            <option value="video">{t('creative.video')}</option>
            <option value="native">{t('creative.native')}</option>
            <option value="display">{t('creative.display')}</option>
          </select>
          
          <div className="flex rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => console.log('Upload creative modal...')}
            className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors"
          >
            {t('creative.upload_creative')}
          </button>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Total Creatives */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Creatives</p>
                <p className="text-2xl font-bold text-slate-900">247</p>
              </div>
            </div>
            <div className="text-emerald-600 text-sm">+12 this week</div>
          </motion.div>

          {/* Active Campaigns */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-slate-900">89</p>
              </div>
            </div>
            <div className="text-emerald-600 text-sm">72% of total</div>
          </motion.div>

          {/* Avg CTR */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg CTR</p>
                <p className="text-2xl font-bold text-slate-900">3.24%</p>
              </div>
            </div>
            <div className="text-emerald-600 text-sm">+0.3% improvement</div>
          </motion.div>

          {/* Top Performer */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Top CTR</p>
                <p className="text-2xl font-bold text-slate-900">8.7%</p>
              </div>
            </div>
            <div className="text-slate-600 text-sm">Video format</div>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Conv Rate</p>
                <p className="text-2xl font-bold text-slate-900">1.51%</p>
              </div>
            </div>
            <div className="text-emerald-600 text-sm">+0.2% vs last month</div>
          </motion.div>
        </div>
      </div>

      {/* Format Performance */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Format Breakdown */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Format Performance</h3>
              <PieChart className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {formatStats.map((format, index) => (
                <div key={format.format} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-slate-900' :
                      index === 1 ? 'bg-slate-700' :
                      index === 2 ? 'bg-slate-600' :
                      index === 3 ? 'bg-slate-500' : 'bg-slate-400'
                    }`}></div>
                    <div>
                      <p className="text-slate-900 font-medium text-sm">{format.format}</p>
                      <p className="text-slate-500 text-xs">{format.impressions} impressions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 font-medium">{format.ctr}% CTR</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      format.performance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                      format.performance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {format.performance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* A/B Test Results */}
          <motion.div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-medium">Active A/B Tests</h3>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: 'CTA Button Color',
                  variantA: { name: 'Red Button', ctr: 3.2, traffic: 50 },
                  variantB: { name: 'Black Button', ctr: 4.1, traffic: 50 },
                  winner: 'B',
                  confidence: 95
                },
                {
                  name: 'Headline Copy',
                  variantA: { name: 'Feature Focus', ctr: 2.8, traffic: 50 },
                  variantB: { name: 'Benefit Focus', ctr: 3.6, traffic: 50 },
                  winner: 'B',
                  confidence: 87
                },
                {
                  name: 'Image Style',
                  variantA: { name: 'Product Only', ctr: 3.1, traffic: 50 },
                  variantB: { name: 'Lifestyle', ctr: 2.9, traffic: 50 },
                  winner: 'A',
                  confidence: 76
                }
              ].map((test, index) => (
                <div key={test.name} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{test.name}</h4>
                    <span className="text-emerald-400 text-sm">{test.confidence}% confidence</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded ${test.winner === 'A' ? 'bg-emerald-900 border border-emerald-600' : 'bg-slate-700'}`}>
                      <p className="text-white text-sm font-medium">{test.variantA.name}</p>
                      <p className="text-slate-300 text-xs">{test.variantA.ctr}% CTR</p>
                      {test.winner === 'A' && <p className="text-emerald-400 text-xs mt-1">Winner 🏆</p>}
                    </div>
                    
                    <div className={`p-3 rounded ${test.winner === 'B' ? 'bg-emerald-900 border border-emerald-600' : 'bg-slate-700'}`}>
                      <p className="text-white text-sm font-medium">{test.variantB.name}</p>
                      <p className="text-slate-300 text-xs">{test.variantB.ctr}% CTR</p>
                      {test.winner === 'B' && <p className="text-emerald-400 text-xs mt-1">Winner 🏆</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Creative Assets Grid/Table */}
      <div className="px-6">
        <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-800 text-lg font-medium">Creative Assets</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                <Filter className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-slate-900 text-white rounded-lg text-sm">
                Export
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creativeAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-slate-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {asset.type === 'video' ? (
                        <Video className="w-8 h-8 text-slate-400" />
                      ) : asset.type === 'banner' ? (
                        <Image className="w-8 h-8 text-slate-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        asset.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h4 className="text-slate-900 font-medium text-sm mb-2 line-clamp-2">
                      {asset.name}
                    </h4>
                    <p className="text-slate-500 text-xs mb-3">{asset.format}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500">Impressions</p>
                        <p className="text-slate-900 font-medium">
                          {(asset.impressions / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">CTR</p>
                        <p className={`font-medium ${
                          asset.ctr > 3.5 ? 'text-emerald-600' : 'text-slate-900'
                        }`}>
                          {asset.ctr}%
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Conversions</p>
                        <p className="text-slate-900 font-medium">{asset.conversions}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">CPC</p>
                        <p className="text-slate-900 font-medium">${asset.cpc}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        asset.performance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                        asset.performance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {asset.performance} performance
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Creative</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Impressions</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">CTR</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">CPC</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Conversions</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Performance</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {creativeAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                            {asset.type === 'video' ? (
                              <Video className="w-4 h-4 text-slate-400" />
                            ) : (
                              <Image className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-slate-900 font-medium text-sm">{asset.name}</p>
                            <p className="text-slate-500 text-xs">{asset.format}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                          {asset.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700">
                        {(asset.impressions / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${
                          asset.ctr > 3.5 ? 'text-emerald-600' : 'text-slate-700'
                        }`}>
                          {asset.ctr}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700">${asset.cpc}</td>
                      <td className="py-4 px-4 text-slate-700">{asset.conversions}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          asset.performance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                          asset.performance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {asset.performance}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          asset.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CreativePerformancePage
