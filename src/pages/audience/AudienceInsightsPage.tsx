import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useToast } from '@hooks/useToast'
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  Settings
} from 'lucide-react'

import { PageHeader } from '@components/layout'
import { DonutChart, BarChart, HeatmapCalendar } from '@components/charts'

interface AudienceSegment {
  id: string
  name: string
  size: number
  growth: number
  engagement: number
  ctr: number
  color: string
}

interface DemographicData {
  ageGroup: string
  percentage: number
  impressions: number
  ctr: number
  color: string
}

interface GeographicData {
  country: string
  city: string
  percentage: number
  impressions: number
  engagement: number
  flag: string
}

interface InterestData {
  category: string
  affinity: number
  reach: number
  color: string
}

const AudienceInsightsPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  // Audience segments data
  const audienceSegments: AudienceSegment[] = [
    {
      id: 'tech-enthusiasts',
      name: 'Tech Enthusiasts',
      size: 2400000,
      growth: 15.3,
      engagement: 8.7,
      ctr: 4.2,
      color: '#5EAFC6'
    },
    {
      id: 'shoppers',
      name: 'Online Shoppers',
      size: 1800000,
      growth: 12.1,
      engagement: 6.4,
      ctr: 3.8,
      color: '#E74C3C'
    },
    {
      id: 'travelers',
      name: 'Travel Lovers',
      size: 1200000,
      growth: -2.3,
      engagement: 9.1,
      ctr: 5.2,
      color: '#27AE60'
    },
    {
      id: 'gamers',
      name: 'Gaming Community',
      size: 950000,
      growth: 8.9,
      engagement: 12.3,
      ctr: 6.8,
      color: '#F39C12'
    },
    {
      id: 'fitness',
      name: 'Fitness & Health',
      size: 800000,
      growth: 18.7,
      engagement: 7.2,
      ctr: 4.5,
      color: '#9B59B6'
    }
  ]

  // Demographics data
  const demographicsData: DemographicData[] = [
    { ageGroup: '18-24', percentage: 18.5, impressions: 4600000, ctr: 3.8, color: '#5EAFC6' },
    { ageGroup: '25-34', percentage: 32.1, impressions: 8000000, ctr: 4.2, color: '#E74C3C' },
    { ageGroup: '35-44', percentage: 25.7, impressions: 6400000, ctr: 3.9, color: '#27AE60' },
    { ageGroup: '45-54', percentage: 15.2, impressions: 3800000, ctr: 3.5, color: '#F39C12' },
    { ageGroup: '55+', percentage: 8.5, impressions: 2100000, ctr: 3.1, color: '#95A5A6' }
  ]

  // Geographic data
  const geographicData: GeographicData[] = [
    { country: 'Россия', city: 'Москва', percentage: 28.4, impressions: 7100000, engagement: 8.2, flag: '🇷🇺' },
    { country: 'Россия', city: 'Санкт-Петербург', percentage: 12.6, impressions: 3150000, engagement: 7.8, flag: '🇷🇺' },
    { country: 'Казахстан', city: 'Алматы', percentage: 8.9, impressions: 2225000, engagement: 6.9, flag: '🇰🇿' },
    { country: 'Беларусь', city: 'Минск', percentage: 6.7, impressions: 1675000, engagement: 7.4, flag: '🇧🇾' },
    { country: 'Украина', city: 'Киев', percentage: 5.8, impressions: 1450000, engagement: 7.1, flag: '🇺🇦' }
  ]

  // Interests data
  const interestsData: InterestData[] = [
    { category: 'Technology', affinity: 92.3, reach: 3200000, color: '#34495E' },
    { category: 'Shopping', affinity: 87.6, reach: 2800000, color: '#5EAFC6' },
    { category: 'Entertainment', affinity: 84.1, reach: 2600000, color: '#E74C3C' },
    { category: 'Sports', affinity: 79.8, reach: 2100000, color: '#27AE60' },
    { category: 'Travel', affinity: 76.5, reach: 1900000, color: '#F39C12' },
    { category: 'Food & Dining', affinity: 73.2, reach: 1700000, color: '#9B59B6' }
  ]

  // Device usage over time
  const deviceTimeData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    desktop: Math.floor(Math.random() * 30) + 20,
    mobile: Math.floor(Math.random() * 50) + 40,
    tablet: Math.floor(Math.random() * 15) + 5
  }))

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const TrendIcon = ({ trend }: { trend: number }) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-emerald-600" />
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Audience Insights"
        actionButton={
          <div className="flex items-center gap-3">
            {/* Time Range */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
                    selectedTimeRange === range
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Export */}
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Settings */}
            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-6 space-y-6">
        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Audience</p>
                <p className="text-2xl font-bold text-gray-900">24.7M</p>
                <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.3%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">8.4%</p>
                <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reach Rate</p>
                <p className="text-2xl font-bold text-gray-900">73.2%</p>
                <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>-1.8%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Segments</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
                <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audience Segments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Audience Segments</h3>
                <p className="text-sm text-gray-500">Performance by audience type</p>
              </div>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"
              >
                <option value="all">All Segments</option>
                <option value="high-engagement">High Engagement</option>
                <option value="growing">Growing</option>
              </select>
            </div>

            <div className="space-y-4">
              {audienceSegments.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onMouseEnter={() => setHoveredElement(segment.id)}
                  onMouseLeave={() => setHoveredElement(null)}
                  className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${
                    hoveredElement === segment.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{segment.name}</h4>
                        <p className="text-sm text-gray-500">{formatNumber(segment.size)} users</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <TrendIcon trend={segment.growth} />
                          <span className={segment.growth > 0 ? 'text-emerald-600' : 'text-red-500'}>
                            {segment.growth > 0 ? '+' : ''}{segment.growth}%
                          </span>
                        </div>
                        <p className="text-gray-500">Growth</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{segment.engagement}%</p>
                        <p className="text-gray-500">Engagement</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{segment.ctr}%</p>
                        <p className="text-gray-500">CTR</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Demographics Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Age Demographics</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {demographicsData.map((demo, index) => (
                <div key={demo.ageGroup} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: demo.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{demo.ageGroup}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{demo.percentage}%</p>
                    <p className="text-xs text-gray-500">{demo.ctr}% CTR</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 h-48">
              <DonutChart
                data={demographicsData.map(d => ({
                  label: d.ageGroup,
                  value: d.percentage,
                  color: d.color
                }))}
                title=""
              />
            </div>
          </motion.div>
        </div>

        {/* Geographic Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
              <p className="text-sm text-gray-500">Top performing locations</p>
            </div>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {geographicData.map((location, index) => (
              <motion.div
                key={`${location.country}-${location.city}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="text-2xl mb-2">{location.flag}</div>
                <h4 className="font-medium text-gray-900">{location.city}</h4>
                <p className="text-xs text-gray-500 mb-2">{location.country}</p>
                <p className="text-lg font-bold text-gray-900">{location.percentage}%</p>
                <p className="text-xs text-gray-500">{formatNumber(location.impressions)} impressions</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                  <Heart className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{location.engagement}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interests & Device Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interest Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Interest Categories</h3>
                <p className="text-sm text-gray-500">Audience affinity scores</p>
              </div>
              <Target className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {interestsData.map((interest, index) => (
                <motion.div
                  key={interest.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: interest.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{interest.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{interest.affinity}%</p>
                      <p className="text-xs text-gray-500">Affinity</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatNumber(interest.reach)}</p>
                      <p className="text-xs text-gray-500">Reach</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Device Usage Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Device Usage by Hour</h3>
                <p className="text-sm text-gray-500">24-hour activity patterns</p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Desktop</span>
                  <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Mobile</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <Tablet className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Tablet</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-1">
              {deviceTimeData.slice(0, 12).map((data, index) => (
                <div key={data.hour} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <div 
                      className="bg-gray-700 rounded-t"
                      style={{ height: `${data.desktop}px` }}
                    ></div>
                    <div 
                      className="bg-blue-500"
                      style={{ height: `${data.mobile}px` }}
                    ></div>
                    <div 
                      className="bg-green-500 rounded-b"
                      style={{ height: `${data.tablet}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 transform rotate-45 origin-left">
                    {data.hour.split(':')[0]}
                  </span>
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