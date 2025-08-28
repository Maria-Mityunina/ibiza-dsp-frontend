import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  DollarSign,
  Target,
  Users, 
  Activity,
  Clock,
  Award,
  RefreshCw,
  Settings,
  Download,
  Calendar,
  ChevronDown,
  MoreVertical,
  Star,
  CheckCircle,
  Edit,
  Chrome,
  Wifi,
  Database,
  Server,
  Laptop,
  Package,
  ShoppingBag,
  CreditCard
} from 'lucide-react'

import { PageHeader } from '@components/layout'
import { useExport } from '@hooks/useExport'

// Types
interface KPICard {
  id: string
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<any>
  chartData: number[]
}

interface TodoItem {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate: string
}

interface Transaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  date: string
  icon: string
  color: string
}

const AnalyticsPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success, error, info, warning } = useToast()
  const { exportData, isExporting } = useExport()

  // KPI Data
  const [kpiData] = useState<KPICard[]>([
    {
      id: 'followers',
      title: 'Total Followers',
      value: 12432,
      change: 0.892,
      trend: 'up',
      icon: Users,
      chartData: [30, 45, 35, 50, 40, 60, 45, 55]
    },
    {
      id: 'bounce',
      title: 'Bounce Rate',
      value: 12432,
      change: 0.892,
      trend: 'up',
      icon: TrendingUp,
      chartData: [20, 35, 25, 40, 30, 50, 35, 45]
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: 12432,
      change: 0.892,
      trend: 'up',
      icon: Target,
      chartData: [40, 25, 45, 30, 50, 35, 60, 40]
    },
    {
      id: 'session',
      title: 'Session Duration',
      value: '3hrs',
      change: 0.892,
      trend: 'up',
      icon: Clock,
      chartData: [35, 50, 30, 60, 40, 55, 30, 65]
    }
  ])

  // Browser Data
  const browserData = [
    { name: 'Chrome', sessions: 23379, change: 5.37, color: '#4A5568' },
    { name: 'Safari', sessions: 20937, change: 1.74, color: '#718096' },
    { name: 'Opera', sessions: 20848, change: -11.43, color: '#A0AEC0' },
    { name: 'Firefox', sessions: 18120, change: 7.61, color: '#CBD5E0' },
    { name: 'Edge', sessions: 14986, change: -1.14, color: '#E2E8F0' }
  ]

  // Countries Data
  const countriesData = [
    { name: 'United States', visitors: 32190, flag: '🇺🇸' },
    { name: 'Argentina', visitors: 8798, flag: '🇦🇷' },
    { name: 'Canada', visitors: 16885, flag: '🇨🇦' },
    { name: 'India', visitors: 14885, flag: '🇮🇳' },
    { name: 'Italy', visitors: 17578, flag: '🇮🇹' },
    { name: 'Germany', visitors: 10118, flag: '🇩🇪' }
  ]

  // Monthly Chart Data
  const monthlyData = [
    { month: 'Jan', orders: 32, sales: 31, profit: 38 },
    { month: 'Feb', orders: 20, sales: 35, profit: 42 },
    { month: 'Mar', orders: 31, sales: 37, profit: 35 },
    { month: 'Apr', orders: 37, sales: 30, profit: 48 },
    { month: 'May', orders: 23, sales: 45, profit: 40 },
    { month: 'Jun', orders: 31, sales: 47, profit: 52 },
    { month: 'Jul', orders: 45, sales: 29, profit: 45 },
    { month: 'Aug', orders: 30, sales: 30, profit: 38 },
    { month: 'Sep', orders: 54, sales: 32, profit: 45 },
    { month: 'Oct', orders: 31, sales: 20, profit: 52 },
    { month: 'Nov', orders: 18, sales: 37, profit: 42 },
    { month: 'Dec', orders: 37, sales: 35, profit: 48 }
  ]

  // Activity Data
  const activityData = [
    { label: 'Total Visits', value: 23124, change: 1.75, trend: 'up' },
    { label: 'Total Products', value: '1.3k', change: -0.85, trend: 'down' },
    { label: 'Total Sales', value: '23.89k', change: 3.74, trend: 'up' },
    { label: 'Total Revenue', value: '$187.38k', change: 0.23, trend: 'up' },
    { label: 'Total Profit', value: '$84.33k', change: -4.95, trend: 'down' },
    { label: 'Total Income', value: '$983k', change: 1.75, trend: 'up' }
  ]

  // Todo Items
  const [todoItems, setTodoItems] = useState<TodoItem[]>([
    { id: '1', title: 'Finish Presentation Slides', completed: false, priority: 'high', dueDate: 'May 29, 2024' },
    { id: '2', title: 'Send Follow-up Emails', completed: false, priority: 'medium', dueDate: 'May 27, 2024' },
    { id: '3', title: 'Research New Software', completed: false, priority: 'low', dueDate: 'May 30, 2024' },
    { id: '4', title: 'Schedule Training Session', completed: false, priority: 'medium', dueDate: 'May 29, 2024' },
    { id: '5', title: 'Update Task Board', completed: true, priority: 'low', dueDate: 'May 27, 2024' }
  ])

  // Transactions
  const transactionsData: Transaction[] = [
    { id: '1', type: 'expense', description: 'Swift Ads', amount: 500, date: 'May 25, 2024', icon: 'S', color: '#EF4444' },
    { id: '2', type: 'expense', description: 'Eco Build', amount: 200, date: 'May 24, 2024', icon: 'E', color: '#F97316' },
    { id: '3', type: 'income', description: 'Health Track', amount: 1000, date: 'May 23, 2024', icon: 'H', color: '#10B981' },
    { id: '4', type: 'expense', description: 'Solar Grid', amount: 300, date: 'May 22, 2024', icon: 'S', color: '#3B82F6' },
    { id: '5', type: 'income', description: 'Data Stream', amount: 700, date: 'May 19, 2024', icon: 'D', color: '#8B5CF6' }
  ]

  // Helper Functions
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num)
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-600" />
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />
    return null
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  // Event Handlers
  const handleTodoToggle = (id: string) => {
    setTodoItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
    success('Задача обновлена')
  }

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      await exportData(activityData, `analytics-dashboard-report`, { format })
      success(`Отчет экспортирован в формате ${format.toUpperCase()}`)
    } catch (err) {
      error('Ошибка при экспорте данных')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Analytics"
        actionButton={
          <div className="flex items-center gap-3">
            {/* Plan Upgrade Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
              <Star className="w-4 h-4" />
              Plan Upgrade
            </button>

            {/* Export Report Button */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 min-w-[140px]">
          <button 
                  onClick={() => handleExport('csv')}
                  className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-colors"
                >
                  Export CSV
          </button>
            <button 
                  onClick={() => handleExport('xlsx')}
                  className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Export Excel
            </button>
            <button 
                  onClick={() => handleExport('pdf')}
                  className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-xl transition-colors"
                >
                  Export PDF
            </button>
          </div>
        </div>
          </div>
        }
      />

      <div className="pb-6 space-y-6">
                {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Dashboards</span>
          <ChevronDown className="w-4 h-4 transform rotate-[-90deg]" />
          <span className="text-gray-900 font-medium">Analytics</span>
        </div>

                {/* Top KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                  <kpi.icon className="w-6 h-6" />
              </div>
              <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(kpi.trend)}
                    <span className={`font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 
                      kpi.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      +{kpi.change}%
                    </span>
                </div>
                  <p className="text-xs text-gray-500 mt-1">Increased</p>
              </div>
            </div>
            
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value}
                </p>
                
                {/* Mini Chart */}
                <div className="flex items-end justify-between h-8 gap-1">
                  {kpi.chartData.map((value, i) => (
                <div
                  key={i}
                      className="flex-1 bg-gray-200 rounded-t hover:bg-gray-400 transition-colors cursor-pointer"
                      style={{ height: `${value}%` }}
                      onClick={() => info(`${kpi.title}: ${value}%`)}
                />
              ))}
                </div>
            </div>
            </motion.div>
          ))}
          </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Duration Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
                <div>
                <h3 className="text-lg font-semibold text-gray-900">Session Duration By Users</h3>
                <div className="flex items-center gap-6 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-gray-600">Orders</span>
                </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600">Sales</span>
              </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-gray-600">Profit</span>
                </div>
              </div>
              </div>
              <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
            
            {/* Chart */}
            <div className="h-80 relative">
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1 h-60">
                      <div className="flex items-end gap-1 h-48">
                        <div 
                          className="w-3 bg-gray-600 rounded-t hover:bg-gray-700 transition-colors cursor-pointer"
                          style={{ height: `${(data.orders / 70) * 100}%` }}
                          onClick={() => info(`Orders: ${data.orders}`)}
                        />
                        <div 
                          className="w-3 bg-gray-400 rounded-t hover:bg-gray-500 transition-colors cursor-pointer"
                          style={{ height: `${(data.sales / 50) * 100}%` }}
                          onClick={() => info(`Sales: ${data.sales}`)}
                        />
                        <div 
                          className="w-3 bg-red-400 rounded-t hover:bg-red-500 transition-colors cursor-pointer"
                          style={{ height: `${(data.profit / 60) * 100}%` }}
                          onClick={() => info(`Profit: ${data.profit}`)}
                        />
                      </div>
                      
                      {/* Trend Line */}
                      <div className="relative w-full h-12">
                        <svg className="w-full h-full" viewBox="0 0 40 40">
                          <polyline
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2"
                            strokeDasharray="3,3"
                            points={`0,${40 - (data.profit / 60) * 40} 20,${40 - (data.sales / 50) * 40} 40,${40 - (data.orders / 70) * 40}`}
                          />
                        </svg>
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Visitors Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Visitors</h3>

            {/* Circular Progress */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                <circle
                  cx="80" cy="80" r="70" stroke="#6B7280" strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0.85)}`}
                  className="transition-all duration-1000"
                />
                <circle
                  cx="80" cy="80" r="70" stroke="#EF4444" strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 70 * 0.15} ${2 * Math.PI * 70}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">219,147</div>
                  <div className="text-sm text-gray-500">Total Visitors</div>
                </div>
                </div>
              </div>

            {/* Legend */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Online visitors</span>
                </div>
                <span className="text-sm font-bold text-gray-900">1,86,758</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Offline visitors</span>
                </div>
                <span className="text-sm font-bold text-gray-900">32,389</span>
              </div>
            </div>
            
            {/* Audience Report */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-bold text-gray-900">12,890</div>
                  <div className="text-sm text-gray-600">Currently active now</div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">10.5%</span>
                </div>
              </div>
              
              <div className="h-8 flex items-end justify-between gap-px">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gray-300 rounded-t"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sessions Duration By Time Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions Duration By Time</h3>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
                <div key={day} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day}</div>
                  <div className="space-y-1">
                    {Array.from({ length: 6 }, (_, hourIndex) => {
                      const intensity = Math.random()
                      return (
                        <div
                          key={hourIndex}
                          className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            backgroundColor: intensity > 0.7 ? '#374151' : 
                                           intensity > 0.4 ? '#6B7280' : 
                                           intensity > 0.2 ? '#9CA3AF' : '#E5E7EB'
                          }}
                          onClick={() => info(`${day} ${hourIndex * 4}:00 - Activity: ${Math.round(intensity * 100)}%`)}
                        />
                      )
                    })}
                </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>12Am</span>
              <span>6Am</span>
              <span>12Pm</span>
              <span>6Pm</span>
            </div>
          </motion.div>

          {/* Browser Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Browser Usage</h3>
            
            <div className="space-y-4">
              {browserData.map((browser, index) => (
                <div
                  key={browser.name}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer"
                  onClick={() => success(`${browser.name}: ${formatNumber(browser.sessions)} sessions`)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: browser.color }}
                    >
                      {browser.name.charAt(0)}
        </div>
                    <span className="text-sm font-medium text-gray-900">{browser.name}</span>
      </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {formatNumber(browser.sessions)}
              </div>
                    <div className={`text-xs flex items-center gap-1 ${
                      browser.change > 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {browser.change > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{browser.change > 0 ? '+' : ''}{browser.change}%</span>
            </div>
              </div>
            </div>
              ))}
            </div>
          </motion.div>

          {/* Sessions By Country */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sessions By Country</h3>
            
            <div className="space-y-4 mb-6">
              {['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'United States', 'China'].map((country, index) => {
                const value = (index + 1) * 15 + Math.random() * 20
                return (
                  <div key={country} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-500 text-right">{country}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gray-600 h-2 rounded-full transition-all duration-500 hover:bg-gray-700 cursor-pointer"
                        style={{ width: `${value}%` }}
                        onClick={() => info(`${country}: ${Math.round(value)}% sessions`)}
                      />
              </div>
            </div>
                )
              })}
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>200</span>
              <span>400</span>
              <span>600</span>
              <span>800</span>
              <span>1000</span>
              <span>1200</span>
              </div>
          </motion.div>

          {/* Visitors By Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Visitors By Countries</h3>
              <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                View All
              </button>
              </div>
            
            <div className="space-y-4">
              {countriesData.map((country, index) => (
                <div
                  key={country.name}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer"
                  onClick={() => info(`${country.name}: ${formatNumber(country.visitors)} visitors`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm font-medium text-gray-900">{country.name}</span>
              </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formatNumber(country.visitors)}
                  </span>
            </div>
              ))}
            </div>
          </motion.div>
      </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Earnings & Cost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Earnings</div>
                  <div className="text-2xl font-bold text-gray-900">$12,563.50</div>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    0.15%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-400 rounded-xl flex items-center justify-center text-white">
                  <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                  <div className="text-sm text-gray-600">Cost</div>
                  <div className="text-2xl font-bold text-gray-900">$6,156.38</div>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    2.50%
                  </div>
                </div>
                </div>
              </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                      <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                      <div className="text-sm text-gray-600">Productivity</div>
                      <div className="text-lg font-bold text-gray-900">$95.5M</div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        4.77%
                  </div>
                </div>
                </div>
              </div>

                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <Clock className="w-4 h-4" />
                  </div>
                  <div>
                      <div className="text-sm text-gray-600">Total Time On Project</div>
                      <div className="text-lg font-bold text-gray-900">148:00h</div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        3.36%
                  </div>
                </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Project categories</h3>
              <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Total number of projects</span>
                <span className="font-bold text-gray-900">18,643</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                <div className="bg-gray-600 h-full" style={{ width: '42.34%' }} />
                <div className="bg-red-400 h-full" style={{ width: '13%' }} />
                <div className="bg-green-500 h-full" style={{ width: '32%' }} />
                <div className="bg-blue-500 h-full" style={{ width: '12.66%' }} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">UI Projects</span>
                  <span className="text-sm font-medium text-green-600">(42.34%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">UX Projects</span>
                  <span className="text-sm font-medium text-red-500">(13%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Finance</span>
                  <span className="text-sm font-medium text-green-600">(32%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Banking</span>
                  <span className="text-sm font-medium text-blue-600">(22.46%)</span>
                </div>
              </div>
            </div>

            {/* Project Statistics */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                  <div className="text-lg font-bold text-gray-900">166 ↑</div>
                  <div className="text-xs text-gray-500">Active Projects</div>
                  <div className="text-xs text-green-600">+0.9%</div>
                  <div className="text-xs text-gray-400">More Projects are yet to start</div>
                    </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">538 ↑</div>
                  <div className="text-xs text-gray-500">Completed Projects</div>
                  <div className="text-xs text-green-600">+0.39%</div>
                  <div className="text-xs text-gray-400">32 Completed this year</div>
                  </div>
                <div>
                  <div className="text-lg font-bold text-red-500">$32,124.00 ↑</div>
                  <div className="text-xs text-gray-500">Project Revenue</div>
                  <div className="text-xs text-red-500">-0.15%</div>
                  <div className="text-xs text-gray-400">Reached yearly target</div>
                  </div>
              </div>

              {/* Chart */}
              <div className="h-32 flex items-end justify-between">
                {monthlyData.slice(0, 12).map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center gap-1">
                    <div className="flex flex-col items-end gap-px">
                      <div 
                        className="w-3 bg-gray-600 rounded-t hover:bg-gray-700 transition-colors cursor-pointer"
                        style={{ height: `${(data.orders / 70) * 80}px` }}
                        onClick={() => info(`Active Projects: ${data.orders}`)}
                      />
                      <div 
                        className="w-3 bg-gray-300 rounded-t hover:bg-gray-400 transition-colors cursor-pointer"
                        style={{ height: `${(data.sales / 50) * 80}px` }}
                        onClick={() => info(`Completed Projects: ${data.sales}`)}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
              </div>
            </div>
          </motion.div>

          {/* To-Do List & Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* To-Do List */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">To-Do List</h3>
              
              <div className="space-y-3">
                {todoItems.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer ${
                      todo.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleTodoToggle(todo.id)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      todo.completed 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {todo.completed && <CheckCircle className="w-3 h-3" />}
            </div>

                    <div className="flex-1">
                      <div className={`font-medium ${
                        todo.completed ? 'text-green-700 line-through' : 'text-gray-900'
                      }`}>
                        {todo.title}
                      </div>
                      <div className="text-sm text-gray-500">{todo.dueDate}</div>
              </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          info(`Edit task: ${todo.title}`)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                </div>
                  </div>
                ))}
                </div>
              </div>

            {/* Recent Transactions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
              
              <div className="space-y-3">
                {transactionsData.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer"
                    onClick={() => info(`Transaction: ${transaction.description} - ${formatCurrency(transaction.amount)}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: transaction.color }}
                      >
                        {transaction.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-xs text-gray-400">{transaction.date}</div>
                      </div>
                    </div>
                    
                    <div className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Projects Circle */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">28</div>
                  <div className="text-sm text-gray-500 mb-2">Completed Projects</div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">0.45%</span>
        </div>
      </div>

                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                    <circle
                      cx="40" cy="40" r="35" stroke="#6B7280" strokeWidth="6" fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - 0.48)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">48%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Projects In Progress</div>
                    <div className="text-2xl font-bold text-gray-900">55.3%</div>
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-sm">0.59</span>
                    </div>
                  </div>
                  
                  <div className="w-16 h-8">
                    <svg className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        points="0,20 8,15 16,25 24,20 32,10 40,15 48,5 56,10 64,15"
                      />
                    </svg>
        </div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>

        {/* Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
                      <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
            <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {activityData.map((activity, index) => (
              <div
                key={activity.label}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => success(`${activity.label}: ${activity.value}`)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                  index % 6 === 0 ? 'bg-purple-500' :
                  index % 6 === 1 ? 'bg-red-400' :
                  index % 6 === 2 ? 'bg-green-500' :
                  index % 6 === 3 ? 'bg-amber-500' :
                  index % 6 === 4 ? 'bg-blue-400' : 'bg-pink-500'
                }`}>
                  {index % 6 === 0 ? <Target className="w-5 h-5" /> :
                   index % 6 === 1 ? <Package className="w-5 h-5" /> :
                   index % 6 === 2 ? <ShoppingBag className="w-5 h-5" /> :
                   index % 6 === 3 ? <DollarSign className="w-5 h-5" /> :
                   index % 6 === 4 ? <TrendingDown className="w-5 h-5" /> :
                   <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm text-gray-600">{activity.label}</div>
                  <div className="text-lg font-bold text-gray-900">{activity.value}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    activity.trend === 'up' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {activity.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{activity.change > 0 ? '+' : ''}{activity.change}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsPage

