import React, { useState, useRef, useEffect } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@stores/languageStore'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterDropdownProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
  badge?: number
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selected,
  onChange,
  className = '',
  badge
}) => {
  const { t } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
          selected.length > 0
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>{title}</span>
        {badge && badge > 0 && (
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
            selected.length > 0 ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
          }`}>
            {badge}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">{title}</span>
                {selected.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm text-slate-700">{option.label}</span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-xs text-slate-500">{option.count}</span>
                  )}
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterDropdown
