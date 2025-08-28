import React from 'react'
import { Search, Filter } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  statusFilter?: string
  onStatusChange?: (value: string) => void
  statusOptions?: FilterOption[]
  extraFilters?: React.ReactNode
  className?: string
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Поиск...',
  statusFilter,
  onStatusChange,
  statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'active', label: 'Активные' },
    { value: 'paused', label: 'На паузе' },
    { value: 'draft', label: 'Черновик' },
    { value: 'pending', label: 'На модерации' }
  ],
  extraFilters,
  className = ''
}) => {
  return (
    <div 
      className={`flex flex-col sm:flex-row gap-4 ${className}`}
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-white/25 rounded-2xl focus:ring-2 focus:ring-gray-400 focus:border-white/40 transition-all duration-200 bg-white/15 backdrop-blur-lg placeholder-gray-500 text-gray-900 font-normal text-sm"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        />
      </div>

      {/* Status Filter */}
      {statusFilter !== undefined && onStatusChange && (
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-white/25 rounded-2xl focus:ring-2 focus:ring-gray-400 focus:border-white/40 bg-white/15 backdrop-blur-lg appearance-none cursor-pointer min-w-[160px] sm:min-w-[200px] transition-all duration-200 text-gray-900 text-sm font-normal hover:bg-white/20 hover:border-white/30"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.08) 100%
                )
              `,
              backdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Extra Filters */}
      {extraFilters && (
        <div className="flex flex-wrap gap-4">
          {extraFilters}
        </div>
      )}
    </div>
  )
}

export default SearchFilters
