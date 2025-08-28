import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  Monitor, 
  Laptop, 
  Tablet,
  Globe,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  BarChart3
} from 'lucide-react'

interface DeviceData {
  device: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
  impressions: number
  clicks: number
  spend: number
  conversions: number
  ctr: number
  cpm: number
  conversionRate: number
  marketShare: number
}

interface BrowserData {
  browser: string
  version: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  conversionRate: number
  bounceRate: number
  avgSessionDuration: number
  marketShare: number
}

interface OSData {
  os: string
  version: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  conversionRate: number
  marketShare: number
  performance: 'excellent' | 'good' | 'average' | 'poor'
}

interface DevicePerformanceBreakdownProps {
  title: string
  className?: string
  defaultView?: 'devices' | 'browsers' | 'os'
}

const DevicePerformanceBreakdown: React.FC<DevicePerformanceBreakdownProps> = ({
  title,
  className = "",
  defaultView = 'devices'
}) => {
  const [activeView, setActiveView] = useState<'devices' | 'browsers' | 'os'>(defaultView)
  const [sortBy, setSortBy] = useState<string>('impressions')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const deviceData: DeviceData[] = [
    {
      device: 'iPhone 15 Pro',
      deviceType: 'mobile',
      impressions: 856734,
      clicks: 12456,
      spend: 23450.67,
      conversions: 834,
      ctr: 1.45,
      cpm: 2.74,
      conversionRate: 6.7,
      marketShare: 23.4
    },
    {
      device: 'Samsung Galaxy S24',
      deviceType: 'mobile',
      impressions: 734521,
      clicks: 9876,
      spend: 18976.43,
      conversions: 567,
      ctr: 1.34,
      cpm: 2.58,
      conversionRate: 5.7,
      marketShare: 19.8
    },
    {
      device: 'MacBook Pro',
      deviceType: 'desktop',
      impressions: 567890,
      clicks: 8901,
      spend: 15678.90,
      conversions: 745,
      ctr: 1.57,
      cpm: 1.76,
      conversionRate: 8.4,
      marketShare: 15.3
    },
    {
      device: 'iPad Pro',
      deviceType: 'tablet',
      impressions: 345678,
      clicks: 5234,
      spend: 9876.54,
      conversions: 423,
      ctr: 1.51,
      cpm: 2.86,
      conversionRate: 8.1,
      marketShare: 9.4
    },
    {
      device: 'Windows Desktop',
      deviceType: 'desktop',
      impressions: 456789,
      clicks: 6789,
      spend: 12345.67,
      conversions: 512,
      ctr: 1.49,
      cpm: 1.81,
      conversionRate: 7.5,
      marketShare: 12.3
    }
  ]

  const browserData: BrowserData[] = [
    {
      browser: 'Chrome',
      version: '120.0',
      impressions: 1234567,
      clicks: 18904,
      spend: 34567.89,
      ctr: 1.53,
      conversionRate: 7.2,
      bounceRate: 34.5,
      avgSessionDuration: 245,
      marketShare: 42.3
    },
    {
      browser: 'Safari',
      version: '17.2',
      impressions: 876543,
      clicks: 12456,
      spend: 23456.78,
      ctr: 1.42,
      conversionRate: 6.8,
      bounceRate: 31.2,
      avgSessionDuration: 267,
      marketShare: 28.7
    },
    {
      browser: 'Firefox',
      version: '121.0',
      impressions: 456789,
      clicks: 6789,
      spend: 12345.67,
      ctr: 1.49,
      conversionRate: 6.2,
      bounceRate: 38.9,
      avgSessionDuration: 198,
      marketShare: 15.6
    },
    {
      browser: 'Edge',
      version: '120.0',
      impressions: 234567,
      clicks: 3456,
      spend: 6789.01,
      ctr: 1.47,
      conversionRate: 5.9,
      bounceRate: 42.1,
      avgSessionDuration: 187,
      marketShare: 8.9
    },
    {
      browser: 'Opera',
      version: '105.0',
      impressions: 123456,
      clicks: 1789,
      spend: 3456.78,
      ctr: 1.45,
      conversionRate: 5.4,
      bounceRate: 45.3,
      avgSessionDuration: 156,
      marketShare: 4.5
    }
  ]

  const osData: OSData[] = [
    {
      os: 'iOS',
      version: '17.2',
      impressions: 1345678,
      clicks: 19567,
      spend: 35678.90,
      ctr: 1.45,
      conversionRate: 7.8,
      marketShare: 38.9,
      performance: 'excellent'
    },
    {
      os: 'Android',
      version: '14.0',
      impressions: 1123456,
      clicks: 15234,
      spend: 28976.54,
      ctr: 1.36,
      conversionRate: 6.4,
      marketShare: 35.2,
      performance: 'good'
    },
    {
      os: 'Windows',
      version: '11',
      impressions: 567890,
      clicks: 8456,
      spend: 16789.01,
      ctr: 1.49,
      conversionRate: 7.1,
      marketShare: 16.7,
      performance: 'good'
    },
    {
      os: 'macOS',
      version: '14.2',
      impressions: 234567,
      clicks: 3678,
      spend: 7234.56,
      ctr: 1.57,
      conversionRate: 8.9,
      marketShare: 6.8,
      performance: 'excellent'
    },
    {
      os: 'Linux',
      version: 'Various',
      impressions: 89012,
      clicks: 1234,
      spend: 2345.67,
      ctr: 1.39,
      conversionRate: 5.8,
      marketShare: 2.4,
      performance: 'average'
    }
  ]

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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getDeviceIcon = (deviceType: string, device: string) => {
    if (device.includes('iPhone') || device.includes('Samsung') || deviceType === 'mobile') {
      return Smartphone
    }
    if (device.includes('iPad') || deviceType === 'tablet') {
      return Tablet
    }
    if (device.includes('MacBook')) {
      return Laptop
    }
    if (device.includes('Desktop')) {
      return Monitor
    }
    return Monitor
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'average': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'poor': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const SortableHeader: React.FC<{ field: string; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortBy === field && (
          <span className="text-gray-400">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  )

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Detailed performance analysis by device, browser, and OS</p>
        </div>
        
        {/* View Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/20 gap-1 sm:gap-0">
          {[
            { key: 'devices' as const, label: 'Devices', icon: Smartphone },
            { key: 'browsers' as const, label: 'Browsers', icon: Globe },
            { key: 'os' as const, label: 'OS', icon: Monitor }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all w-full sm:w-auto ${
                activeView === key
                  ? 'bg-white/30 text-gray-900 shadow-sm border border-white/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'devices' && (
          <motion.div
            key="devices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Device</th>
                    <SortableHeader field="impressions">Impressions</SortableHeader>
                    <SortableHeader field="clicks">Clicks</SortableHeader>
                    <SortableHeader field="ctr">CTR</SortableHeader>
                    <SortableHeader field="spend">Spend</SortableHeader>
                    <SortableHeader field="conversionRate">Conv. Rate</SortableHeader>
                    <SortableHeader field="marketShare">Market Share</SortableHeader>
                  </tr>
                </thead>
                <tbody>
                  {deviceData
                    .sort((a, b) => {
                      const aVal = a[sortBy as keyof DeviceData] as number
                      const bVal = b[sortBy as keyof DeviceData] as number
                      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
                    })
                    .map((device, index) => {
                      const DeviceIcon = getDeviceIcon(device.deviceType, device.device)
                      return (
                        <motion.tr
                          key={device.device}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                device.deviceType === 'mobile' ? 'bg-blue-100 text-blue-600' :
                                device.deviceType === 'tablet' ? 'bg-purple-100 text-purple-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                <DeviceIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{device.device}</div>
                                <div className="text-sm text-gray-500 capitalize">{device.deviceType}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium">{formatNumber(device.impressions)}</td>
                          <td className="py-4 px-4 font-medium">{formatNumber(device.clicks)}</td>
                          <td className="py-4 px-4 font-medium">{device.ctr.toFixed(2)}%</td>
                          <td className="py-4 px-4 font-medium">{formatCurrency(device.spend)}</td>
                          <td className="py-4 px-4 font-medium">{device.conversionRate.toFixed(1)}%</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(device.marketShare, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {device.marketShare.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeView === 'browsers' && (
          <motion.div
            key="browsers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Browser</th>
                    <SortableHeader field="impressions">Impressions</SortableHeader>
                    <SortableHeader field="ctr">CTR</SortableHeader>
                    <SortableHeader field="conversionRate">Conv. Rate</SortableHeader>
                    <SortableHeader field="bounceRate">Bounce Rate</SortableHeader>
                    <SortableHeader field="avgSessionDuration">Avg. Session</SortableHeader>
                    <SortableHeader field="marketShare">Market Share</SortableHeader>
                  </tr>
                </thead>
                <tbody>
                  {browserData
                    .sort((a, b) => {
                      const aVal = a[sortBy as keyof BrowserData] as number
                      const bVal = b[sortBy as keyof BrowserData] as number
                      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
                    })
                    .map((browser, index) => (
                      <motion.tr
                        key={browser.browser}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              browser.browser === 'Chrome' ? 'bg-yellow-100 text-yellow-600' :
                              browser.browser === 'Safari' ? 'bg-blue-100 text-blue-600' :
                              browser.browser === 'Firefox' ? 'bg-orange-100 text-orange-600' :
                              browser.browser === 'Edge' ? 'bg-blue-100 text-blue-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{browser.browser}</div>
                              <div className="text-sm text-gray-500">v{browser.version}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium">{formatNumber(browser.impressions)}</td>
                        <td className="py-4 px-4 font-medium">{browser.ctr.toFixed(2)}%</td>
                        <td className="py-4 px-4 font-medium">{browser.conversionRate.toFixed(1)}%</td>
                        <td className="py-4 px-4 font-medium">{browser.bounceRate.toFixed(1)}%</td>
                        <td className="py-4 px-4 font-medium">{formatDuration(browser.avgSessionDuration)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${Math.min(browser.marketShare, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {browser.marketShare.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeView === 'os' && (
          <motion.div
            key="os"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Operating System</th>
                    <SortableHeader field="impressions">Impressions</SortableHeader>
                    <SortableHeader field="ctr">CTR</SortableHeader>
                    <SortableHeader field="conversionRate">Conv. Rate</SortableHeader>
                    <SortableHeader field="marketShare">Market Share</SortableHeader>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {osData
                    .sort((a, b) => {
                      const aVal = a[sortBy as keyof OSData] as number
                      const bVal = b[sortBy as keyof OSData] as number
                      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
                    })
                    .map((os, index) => (
                      <motion.tr
                        key={os.os}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              os.os === 'iOS' ? 'bg-gray-100 text-gray-600' :
                              os.os === 'Android' ? 'bg-green-100 text-green-600' :
                              os.os === 'Windows' ? 'bg-blue-100 text-blue-600' :
                              os.os === 'macOS' ? 'bg-gray-100 text-gray-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              <Monitor className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{os.os}</div>
                              <div className="text-sm text-gray-500">v{os.version}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium">{formatNumber(os.impressions)}</td>
                        <td className="py-4 px-4 font-medium">{os.ctr.toFixed(2)}%</td>
                        <td className="py-4 px-4 font-medium">{os.conversionRate.toFixed(1)}%</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${Math.min(os.marketShare, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {os.marketShare.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getPerformanceColor(os.performance)}`}>
                            {os.performance}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activeView === 'devices' ? deviceData.length :
               activeView === 'browsers' ? browserData.length :
               osData.length}
            </div>
            <div className="text-sm text-gray-600">Total {activeView}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {activeView === 'devices' ? 
                (deviceData.reduce((sum, d) => sum + d.ctr, 0) / deviceData.length).toFixed(2) + '%' :
               activeView === 'browsers' ?
                (browserData.reduce((sum, d) => sum + d.ctr, 0) / browserData.length).toFixed(2) + '%' :
                (osData.reduce((sum, d) => sum + d.ctr, 0) / osData.length).toFixed(2) + '%'
              }
            </div>
            <div className="text-sm text-gray-600">Avg CTR</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {activeView === 'devices' ? 
                (deviceData.reduce((sum, d) => sum + d.conversionRate, 0) / deviceData.length).toFixed(1) + '%' :
               activeView === 'browsers' ?
                (browserData.reduce((sum, d) => sum + d.conversionRate, 0) / browserData.length).toFixed(1) + '%' :
                (osData.reduce((sum, d) => sum + d.conversionRate, 0) / osData.length).toFixed(1) + '%'
              }
            </div>
            <div className="text-sm text-gray-600">Avg Conv. Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(
                activeView === 'devices' ? 
                  deviceData.reduce((sum, d) => sum + d.spend, 0) :
                activeView === 'browsers' ?
                  browserData.reduce((sum, d) => sum + d.spend, 0) :
                  osData.reduce((sum, d) => sum + d.spend, 0)
              )}
            </div>
            <div className="text-sm text-gray-600">Total Spend</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DevicePerformanceBreakdown
