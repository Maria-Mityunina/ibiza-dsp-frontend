import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'
import { useExport } from '@hooks/useExport'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Globe,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Download,
  Zap,
  Target,
  Ban
} from 'lucide-react'

const FraudDetectionPage: React.FC = () => {
  const { t } = useLanguageStore()
  const { exportData, isExporting } = useExport()
  const [alertLevel, setAlertLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [autoRefresh, setAutoRefresh] = useState(true)

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
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('fraud.title')}</h1>
            <p className="text-slate-600">{t('fraud.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            alertLevel === 'high' ? 'bg-red-100 text-red-700' :
            alertLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-emerald-100 text-emerald-700'
          }`}>
            {t(`fraud.${alertLevel}`, alertLevel.toUpperCase())} RISK
          </div>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 transition-colors ${
              autoRefresh 
                ? 'text-emerald-600 hover:text-emerald-700' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Fraud Overview Cards */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Overall Fraud Rate */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">{t('fraud.fraud_rate')}</p>
                  <p className="text-2xl font-bold text-slate-900">0.83%</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -0.2%
                </div>
                <p className="text-slate-500 text-xs">vs yesterday</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '8.3%' }}></div>
            </div>
          </motion.div>

          {/* Blocked Traffic */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Ban className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">Blocked Traffic</p>
                  <p className="text-2xl font-bold text-slate-900">47.2K</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-red-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.3%
                </div>
                <p className="text-slate-500 text-xs">vs yesterday</p>
              </div>
            </div>
            <div className="h-8 flex items-end space-x-1">
              {[30, 45, 60, 75, 50, 80, 65].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-900 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Suspicious IPs */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">Suspicious IPs</p>
                  <p className="text-2xl font-bold text-slate-900">1,247</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-yellow-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.7%
                </div>
                <p className="text-slate-500 text-xs">vs yesterday</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </motion.div>

          {/* Bot Traffic */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">Bot Traffic</p>
                  <p className="text-2xl font-bold text-slate-900">2.1%</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -1.2%
                </div>
                <p className="text-slate-500 text-xs">vs yesterday</p>
              </div>
            </div>
            <div className="text-xs text-slate-500">Baseline: 1.5%</div>
          </motion.div>
        </div>
      </div>

      {/* Threat Detection Grid */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-time Threats */}
          <motion.div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-medium">Real-time Threats</h3>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {[
                { type: 'Click Fraud', severity: 'High', count: 23, time: '2 min ago' },
                { type: 'Bot Traffic', severity: 'Medium', count: 156, time: '5 min ago' },
                { type: 'Invalid Traffic', severity: 'Low', count: 8, time: '12 min ago' },
                { type: 'Suspicious IPs', severity: 'High', count: 45, time: '18 min ago' },
              ].map((threat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      threat.severity === 'High' ? 'bg-red-400' :
                      threat.severity === 'Medium' ? 'bg-yellow-400' :
                      'bg-emerald-400'
                    }`}></div>
                    <div>
                      <p className="text-white text-sm font-medium">{threat.type}</p>
                      <p className="text-slate-400 text-xs">{threat.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{threat.count}</p>
                    <p className="text-slate-400 text-xs">{threat.severity}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Geographic Risk Map */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Geographic Risk</h3>
              <Globe className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {[
                { country: 'Unknown/VPN', risk: 'High', percentage: 15.2, flag: '🔒' },
                { country: 'Russia', risk: 'High', percentage: 8.4, flag: '🇷🇺' },
                { country: 'China', risk: 'Medium', percentage: 12.1, flag: '🇨🇳' },
                { country: 'India', risk: 'Medium', percentage: 6.7, flag: '🇮🇳' },
                { country: 'Brazil', risk: 'Low', percentage: 4.3, flag: '🇧🇷' },
              ].map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{region.flag}</span>
                    <div>
                      <p className="text-slate-900 font-medium">{region.country}</p>
                      <p className="text-slate-500 text-sm">{region.percentage}% of fraud</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    region.risk === 'High' ? 'bg-red-100 text-red-700' :
                    region.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {region.risk}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Detection Methods */}
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 text-lg font-medium">Detection Methods</h3>
              <Target className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {[
                { method: 'ML Pattern Recognition', accuracy: 94.2, status: 'Active' },
                { method: 'IP Reputation', accuracy: 87.6, status: 'Active' },
                { method: 'Behavioral Analysis', accuracy: 91.3, status: 'Active' },
                { method: 'Device Fingerprinting', accuracy: 89.1, status: 'Active' },
                { method: 'Time-based Detection', accuracy: 76.8, status: 'Learning' },
              ].map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-900 font-medium text-sm">{method.method}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      method.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {method.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-slate-900 h-2 rounded-full" 
                        style={{ width: `${method.accuracy}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-600 text-sm font-medium">{method.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fraud Trends Table */}
      <div className="px-6">
        <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-800 text-lg font-medium">{t('fraud.fraud_detection_log')}</h3>
            <button 
              onClick={() => exportData([], 'fraud-detection-report', { format: 'csv' })}
              disabled={isExporting}
              className="px-3 py-1 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : t('fraud.export_report')}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Timestamp</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Threat Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Source IP</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Campaign</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Severity</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Action</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    timestamp: '15:42:33',
                    type: 'Click Fraud',
                    ip: '192.168.1.XXX',
                    campaign: 'Summer Sale Campaign',
                    severity: 'High',
                    action: 'Blocked',
                    status: 'Resolved'
                  },
                  {
                    timestamp: '15:41:15',
                    type: 'Bot Traffic',
                    ip: '10.0.0.XXX',
                    campaign: 'Brand Awareness',
                    severity: 'Medium',
                    action: 'Flagged',
                    status: 'Monitoring'
                  },
                  {
                    timestamp: '15:39:47',
                    type: 'Invalid Traffic',
                    ip: '172.16.0.XXX',
                    campaign: 'Mobile App Install',
                    severity: 'Low',
                    action: 'Logged',
                    status: 'Reviewed'
                  }
                ].map((log, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-4 px-4 text-slate-700 font-mono text-sm">{log.timestamp}</td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-900">{log.type}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-mono text-sm">{log.ip}</td>
                    <td className="py-4 px-4 text-slate-700">{log.campaign}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.severity === 'High' ? 'bg-red-100 text-red-700' :
                        log.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action === 'Blocked' ? 'bg-red-100 text-red-700' :
                        log.action === 'Flagged' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                        log.status === 'Monitoring' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
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

export default FraudDetectionPage
