import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { analyticsApi } from '@services/dspApi'
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Target,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Settings2,
  Clock,
  Zap,
  AlertTriangle,
  Shield,
  Users,
  MapPin,
  Laptop
} from 'lucide-react'

import { PageHeader } from '@components/layout'
import { 
  LiveMetricsChart, 
  InteractiveAreaChart, 
  ModernGaugeChart, 
  HeatmapCalendar,
  RTBPerformanceChart,
  GeographicHeatmap,
  SimpleConversionFunnel,
  FraudDetectionInsights,
  DevicePerformanceBreakdown,
  CustomDashboardBuilder
} from '@components/charts'
import { Card, SelectDropdown } from '@components/ui'
import { useExport } from '@hooks/useExport'

// Types for DSP Analytics
interface DSPMetrics {
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpm: number
  conversions: number
  revenue: number
  roas: number
  winRate: number
  avgBidPrice: number
  bidsPerSecond: number
  qualityScore: number
}

interface TimeSeriesData {
  timestamp: string
  impressions: number
  clicks: number
  spend: number
  conversions: number
}

interface DevicePerformance {
  device: string
  impressions: number
  clicks: number
  ctr: number
  spend: number
  conversions: number
}

interface GeographicData {
  region: string
  country: string
  impressions: number
  clicks: number
  spend: number
  revenue: number
}

interface CampaignPerformance {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed'
  impressions: number
  clicks: number
  spend: number
  conversions: number
  ctr: number
  cpm: number
  roas: number
}

interface RTBMetrics {
  totalBids: number
  wonAuctions: number
  winRate: number
  avgWinPrice: number
  avgBidPrice: number
  bidsPerSecond: number
  topPublishers: Array<{ name: string; winRate: number; avgPrice: number }>
}

const DSPAnalyticsPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success, error, info } = useToast()
  const { exportData, isExporting } = useExport()

  // State
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all')
  const [selectedDevice, setSelectedDevice] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Data state
  const [overviewMetrics, setOverviewMetrics] = useState<DSPMetrics>({
    impressions: 2456789,
    clicks: 24567,
    spend: 45678.99,
    ctr: 1.23,
    cpm: 1.85,
    conversions: 1234,
    revenue: 78234.56,
    roas: 1.71,
    winRate: 23.4,
    avgBidPrice: 1.45,
    bidsPerSecond: 15467,
    qualityScore: 8.7
  })

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [devicePerformance, setDevicePerformance] = useState<DevicePerformance[]>([
    { device: 'Desktop', impressions: 1200000, clicks: 15000, ctr: 1.25, spend: 28000, conversions: 850 },
    { device: 'Mobile', impressions: 800000, clicks: 12000, ctr: 1.50, spend: 18000, conversions: 720 },
    { device: 'Tablet', impressions: 456789, clicks: 4567, ctr: 1.00, spend: 8678, conversions: 234 }
  ])

  const [geographicData, setGeographicData] = useState<GeographicData[]>([
    { region: 'North America', country: 'USA', impressions: 856789, clicks: 12456, spend: 23456, revenue: 45678 },
    { region: 'Europe', country: 'Germany', impressions: 645321, clicks: 8234, spend: 15678, revenue: 28934 },
    { region: 'Asia', country: 'Japan', impressions: 534567, clicks: 6789, spend: 12345, revenue: 23456 },
    { region: 'Europe', country: 'UK', impressions: 423456, clicks: 5432, spend: 9876, revenue: 18765 }
  ])

  const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance[]>([
    {
      id: '1',
      name: 'Black Friday Campaign',
      status: 'active',
      impressions: 567890,
      clicks: 8901,
      spend: 12345.67,
      conversions: 445,
      ctr: 1.57,
      cpm: 2.17,
      roas: 2.34
    },
    {
      id: '2',
      name: 'Brand Awareness Q4',
      status: 'active',
      impressions: 789012,
      clicks: 9876,
      spend: 15678.90,
      conversions: 523,
      ctr: 1.25,
      cpm: 1.99,
      roas: 1.89
    },
    {
      id: '3',
      name: 'Holiday Retargeting',
      status: 'paused',
      impressions: 345678,
      clicks: 4567,
      spend: 8901.23,
      conversions: 234,
      ctr: 1.32,
      cpm: 2.58,
      roas: 1.56
    }
  ])

  const [rtbMetrics, setRtbMetrics] = useState<RTBMetrics>({
    totalBids: 15467234,
    wonAuctions: 3621845,
    winRate: 23.4,
    avgWinPrice: 1.87,
    avgBidPrice: 1.45,
    bidsPerSecond: 15467,
    topPublishers: [
      { name: 'AdNetwork Pro', winRate: 34.5, avgPrice: 2.15 },
      { name: 'Premium Sites', winRate: 28.7, avgPrice: 2.45 },
      { name: 'Mobile Exchange', winRate: 25.2, avgPrice: 1.78 }
    ]
  })

  // Helper functions
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(2)}%`
  }

  const getChangeColor = (value: number): string => {
    return value > 0 ? 'text-emerald-600' : value < 0 ? 'text-red-500' : 'text-gray-500'
  }

  const getChangeIcon = (value: number) => {
    return value > 0 ? <TrendingUp className="w-4 h-4" /> : 
           value < 0 ? <TrendingDown className="w-4 h-4" /> : 
           <Activity className="w-4 h-4" />
  }

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Generate time series data
        const now = new Date()
        const days = parseInt(dateRange.replace('d', ''))
        const data: TimeSeriesData[] = []
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          data.push({
            timestamp: date.toISOString(),
            impressions: Math.floor(Math.random() * 100000) + 50000,
            clicks: Math.floor(Math.random() * 1000) + 500,
            spend: Math.random() * 5000 + 2000,
            conversions: Math.floor(Math.random() * 100) + 50
          })
        }
        
        setTimeSeriesData(data)
        setLoading(false)
      } catch (err) {
        error('Failed to load analytics data')
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange, selectedCampaign])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Update real-time metrics
      setOverviewMetrics(prev => ({
        ...prev,
        bidsPerSecond: Math.floor(Math.random() * 5000) + 10000,
        impressions: prev.impressions + Math.floor(Math.random() * 1000),
        clicks: prev.clicks + Math.floor(Math.random() * 10)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      await exportData(campaignPerformance, `dsp-analytics-${dateRange}`, { format })
      success(`Report exported in ${format.toUpperCase()} format`)
    } catch (err) {
      error('Failed to export data')
    }
  }

  const MetricCard: React.FC<{
    title: string
    value: string | number
    change?: number
    icon: React.ComponentType<any>
    iconColor: string
    trend?: 'up' | 'down' | 'stable'
  }> = ({ title, value, change, icon: Icon, iconColor, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${getChangeColor(change)}`}>
            {getChangeIcon(change)}
            <span className="text-xs sm:text-sm font-medium">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">
        {typeof value === 'number' ? formatNumber(value) : value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600">{title}</div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Панель аналитики DSP"
        subtitle="Аналитика производительности в реальном времени и метрики кампаний"
        actionButton={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-md ${
                autoRefresh
                  ? 'bg-white/30 text-slate-900 border border-white/30 shadow-sm'
                  : 'bg-white/20 text-gray-700 border border-white/20 hover:bg-white/30'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{autoRefresh ? 'Live' : 'Paused'}</span>
              <span className="sm:hidden">{autoRefresh ? 'Live' : 'Paused'}</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg w-full sm:w-auto">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-md border border-white/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 min-w-[140px]">
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50/50 rounded-t-lg transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50/50 rounded-b-lg transition-colors"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        }
      />

      <div className="max-w-7xl xxl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xxl:px-16 pb-6 space-y-6">
        {/* Filters */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg relative z-50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Time Range:</span>
            </div>
            
            {/* Mobile: 2x2 grid, Desktop: horizontal */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <div className="relative z-[999999]">
                <SelectDropdown
                  options={[
                    { value: '1d', label: 'Last 24 hours' },
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 3 months' }
                  ]}
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Select time range"
                />
              </div>

              <div className="relative z-[999998]">
                <SelectDropdown
                  options={[
                    { value: 'all', label: 'All Campaigns' },
                    ...campaignPerformance.map(c => ({ value: c.id, label: c.name }))
                  ]}
                  value={selectedCampaign}
                  onChange={setSelectedCampaign}
                  placeholder="Select campaign"
                />
              </div>

              <div className="relative z-[999997]">
                <SelectDropdown
                  options={[
                    { value: 'all', label: 'All Devices' },
                    { value: 'desktop', label: 'Desktop' },
                    { value: 'mobile', label: 'Mobile' },
                    { value: 'tablet', label: 'Tablet' }
                  ]}
                  value={selectedDevice}
                  onChange={setSelectedDevice}
                  placeholder="Select device"
                />
              </div>

              <div className="relative z-[999996]">
                <SelectDropdown
                  options={[
                    { value: 'all', label: 'All Regions' },
                    { value: 'na', label: 'North America' },
                    { value: 'eu', label: 'Europe' },
                    { value: 'asia', label: 'Asia' }
                  ]}
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  placeholder="Select region"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          <MetricCard
            title="Total Impressions"
            value={overviewMetrics.impressions}
            change={12.5}
            icon={Eye}
            iconColor="bg-blue-500"
            trend="up"
          />
          <MetricCard
            title="Total Clicks"
            value={overviewMetrics.clicks}
            change={8.2}
            icon={MousePointer}
            iconColor="bg-emerald-500"
            trend="up"
          />
          <MetricCard
            title="Total Spend"
            value={formatCurrency(overviewMetrics.spend)}
            change={-2.1}
            icon={DollarSign}
            iconColor="bg-orange-500"
            trend="down"
          />
          <MetricCard
            title="CTR"
            value={formatPercentage(overviewMetrics.ctr)}
            change={5.7}
            icon={Target}
            iconColor="bg-purple-500"
            trend="up"
          />
          <MetricCard
            title="CPM"
            value={formatCurrency(overviewMetrics.cpm)}
            change={-1.8}
            icon={BarChart3}
            iconColor="bg-indigo-500"
            trend="down"
          />
          <MetricCard
            title="ROAS"
            value={`${overviewMetrics.roas.toFixed(2)}x`}
            change={15.3}
            icon={TrendingUp}
            iconColor="bg-emerald-600"
            trend="up"
          />
        </div>

        {/* Real-time RTB Metrics */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Real-time Bidding Performance</h3>
              <p className="text-sm text-gray-600">Live auction metrics and bidding statistics</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-slate-700" />
                <span className="text-sm text-slate-700 font-medium">Live</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatNumber(rtbMetrics.bidsPerSecond)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Bids per second</div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-slate-700" />
                <span className="text-sm text-slate-700 font-medium">+2.1%</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatPercentage(rtbMetrics.winRate)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Win rate</div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-slate-700" />
                <span className="text-sm text-slate-700 font-medium">-0.8%</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatCurrency(rtbMetrics.avgWinPrice)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avg win price</div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-slate-700" />
                <span className="text-sm text-slate-700 font-medium">-1.2%</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatCurrency(rtbMetrics.avgBidPrice)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avg bid price</div>
            </div>
          </div>
        </div>

        {/* Live Metrics Chart */}
        <LiveMetricsChart title="Real-time Campaign Performance" className="col-span-full" />

        {/* RTB Performance Chart */}
        <RTBPerformanceChart title="Real-time Bidding Analytics" className="col-span-full" />

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Performance Over Time */}
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
                <p className="text-sm text-gray-600">Impressions and clicks over time</p>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            
            <div className="w-full">
              <InteractiveAreaChart
                data={timeSeriesData.map(item => ({
                  date: new Date(item.timestamp),
                  impressions: item.impressions,
                  clicks: item.clicks
                }))}
                title=""
                width={Math.min(600, window?.innerWidth - 200) || 600}
                height={300}
                className="border-0 shadow-none p-0 w-full"
              />
            </div>
          </div>

          {/* Device Performance */}
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Device Performance</h3>
                <p className="text-sm text-gray-600">Performance breakdown by device type</p>
              </div>
              <Smartphone className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              {devicePerformance.map((device, index) => (
                <motion.div
                  key={device.device}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 sm:p-4 bg-white/30 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors border border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      {device.device === 'Desktop' && <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
                      {device.device === 'Mobile' && <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
                      {device.device === 'Tablet' && <Laptop className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{device.device}</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {formatNumber(device.impressions)} impressions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatPercentage(device.ctr)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">CTR</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Performance Heatmap */}
        <GeographicHeatmap
          data={geographicData.map(geo => ({
            ...geo,
            countryCode: geo.country.substring(0, 2).toUpperCase(),
            ctr: (geo.clicks / geo.impressions) * 100,
            roas: geo.revenue / geo.spend,
            coordinates: { lat: 0, lng: 0 } // Mock coordinates
          }))}
          title="Geographic Performance Analysis"
          className="col-span-full"
        />

        {/* Conversion Funnel */}
        <SimpleConversionFunnel
          title="Воронка конверсии кампании"
          className="col-span-full"
        />

        {/* Fraud Detection Insights */}
        <FraudDetectionInsights
          title="Fraud Detection & Quality Control"
          className="col-span-full"
        />

        {/* Device Performance Breakdown */}
        <DevicePerformanceBreakdown
          title="Device, Browser & OS Performance"
          className="col-span-full"
        />

        {/* Custom Dashboard Builder */}
        <CustomDashboardBuilder
          title="Custom Dashboard Builder"
          className="col-span-full"
          onSave={(dashboard) => {
            success(`Dashboard "${dashboard.name}" saved successfully!`)
            info('Dashboard customization feature allows you to create personalized views')
          }}
        />

        {/* Campaign Performance Table */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
              <p className="text-sm text-gray-600">Detailed performance metrics for active campaigns</p>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all campaigns
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Impressions</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Clicks</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">CTR</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Spend</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {campaignPerformance.map((campaign, index) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : campaign.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">{formatNumber(campaign.impressions)}</td>
                    <td className="py-4 px-4 text-right font-medium">{formatNumber(campaign.clicks)}</td>
                    <td className="py-4 px-4 text-right font-medium">{formatPercentage(campaign.ctr)}</td>
                    <td className="py-4 px-4 text-right font-medium">{formatCurrency(campaign.spend)}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-medium ${campaign.roas > 2 ? 'text-emerald-600' : campaign.roas > 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {campaign.roas.toFixed(2)}x
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DSPAnalyticsPage
