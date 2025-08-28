import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  Bot, 
  Eye, 
  MapPin, 
  Clock, 
  TrendingDown, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Activity,
  Zap
} from 'lucide-react'

interface FraudMetrics {
  fraudRate: number
  suspiciousIPs: number
  botTraffic: number
  invalidClicks: number
  qualityScore: number
  blockedImpressions: number
  savingsFromBlocking: number
}

interface ThreatData {
  id: string
  type: 'bot' | 'suspicious_ip' | 'invalid_click' | 'geo_anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
  source: string
  blocked: boolean
}

interface GeographicRisk {
  country: string
  riskLevel: 'low' | 'medium' | 'high'
  suspiciousTraffic: number
  totalTraffic: number
  riskFactors: string[]
}

interface FraudDetectionInsightsProps {
  title: string
  className?: string
  realTime?: boolean
}

const FraudDetectionInsights: React.FC<FraudDetectionInsightsProps> = ({
  title,
  className = "",
  realTime = true
}) => {
  const [fraudMetrics, setFraudMetrics] = useState<FraudMetrics>({
    fraudRate: 2.3,
    suspiciousIPs: 1247,
    botTraffic: 3.8,
    invalidClicks: 892,
    qualityScore: 8.7,
    blockedImpressions: 45678,
    savingsFromBlocking: 12340.50
  })

  const [recentThreats, setRecentThreats] = useState<ThreatData[]>([
    {
      id: '1',
      type: 'bot',
      severity: 'high',
      description: 'Bot farm detected from IP range 192.168.x.x',
      timestamp: new Date(Date.now() - 300000),
      source: '192.168.1.0/24',
      blocked: true
    },
    {
      id: '2',
      type: 'suspicious_ip',
      severity: 'medium',
      description: 'High click frequency from single IP',
      timestamp: new Date(Date.now() - 600000),
      source: '203.45.67.89',
      blocked: true
    },
    {
      id: '3',
      type: 'invalid_click',
      severity: 'low',
      description: 'Repeated clicks without engagement',
      timestamp: new Date(Date.now() - 900000),
      source: 'Campaign: Black Friday',
      blocked: false
    },
    {
      id: '4',
      type: 'geo_anomaly',
      severity: 'critical',
      description: 'Unusual traffic spike from high-risk region',
      timestamp: new Date(Date.now() - 1200000),
      source: 'Region: Eastern Europe',
      blocked: true
    }
  ])

  const [geographicRisks, setGeographicRisks] = useState<GeographicRisk[]>([
    {
      country: 'Russia',
      riskLevel: 'high',
      suspiciousTraffic: 15234,
      totalTraffic: 45678,
      riskFactors: ['Bot networks', 'Click farms', 'Proxy usage']
    },
    {
      country: 'China',
      riskLevel: 'medium',
      suspiciousTraffic: 8945,
      totalTraffic: 67234,
      riskFactors: ['VPN usage', 'Automated traffic']
    },
    {
      country: 'USA',
      riskLevel: 'low',
      suspiciousTraffic: 2134,
      totalTraffic: 156789,
      riskFactors: ['Minor bot activity']
    },
    {
      country: 'Germany',
      riskLevel: 'low',
      suspiciousTraffic: 1567,
      totalTraffic: 89345,
      riskFactors: ['Clean traffic']
    }
  ])

  // Real-time updates
  useEffect(() => {
    if (!realTime) return

    const interval = setInterval(() => {
      setFraudMetrics(prev => ({
        ...prev,
        fraudRate: Math.max(0.1, prev.fraudRate + (Math.random() - 0.5) * 0.2),
        suspiciousIPs: prev.suspiciousIPs + Math.floor(Math.random() * 10),
        botTraffic: Math.max(0.1, prev.botTraffic + (Math.random() - 0.5) * 0.3),
        blockedImpressions: prev.blockedImpressions + Math.floor(Math.random() * 100)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [realTime])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'bot': return Bot
      case 'suspicious_ip': return Eye
      case 'invalid_click': return AlertTriangle
      case 'geo_anomaly': return MapPin
      default: return AlertTriangle
    }
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Real-time fraud detection and traffic quality monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Active Protection</span>
        </div>
      </div>

      {/* Key Fraud Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">
              {fraudMetrics.fraudRate > 3 ? '↑' : '↓'} {Math.abs(fraudMetrics.fraudRate - 2.5).toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-red-900">{fraudMetrics.fraudRate.toFixed(1)}%</div>
          <div className="text-sm text-red-700">Fraud Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Bot className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Live</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{fraudMetrics.botTraffic.toFixed(1)}%</div>
          <div className="text-sm text-orange-700">Bot Traffic</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">+{Math.floor(Math.random() * 10)}</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{formatNumber(fraudMetrics.suspiciousIPs)}</div>
          <div className="text-sm text-blue-700">Suspicious IPs</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">Excellent</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">{fraudMetrics.qualityScore}</div>
          <div className="text-sm text-emerald-700">Quality Score</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Threats */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Recent Threats
          </h4>
          
          <div className="space-y-3">
            {recentThreats.map((threat, index) => {
              const ThreatIcon = getThreatIcon(threat.type)
              return (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    threat.severity === 'critical' ? 'bg-red-100 text-red-600' :
                    threat.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                    threat.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <ThreatIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getSeverityColor(threat.severity)}`}>
                        {threat.severity}
                      </span>
                      {threat.blocked ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-900 font-medium mb-1">{threat.description}</div>
                    <div className="text-xs text-gray-500">
                      {threat.source} • {threat.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Geographic Risk Analysis */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            Geographic Risk Analysis
          </h4>
          
          <div className="space-y-3">
            {geographicRisks.map((risk, index) => (
              <motion.div
                key={risk.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{risk.country}</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(risk.riskLevel)}`}>
                    {risk.riskLevel} risk
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Suspicious Traffic</span>
                    <span>{formatNumber(risk.suspiciousTraffic)} / {formatNumber(risk.totalTraffic)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        risk.riskLevel === 'high' ? 'bg-red-500' :
                        risk.riskLevel === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(risk.suspiciousTraffic / risk.totalTraffic) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {risk.riskFactors.map((factor, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Protection Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-900">Blocked</span>
            </div>
            <div className="text-2xl font-bold text-emerald-900">
              {formatNumber(fraudMetrics.blockedImpressions)}
            </div>
            <div className="text-sm text-emerald-700">Fraudulent impressions</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Quality Score</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {fraudMetrics.qualityScore}/10
            </div>
            <div className="text-sm text-blue-700">Traffic quality rating</div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Savings</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(fraudMetrics.savingsFromBlocking)}
            </div>
            <div className="text-sm text-green-700">From fraud prevention</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FraudDetectionInsights
