import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  BarChart3, 
  PieChart,
  LineChart,
  TrendingUp,
  Map,
  Shield,
  Smartphone,
  Target,
  Download,
  Copy,
  Share2,
  Layout
} from 'lucide-react'

interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'map' | 'funnel'
  title: string
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number }
  config: {
    metrics?: string[]
    chartType?: 'line' | 'bar' | 'pie' | 'area'
    dataSource?: string
    filters?: Record<string, any>
    timeRange?: string
  }
  visible: boolean
}

interface DashboardTemplate {
  id: string
  name: string
  description: string
  widgets: DashboardWidget[]
  isDefault?: boolean
}

interface CustomDashboardBuilderProps {
  title: string
  className?: string
  onSave?: (dashboard: DashboardTemplate) => void
  templates?: DashboardTemplate[]
}

const CustomDashboardBuilder: React.FC<CustomDashboardBuilderProps> = ({
  title,
  className = "",
  onSave,
  templates = []
}) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [currentDashboard, setCurrentDashboard] = useState<DashboardTemplate | null>(null)
  const [availableWidgets] = useState([
    {
      type: 'metric' as const,
      title: 'KPI Metrics',
      icon: TrendingUp,
      description: 'Display key performance indicators'
    },
    {
      type: 'chart' as const,
      title: 'Performance Charts',
      icon: BarChart3,
      description: 'Various chart types for data visualization'
    },
    {
      type: 'table' as const,
      title: 'Data Tables',
      icon: Layout,
      description: 'Detailed tabular data views'
    },
    {
      type: 'map' as const,
      title: 'Geographic Maps',
      icon: Map,
      description: 'Geographic performance visualization'
    },
    {
      type: 'funnel' as const,
      title: 'Conversion Funnels',
      icon: Target,
      description: 'Conversion flow analysis'
    }
  ])

  const [defaultTemplates] = useState<DashboardTemplate[]>([
    {
      id: 'executive',
      name: 'Executive Dashboard',
      description: 'High-level KPIs and trends for executives',
      isDefault: true,
      widgets: [
        {
          id: 'revenue-metrics',
          type: 'metric',
          title: 'Revenue Metrics',
          size: 'medium',
          position: { x: 0, y: 0 },
          config: { metrics: ['revenue', 'roas', 'profit'] },
          visible: true
        },
        {
          id: 'performance-chart',
          type: 'chart',
          title: 'Performance Over Time',
          size: 'large',
          position: { x: 1, y: 0 },
          config: { chartType: 'line', metrics: ['impressions', 'clicks'] },
          visible: true
        }
      ]
    },
    {
      id: 'campaign-manager',
      name: 'Campaign Manager',
      description: 'Detailed campaign performance and optimization tools',
      isDefault: true,
      widgets: [
        {
          id: 'campaign-table',
          type: 'table',
          title: 'Campaign Performance',
          size: 'full',
          position: { x: 0, y: 0 },
          config: { dataSource: 'campaigns' },
          visible: true
        },
        {
          id: 'device-breakdown',
          type: 'chart',
          title: 'Device Performance',
          size: 'medium',
          position: { x: 0, y: 1 },
          config: { chartType: 'pie', dataSource: 'devices' },
          visible: true
        }
      ]
    },
    {
      id: 'fraud-analyst',
      name: 'Fraud Analyst',
      description: 'Fraud detection and traffic quality monitoring',
      isDefault: true,
      widgets: [
        {
          id: 'fraud-metrics',
          type: 'metric',
          title: 'Fraud Metrics',
          size: 'small',
          position: { x: 0, y: 0 },
          config: { metrics: ['fraudRate', 'blockedTraffic'] },
          visible: true
        },
        {
          id: 'geographic-risk',
          type: 'map',
          title: 'Geographic Risk',
          size: 'large',
          position: { x: 1, y: 0 },
          config: { dataSource: 'geographic' },
          visible: true
        }
      ]
    }
  ])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const handleCreateDashboard = () => {
    const newDashboard: DashboardTemplate = {
      id: `custom-${Date.now()}`,
      name: 'New Dashboard',
      description: 'Custom dashboard',
      widgets: []
    }
    setCurrentDashboard(newDashboard)
    setIsBuilderOpen(true)
  }

  const handleTemplateSelect = (template: DashboardTemplate) => {
    setCurrentDashboard({ ...template })
    setIsBuilderOpen(true)
  }

  const handleAddWidget = (widgetType: DashboardWidget['type']) => {
    if (!currentDashboard) return

    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: `New ${widgetType}`,
      size: 'medium',
      position: { x: 0, y: currentDashboard.widgets.length },
      config: {},
      visible: true
    }

    setCurrentDashboard({
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, newWidget]
    })
  }

  const handleRemoveWidget = (widgetId: string) => {
    if (!currentDashboard) return

    setCurrentDashboard({
      ...currentDashboard,
      widgets: currentDashboard.widgets.filter(w => w.id !== widgetId)
    })
  }

  const handleSaveDashboard = () => {
    if (currentDashboard && onSave) {
      onSave(currentDashboard)
    }
    setIsBuilderOpen(false)
  }

  const getWidgetIcon = (type: DashboardWidget['type']) => {
    switch (type) {
      case 'metric': return TrendingUp
      case 'chart': return BarChart3
      case 'table': return Layout
      case 'map': return Map
      case 'funnel': return Target
      default: return BarChart3
    }
  }

  const getSizeClass = (size: DashboardWidget['size']) => {
    switch (size) {
      case 'small': return 'col-span-1'
      case 'medium': return 'col-span-2'
      case 'large': return 'col-span-3'
      case 'full': return 'col-span-full'
      default: return 'col-span-2'
    }
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Create and customize your analytics dashboards</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Dashboard
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {defaultTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
              {template.isDefault && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Template
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Layout className="w-4 h-4" />
              <span>{template.widgets.length} widgets</span>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {template.widgets.slice(0, 3).map((widget) => {
                const WidgetIcon = getWidgetIcon(widget.type)
                return (
                  <div key={widget.id} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                    <WidgetIcon className="w-3 h-3" />
                    <span className="capitalize">{widget.type}</span>
                  </div>
                )
              })}
              {template.widgets.length > 3 && (
                <span className="text-xs text-gray-500">+{template.widgets.length - 3} more</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Builder Modal */}
      <AnimatePresence>
        {isBuilderOpen && currentDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Dashboard Builder</h3>
                  <p className="text-sm text-gray-600">Customize your analytics dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Dashboard
                  </button>
                  <button
                    onClick={() => setIsBuilderOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Widget Library */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Widget Library</h4>
                  
                  <div className="space-y-2">
                    {availableWidgets.map((widget) => {
                      const WidgetIcon = widget.icon
                      return (
                        <motion.button
                          key={widget.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddWidget(widget.type)}
                          className="w-full p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <WidgetIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{widget.title}</div>
                              <div className="text-xs text-gray-600">{widget.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Dashboard Preview</h4>
                    <span className="text-sm text-gray-600">
                      {currentDashboard.widgets.length} widgets
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 min-h-[400px]">
                    {currentDashboard.widgets.length === 0 ? (
                      <div className="flex items-center justify-center h-96 text-gray-500">
                        <div className="text-center">
                          <Layout className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-lg font-medium">No widgets added yet</p>
                          <p className="text-sm">Select widgets from the library to build your dashboard</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-4">
                        {currentDashboard.widgets.map((widget) => {
                          const WidgetIcon = getWidgetIcon(widget.type)
                          return (
                            <motion.div
                              key={widget.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`${getSizeClass(widget.size)} border border-gray-200 rounded-lg p-4 bg-gray-50 relative group`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <WidgetIcon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">{widget.title}</span>
                              </div>
                              
                              <div className="text-xs text-gray-500 mb-3 capitalize">
                                {widget.type} • {widget.size}
                              </div>

                              {/* Mock content based on widget type */}
                              <div className="space-y-2">
                                {widget.type === 'metric' && (
                                  <div className="space-y-1">
                                    <div className="text-2xl font-bold text-gray-900">$1.2M</div>
                                    <div className="text-xs text-gray-600">Revenue</div>
                                  </div>
                                )}
                                
                                {widget.type === 'chart' && (
                                  <div className="h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded border-2 border-dashed border-blue-200 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-blue-500" />
                                  </div>
                                )}
                                
                                {widget.type === 'table' && (
                                  <div className="space-y-1">
                                    {[1, 2, 3].map(i => (
                                      <div key={i} className="h-2 bg-gray-200 rounded" />
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Widget actions */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleRemoveWidget(widget.id)}
                                  className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{defaultTemplates.length}</div>
          <div className="text-sm text-gray-600">Available Templates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{availableWidgets.length}</div>
          <div className="text-sm text-gray-600">Widget Types</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {defaultTemplates.reduce((sum, t) => sum + t.widgets.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Widgets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">∞</div>
          <div className="text-sm text-gray-600">Customization</div>
        </div>
      </div>
    </div>
  )
}

export default CustomDashboardBuilder
