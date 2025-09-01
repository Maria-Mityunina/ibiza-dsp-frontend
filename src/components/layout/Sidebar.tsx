import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Users, 
  Target, 
  TrendingUp, 
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  ImageIcon,
  Home,
  Settings,
  Zap,
  LayoutDashboard,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const mainNavigation = [
    {
      name: 'Dashboard',
      href: '/analytics',
      icon: LayoutDashboard,
      current: location.pathname.startsWith('/analytics')
    },
    {
      name: 'Рекламодатели',
      href: '/advertisers',
      icon: Users,
      current: location.pathname.startsWith('/advertisers')
    },
    {
      name: 'Кампании',
      href: '/campaigns',
      icon: BarChart3,
      current: location.pathname.startsWith('/campaigns')
    }
  ]

  const managementNavigation = [
    {
      name: 'Сегменты',
      href: '/segments',
      icon: Target,
      current: location.pathname.startsWith('/segments')
    },
    {
      name: 'Креативы',
      href: '/creatives',
      icon: ImageIcon,
      current: location.pathname.startsWith('/creatives')
    }
  ]

  const integrationNavigation = [
    {
      name: 'Статистика',
      href: '/analytics',
      icon: TrendingUp,
      current: location.pathname.startsWith('/analytics')
    }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`
          h-screen w-64 
          fixed left-0 top-0 z-50
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.25) 0%, 
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.1) 100%
            )
          `,
          backdropFilter: 'blur(20px)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset,
            0 1px 0 0 rgba(255, 255, 255, 0.3) inset
          `,
          borderRight: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
              {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <Link to="/advertisers" className="flex items-center space-x-3 group">
          <div>
            <h2 
              className="text-2xl font-light text-gray-900 group-hover:text-gray-700 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Ibiza DSP
            </h2>
            <p 
              className="text-sm text-gray-600 font-light"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Dashboard
            </p>
          </div>
        </Link>

          {/* Toggle arrow */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            <h3 
              className="px-3 py-2 text-xs font-light text-gray-500 uppercase tracking-wider"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              ОСНОВНОЕ
            </h3>
            {mainNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}

                  className={`
                    group flex items-center px-3 py-3 text-sm font-light rounded-xl transition-all duration-200 relative overflow-hidden
                    ${item.current 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
                    }
                  `}
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    ...(item.current && {
                      background: `
                        linear-gradient(135deg, 
                          rgba(17, 24, 39, 1) 0%, 
                          rgba(31, 41, 55, 1) 100%
                        )
                      `,
                      boxShadow: `
                        0 8px 25px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(255, 255, 255, 0.2) inset
                      `
                    })
                  }}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 transition-all duration-200
                    ${item.current ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
                  `} />
                  <span className="flex-1">{item.name}</span>
                  
                  {/* Hover effect */}
                  {!item.current && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Management Navigation */}
          <div className="space-y-2">
            <h3 
              className="px-3 py-2 text-xs font-light text-gray-500 uppercase tracking-wider"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              УПРАВЛЕНИЕ
            </h3>
            {managementNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}

                  className={`
                    group flex items-center px-3 py-3 text-sm font-light rounded-xl transition-all duration-200 relative overflow-hidden
                    ${item.current 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
                    }
                  `}
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    ...(item.current && {
                      background: `
                        linear-gradient(135deg, 
                          rgba(17, 24, 39, 1) 0%, 
                          rgba(31, 41, 55, 1) 100%
                        )
                      `,
                      boxShadow: `
                        0 8px 25px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(255, 255, 255, 0.2) inset
                      `
                    })
                  }}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 transition-all duration-200
                    ${item.current ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
                  `} />
                  <span className="flex-1">{item.name}</span>
                  
                  {/* Hover effect */}
                  {!item.current && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="space-y-2">
            <button 
              className="w-full flex items-center px-3 py-3 text-sm font-light text-gray-600 hover:text-gray-900 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <HelpCircle className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
              <span>Помощь</span>
            </button>
            <button 
              className="w-full flex items-center px-3 py-3 text-sm font-light text-gray-600 hover:text-gray-900 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
              <span>Настройки</span>
            </button>
          </div>
        </div>
      </motion.aside>


    </>
  )
}

export default Sidebar