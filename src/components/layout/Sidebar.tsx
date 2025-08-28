import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Users, BarChart3, Layers, ChevronDown, Palette, Target, TrendingUp, Shield } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useUIStore } from '@stores/uiStore'
import { useLanguageStore } from '@stores/languageStore'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation()
  const { hasPermission } = useAuthStore()
  const { } = useUIStore()
  const { t } = useLanguageStore()
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['main', 'segments', 'analytics'])

  const menuSections = [
    {
      id: 'main',
      title: t('nav.main', 'Основные'),
      items: [
        {
          name: t('nav.advertisers', 'Рекламодатели'),
          href: '/advertisers',
          icon: Users,
          permission: 'view_advertisers',
        }
      ]
    },
    {
      id: 'segments',
      title: t('nav.segments', 'Сегменты'),
      items: [
        {
          name: t('nav.segments', 'Сегменты'),
          href: '/segments',
          icon: Target,
          permission: 'view_segments',
        }
      ]
    },
    {
      id: 'analytics',
      title: t('nav.analytics', 'Статистика'),
      items: [
        {
          name: t('nav.analytics', 'Статистика'),
          href: '/analytics',
          icon: TrendingUp,
          permission: 'view_analytics',
        }
      ]
    }
  ]

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
                <>
              {/* Mobile backdrop */}
              {open && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity lg:hidden z-20"
                  onClick={() => setOpen(false)}
                />
              )}

                    {/* Sidebar */}
      <motion.div
        className={clsx(
          'h-full w-72 flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-auto',
          'fixed inset-y-0 left-0 z-30 lg:static',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* White background like header */}
        <div className="absolute inset-0 bg-white border-r border-gray-200 lg:shadow-none shadow-xl"></div>
        
        <div className="relative h-full flex flex-col p-2">
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex-1 flex justify-center">
                                <h1 className="text-3xl font-light text-black">IBIZA DSP</h1>
            </div>
            
            {/* Close button for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 absolute right-4 transition-colors"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-4 overflow-y-auto scrollbar-hide">
            {menuSections.map((section) => {
              const isExpanded = expandedSections.includes(section.id)

              return (
                <div key={section.id}>
                  {/* Section header - только в развернутом состоянии */}
                  {!false && (
                    <div 
                      className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                      onClick={() => toggleSection(section.id)}
                    >
                      <span>{section.title}</span>
                      <ChevronDown 
                        className={clsx(
                          'h-4 w-4 transition-transform duration-300',
                          isExpanded ? 'transform rotate-180' : ''
                        )}
                      />
                    </div>
                  )}

                  {/* Свернутое состояние - показываем заголовок секции сокращенно */}
                  {false && (
                    <div className="px-3 py-2 text-center">
                      <span className="text-xs font-semibold text-gray-500 font-['Montserrat']">
                        {section.title.slice(0, 5)}
                      </span>
                    </div>
                  )}

                  {/* Section items */}
                  {(isExpanded || false) && (
                    <div className={clsx(
                      'space-y-2',
                      false ? 'ml-0' : 'ml-4 mt-3'
                    )}>
                      {section.items.map((item) => {
                        if (item.permission && !hasPermission(item.permission as any)) {
                          return null
                        }

                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                              'group flex items-center text-sm font-medium rounded-lg transition-colors relative',
                              false ? 'px-3 py-3 justify-center' : 'px-4 py-3',
                              active
                                ? 'bg-slate-100 text-slate-900 border-l-4 border-slate-900'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            )}
                            onClick={() => setOpen(false)}
                            title={false ? item.name : undefined}
                          >
                            <Icon
                              className={clsx(
                                'h-5 w-5 transition-colors',
                                false ? 'mr-0' : 'mr-3',
                                active ? 'text-slate-900' : 'text-gray-600 group-hover:text-gray-900'
                              )}
                            />
                            <AnimatePresence>
                              {!false && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: 'auto' }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden whitespace-nowrap"
                                >
                                  {item.name}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-6 border-t border-gray-200 mt-auto">
            <AnimatePresence>
              {!false && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-gray-500 text-center font-medium font-['Montserrat']"
                >
                  © 2025 Ibiza DSP
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
