import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Settings, ChevronDown, User, LogOut, Zap, HelpCircle, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useLanguageStore } from '@stores/languageStore'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuthStore()
  const { language, setLanguage, t } = useLanguageStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const settingsDropdownRef = useRef<HTMLDivElement>(null)
  const notificationsDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false)
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLanguage: 'en' | 'ru') => {
    setLanguage(newLanguage)
    setIsSettingsOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsSettingsOpen(false)
  }

  return (
    <header 
      className="bg-white/15 backdrop-blur-xl border-b border-white/30 sticky top-0 z-50 shadow-xl relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.18) 0%, 
            rgba(255, 255, 255, 0.12) 50%, 
            rgba(255, 255, 255, 0.15) 100%
          )
        `,
        backdropFilter: 'blur(20px) saturate(120%)',
        boxShadow: `
          0 4px 20px rgba(0,0,0,0.08),
          0 1px 0 rgba(255,255,255,0.15) inset
        `,
      }}
    >
      
      <div className="w-full">
        <div className="max-w-7xl xxl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Left side - Toggle button and Logo */}
          <div className="flex items-center space-x-4">
            {/* Toggle button when sidebar is closed */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            
            {/* Logo from sidebar when it's closed */}
            {!sidebarOpen && (
              <Link to="/advertisers" className="group">
                <h2
                  className="text-xl font-light text-gray-900 group-hover:text-gray-700 transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Ibiza DSP
                </h2>
                <p
                  className="text-xs text-gray-600 font-light"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Dashboard
                </p>
              </Link>
            )}
          </div>

          {/* Center space */}
          <div className="flex-1"></div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsDropdownRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 py-2 z-50"
                  >
                    {/* Notifications Header */}
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Уведомления</span>
                        <span className="text-xs text-gray-500">3 новых</span>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-100/70 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Новая кампания запущена</p>
                            <p className="text-xs text-gray-600">Campaign "Summer Sale" активна</p>
                            <p className="text-xs text-gray-500 mt-1">5 мин назад</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 hover:bg-gray-100/70 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Бюджет достигнут</p>
                            <p className="text-xs text-gray-600">Кампания "Mobile Apps" достигла лимита</p>
                            <p className="text-xs text-gray-500 mt-1">1 час назад</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 hover:bg-gray-100/70 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Низкий CTR</p>
                            <p className="text-xs text-gray-600">Рекомендуется оптимизация креативов</p>
                            <p className="text-xs text-gray-500 mt-1">3 часа назад</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View All */}
                    <div className="border-t border-gray-100/50 px-4 py-2">
                      <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2">
                        Посмотреть все уведомления
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Dropdown */}
            <div className="relative" ref={settingsDropdownRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-slate-900 to-slate-700 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-light text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {user?.username || 'DSP Manager'}
                  </p>
                  <p className="text-xs text-gray-500 font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {user?.role || 'Administrator'}
                  </p>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 py-2 z-50"
                  >
                    {/* User Profile Section */}
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-900 to-slate-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-light text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {user?.username || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Язык
                      </p>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleLanguageChange('en')}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            language === 'en'
                              ? 'bg-slate-100 text-slate-900'
                              : 'text-gray-700 hover:bg-gray-100/70'
                          }`}
                        >
                          <span className="text-base">🇺🇸</span>
                          <span>English</span>
                          {language === 'en' && <div className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></div>}
                        </button>
                        <button
                          onClick={() => handleLanguageChange('ru')}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            language === 'ru'
                              ? 'bg-slate-100 text-slate-900'
                              : 'text-gray-700 hover:bg-gray-100/70'
                          }`}
                        >
                          <span className="text-base">🇷🇺</span>
                          <span>Русский</span>
                          {language === 'ru' && <div className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></div>}
                        </button>
                      </div>
                    </div>

                    {/* Other Settings */}
                    <div className="border-t border-gray-100/50 px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Настройки
                      </p>
                      <div className="space-y-1">
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100/70 rounded-lg transition-all duration-200">
                          <User className="w-4 h-4" />
                          <span>Профиль</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100/70 rounded-lg transition-all duration-200">
                          <Bell className="w-4 h-4" />
                          <span>Уведомления</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100/70 rounded-lg transition-all duration-200">
                          <HelpCircle className="w-4 h-4" />
                          <span>Поддержка</span>
                        </button>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100/50 px-4 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50/70 rounded-lg transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>


    </header>
  )
}

export default Header