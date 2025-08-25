import React, { useState, useRef, useEffect } from 'react'
import { Bell, Search, Settings, ChevronDown, User, Moon, Sun, Globe, LogOut } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useLanguageStore } from '@stores/languageStore'
import { motion, AnimatePresence } from 'framer-motion'

const Header: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { language, setLanguage, t } = useLanguageStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search:', searchValue)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex items-center flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Search campaigns, audiences, creatives..."
            />
          </form>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5" />
              <ChevronDown className={`h-4 w-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {/* User Profile Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      {t('settings.language')}
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`w-full flex items-center space-x-2 px-2 py-2 text-sm rounded-md transition-colors ${
                          language === 'en'
                            ? 'bg-slate-100 text-slate-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-base">🇺🇸</span>
                        <span>{t('settings.english')}</span>
                        {language === 'en' && <div className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></div>}
                      </button>
                      <button
                        onClick={() => handleLanguageChange('ru')}
                        className={`w-full flex items-center space-x-2 px-2 py-2 text-sm rounded-md transition-colors ${
                          language === 'ru'
                            ? 'bg-slate-100 text-slate-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-base">🇷🇺</span>
                        <span>{t('settings.russian')}</span>
                        {language === 'ru' && <div className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></div>}
                      </button>
                    </div>
                  </div>

                  {/* Other Settings */}
                  <div className="border-t border-gray-100 px-4 py-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      {t('settings.profile')}
                    </p>
                    <div className="space-y-1">
                      <button className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <User className="w-4 h-4" />
                        <span>{t('settings.profile')}</span>
                      </button>
                      <button className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <Bell className="w-4 h-4" />
                        <span>{t('settings.notifications')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 px-4 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('settings.logout')}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.username || 'DSP Manager'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || 'Administrator'}
              </p>
            </div>
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header