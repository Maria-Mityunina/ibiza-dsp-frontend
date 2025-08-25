import { useState, useMemo } from 'react'

export interface FilterState {
  timeRange: string
  format: string
  status: string
  device: string
  country: string
  searchQuery: string
}

export const useFilters = (initialFilters: Partial<FilterState> = {}) => {
  const [filters, setFilters] = useState<FilterState>({
    timeRange: '7d',
    format: 'all',
    status: 'all',
    device: 'all',
    country: 'all',
    searchQuery: '',
    ...initialFilters
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      timeRange: '7d',
      format: 'all',
      status: 'all',
      device: 'all',
      country: 'all',
      searchQuery: ''
    })
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.format !== 'all') count++
    if (filters.status !== 'all') count++
    if (filters.device !== 'all') count++
    if (filters.country !== 'all') count++
    if (filters.searchQuery) count++
    return count
  }, [filters])

  return {
    filters,
    updateFilter,
    resetFilters,
    activeFiltersCount,
    setFilters
  }
}
