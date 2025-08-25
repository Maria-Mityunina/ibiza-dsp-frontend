import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useFilters } from '@hooks/useFilters'
import { useExport } from '@hooks/useExport'
import { useToast } from '@hooks/useToast'
import { 
  Users, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  DollarSign,
  Target,
  BarChart3,
  Activity,
  Zap,
  Award,
  Percent,
  Clock,
  MoreHorizontal,
  Globe,
  Shield,
  Smartphone,
  Monitor,
  Tablet,
  AlertTriangle,
  TrendingDown,
  Play,
  Pause,
  Settings,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

// Import components
import RadarChart from '@components/charts/RadarChart'
import HeatmapCalendar from '@components/charts/HeatmapCalendar'
import { InteractiveFunnelChart, LiveMetricsChart, ScatterPlotChart } from '@components/charts'
import TeamCard from '@components/ui/TeamCard'
import { addDays } from 'date-fns'

const AnalyticsPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { filters, updateFilter } = useFilters()
  const { exportData, isExporting } = useExport()
  const { success, error } = useToast()
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)
  const [selectedTab, setSelectedTab] = useState('analytics')

  // DSP Performance Data
  const performanceRadarData = [
    { subject: 'CTR', value: 85, fullMark: 100 },
    { subject: 'ROAS', value: 92, fullMark: 100 },
    { subject: 'Quality', value: 78, fullMark: 100 },
    { subject: 'Reach', value: 88, fullMark: 100 },
    { subject: 'Frequency', value: 95, fullMark: 100 },
    { subject: 'Viewability', value: 82, fullMark: 100 },
  ]

  // Team members (targeting managers)
  const teamMembers = [
    { id: '1', name: 'Alex Chen', initials: 'AC', status: 'online' as const, role: 'Campaign Manager' },
    { id: '2', name: 'Sarah Wilson', initials: 'SW', status: 'online' as const, role: 'Data Analyst' },
    { id: '3', name: 'Mike Johnson', initials: 'MJ', status: 'away' as const, role: 'DSP Specialist' },
    { id: '4', name: 'Emma Davis', initials: 'ED', status: 'online' as const, role: 'Trader' },
    { id: '5', name: 'Tom Brown', initials: 'TB', status: 'offline' as const, role: 'QA Analyst' },
  ]

  // Real-time bid data
  const realtimeBids = [
    { timestamp: new Date(), bids: 1250, wins: 89, price: 2.45 },
    { timestamp: new Date(), bids: 1180, wins: 76, price: 2.32 },
    { timestamp: new Date(), bids: 1340, wins: 95, price: 2.67 },
  ]

  return (
    <div className="py-6 space-y-6 min-h-screen bg-slate-50 max-w-full overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6"
      >
        <div className="flex items-center space-x-6">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t('nav.analytics')}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsRealTimeActive(!isRealTimeActive)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRealTimeActive 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {isRealTimeActive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{t('header.real_time')}</span>
          </button>

        </div>
      </motion.div>

      {/* Main Title & Controls */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">{t('analytics.title')}</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                success('Data refreshed', 'Analytics data has been updated')
                // Simulate refresh
                setTimeout(() => window.location.reload(), 1000)
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={async () => {
                try {
                  await exportData([], 'analytics-report', { format: 'csv' })
                  success('Export completed', 'Analytics report has been downloaded')
                } catch (err) {
                  error('Export failed', 'Could not export analytics data')
                }
              }}
              disabled={isExporting}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              title="Export data"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Time Filter */}
        <div className="flex space-x-2 text-sm">
          {['1h', '6h', '24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => updateFilter('timeRange', range)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filters.timeRange === range
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {t(`time.${range}`, range)}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Impressions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">{t('analytics.total_impressions')}</p>
                  <p className="text-2xl font-bold text-slate-900">24.7M</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
                <p className="text-slate-500 text-xs">vs last week</p>
              </div>
            </div>
            
            {/* Mini trend line */}
            <div className="h-8 flex items-end space-x-1">
              {[40, 60, 45, 80, 70, 90, 85].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-900 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Total Clicks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">{t('analytics.total_clicks')}</p>
                  <p className="text-2xl font-bold text-slate-900">847K</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.2%
                </div>
                <p className="text-slate-500 text-xs">vs last week</p>
              </div>
            </div>
            
            {/* Mini trend line */}
            <div className="h-8 flex items-end space-x-1">
              {[30, 50, 70, 60, 80, 75, 85].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-900 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Average CTR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">{t('analytics.average_ctr')}</p>
                  <p className="text-2xl font-bold text-slate-900">3.43%</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-red-600 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -2.1%
                </div>
                <p className="text-slate-500 text-xs">vs last week</p>
              </div>
            </div>
            
            {/* CTR quality indicator */}
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-slate-900 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </motion.div>

          {/* ROAS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">ROAS</p>
                  <p className="text-2xl font-bold text-slate-900">4.2x</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.3%
                </div>
                <p className="text-slate-500 text-xs">vs last week</p>
              </div>
            </div>
            
            {/* ROAS gauge */}
            <div className="relative">
              <div className="w-full h-2 bg-slate-200 rounded-full">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '84%' }}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">Target: 3.5x</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
          {/* CPC */}
          <motion.div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-600 text-sm">CPC</span>
            </div>
            <p className="text-xl font-bold text-slate-900">$0.87</p>
            <p className="text-emerald-600 text-xs">-5.2%</p>
          </motion.div>

          {/* CPM */}
          <motion.div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-600 text-sm">CPM</span>
            </div>
            <p className="text-xl font-bold text-slate-900">$12.45</p>
            <p className="text-red-600 text-xs">+3.1%</p>
          </motion.div>

          {/* Conversions */}
          <motion.div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-600 text-sm">Conversions</span>
            </div>
            <p className="text-xl font-bold text-slate-900">2,847</p>
            <p className="text-emerald-600 text-xs">+18.7%</p>
          </motion.div>

          {/* Viewability */}
          <motion.div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                <Eye className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-600 text-sm">Viewability</span>
            </div>
            <p className="text-xl font-bold text-slate-900">87.3%</p>
            <p className="text-emerald-600 text-xs">+2.1%</p>
          </motion.div>

          {/* Brand Safety */}
          <motion.div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-600 text-sm">Brand Safety</span>
            </div>
            <p className="text-xl font-bold text-slate-900">99.1%</p>
            <p className="text-emerald-600 text-xs">+0.3%</p>
          </motion.div>

          {/* Fraud Rate */}
          <motion.div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-600 text-sm">Fraud Rate</span>
            </div>
            <p className="text-xl font-bold text-slate-900">0.8%</p>
            <p className="text-emerald-600 text-xs">-0.2%</p>
          </motion.div>
        </div>
      </div>

      {/* Device & Geo Analytics */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Device Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Device Performance</h3>
              <button className="text-slate-400">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Monitor className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">Desktop</p>
                    <p className="text-slate-500 text-sm">52.3% share</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 font-medium">$2.45</p>
                  <p className="text-emerald-600 text-sm">CTR: 4.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">Mobile</p>
                    <p className="text-slate-500 text-sm">38.7% share</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 font-medium">$1.98</p>
                  <p className="text-emerald-600 text-sm">CTR: 3.8%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center">
                    <Tablet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">Tablet</p>
                    <p className="text-slate-500 text-sm">9.0% share</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 font-medium">$3.12</p>
                  <p className="text-red-600 text-sm">CTR: 2.1%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Geographic Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Top Regions</h3>
              <Globe className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {[
                { country: 'United States', share: 42.3, ctr: 4.1, flag: '🇺🇸' },
                { country: 'Germany', share: 18.7, ctr: 3.8, flag: '🇩🇪' },
                { country: 'United Kingdom', share: 15.2, ctr: 4.3, flag: '🇬🇧' },
                { country: 'Canada', share: 12.1, ctr: 3.9, flag: '🇨🇦' },
                { country: 'Australia', share: 8.4, ctr: 4.0, flag: '🇦🇺' },
              ].map((region, index) => (
                <div key={region.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{region.flag}</span>
                    <div>
                      <p className="text-slate-900 font-medium">{region.country}</p>
                      <p className="text-slate-500 text-sm">{region.share}% share</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-600 font-medium">{region.ctr}% CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Real-time Bidding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-medium">Real-time Bidding</h3>
              <div className={`w-3 h-3 rounded-full ${isRealTimeActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">1,247</p>
                <p className="text-slate-400 text-sm">Bids/sec</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-400">89</p>
                  <p className="text-slate-400 text-xs">Win Rate %</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">$2.34</p>
                  <p className="text-slate-400 text-xs">Avg Price</p>
                </div>
              </div>

              {/* Mini activity chart */}
              <div className="h-16 flex items-end justify-center space-x-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-400 rounded-t animate-pulse"
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Performance Radar */}
          <RadarChart
            data={performanceRadarData}
            title="DSP Performance Metrics"
            className="lg:col-span-1"
          />

          {/* Team/Campaign Managers */}
          <TeamCard 
            members={teamMembers} 
            title="Campaign Team"
          />
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
                      <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">{t('analytics.active_campaigns_performance')}</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => success('Filter opened', 'Advanced filters are now available')}
                  className="flex items-center space-x-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await exportData([], 'campaigns-performance', { format: 'csv' })
                      success('Campaign data exported', 'Performance report downloaded successfully')
                    } catch (err) {
                      error('Export failed', 'Could not export campaign data')
                    }
                  }}
                  disabled={isExporting}
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isExporting ? 'Exporting...' : t('analytics.export')}
                </button>
              </div>
            </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Campaign</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Impressions</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">CTR</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">CPC</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Conversions</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">ROAS</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Spend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Summer Sale - Electronics',
                    status: 'Active',
                    impressions: '2.4M',
                    ctr: '4.2%',
                    cpc: '$0.87',
                    conversions: '1,247',
                    roas: '4.8x',
                    spend: '$12,400'
                  },
                  {
                    name: 'Brand Awareness - Fashion',
                    status: 'Active',
                    impressions: '1.8M',
                    ctr: '3.1%',
                    cpc: '$1.24',
                    conversions: '892',
                    roas: '3.2x',
                    spend: '$8,900'
                  },
                  {
                    name: 'Retargeting - Travel',
                    status: 'Active',
                    impressions: '945K',
                    ctr: '5.7%',
                    cpc: '$2.15',
                    conversions: '456',
                    roas: '6.1x',
                    spend: '$15,600'
                  },
                  {
                    name: 'Mobile App Install',
                    status: 'Paused',
                    impressions: '1.2M',
                    ctr: '2.8%',
                    cpc: '$0.65',
                    conversions: '2,340',
                    roas: '2.9x',
                    spend: '$6,780'
                  }
                ].map((campaign, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">{campaign.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{campaign.impressions}</td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${
                        parseFloat(campaign.ctr) > 4 ? 'text-emerald-600' : 'text-slate-700'
                      }`}>
                        {campaign.ctr}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{campaign.cpc}</td>
                    <td className="py-4 px-4 text-slate-700">{campaign.conversions}</td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${
                        parseFloat(campaign.roas) > 4 ? 'text-emerald-600' : 'text-slate-700'
                      }`}>
                        {campaign.roas}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{campaign.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsPage