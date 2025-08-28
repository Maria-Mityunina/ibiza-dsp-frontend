import React from 'react'
import { motion } from 'framer-motion'

interface Column<T> {
  key: keyof T | string
  title: string
  render?: (value: any, item: T, index: number) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  hideOnMobile?: boolean
  priority?: 'high' | 'medium' | 'low' // high = always show, medium = hide on small mobile, low = hide on mobile
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
  emptyMessage?: string
  loading?: boolean
  mobileCardView?: boolean // Enable card view on mobile instead of horizontal scroll
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className = '',
  emptyMessage = 'Нет данных',
  loading = false,
  mobileCardView = false
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={`bg-white/20 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/40 border-t-slate-600 rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-2">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white/20 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  // Mobile Card View
  if (mobileCardView) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden lg:block">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={String(column.key)}
                        className={`
                          px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider
                          ${column.align === 'center' ? 'text-center' : ''}
                          ${column.align === 'right' ? 'text-right' : ''}
                          ${column.width ? column.width : ''}
                        `}
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {data.map((item, rowIndex) => (
                    <motion.tr
                      key={item.id || rowIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rowIndex * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {columns.map((column) => {
                        const value = column.key.includes('.') 
                          ? column.key.split('.').reduce((obj, key) => obj?.[key], item)
                          : item[column.key as keyof T]
                        
                        return (
                          <td
                            key={String(column.key)}
                            className={`
                              px-4 py-4 whitespace-nowrap text-sm
                              ${column.align === 'center' ? 'text-center' : ''}
                              ${column.align === 'right' ? 'text-right' : ''}
                            `}
                          >
                            {column.render ? column.render(value, item, rowIndex) : value}
                          </td>
                        )
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Cards - Shown on Mobile */}
        <div className="lg:hidden space-y-4">
          {data.map((item, rowIndex) => (
            <motion.div
              key={item.id || rowIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-2xl p-4 space-y-3"
              style={{
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              {columns
                .filter(column => column.priority !== 'low')
                .map((column) => {
                  const value = column.key.includes('.') 
                    ? column.key.split('.').reduce((obj, key) => obj?.[key], item)
                    : item[column.key as keyof T]
                  
                  return (
                    <div 
                      key={String(column.key)} 
                      className={`flex justify-between items-center ${
                        column.priority === 'medium' ? 'hidden sm:flex' : ''
                      }`}
                    >
                      <div className="text-sm text-gray-900 font-normal flex-1 min-w-0 mr-3">
                        {column.render ? column.render(value, item, rowIndex) : value}
                      </div>
                      <span className="text-sm font-normal text-gray-500 text-right flex-shrink-0">{column.title}</span>
                    </div>
                  )
                })}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Default Table View with Responsive Columns
  return (
    <div 
      className={`
        bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl overflow-hidden relative group
        shadow-2xl hover:shadow-3xl transition-all duration-500 ${className}
      `}
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.2) 0%, 
            rgba(255, 255, 255, 0.1) 50%, 
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        backdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: `
          0 20px 40px rgba(0,0,0,0.1),
          0 1px 0 rgba(255,255,255,0.2) inset
        `,
      }}
    >
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          style={{
            transform: 'translateX(-100%)',
            animation: 'shimmer 3s ease-in-out infinite'
          }}
        />
      </div>
      
      <div className="overflow-x-auto relative">
        <table className="w-full">
          <thead className="bg-white/10 border-b border-white/20 relative">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider
                    transition-colors duration-200 hover:text-gray-900
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.width ? column.width : ''}
                    ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                    ${column.priority === 'low' ? 'hidden lg:table-cell' : ''}
                    ${column.priority === 'medium' ? 'hidden sm:table-cell' : ''}
                  `}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {data.map((item, rowIndex) => (
              <motion.tr
                key={item.id || rowIndex}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  scale: 1.005,
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  delay: rowIndex * 0.03,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="hover:bg-white/10 transition-all duration-300 ease-out relative group/row"
                style={{
                  backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.02) 50%, transparent 100%)"
                }}
              >
                {columns.map((column) => {
                  const value = column.key.includes('.') 
                    ? column.key.split('.').reduce((obj, key) => obj?.[key], item)
                    : item[column.key as keyof T]
                  
                  return (
                    <td
                      key={String(column.key)}
                      className={`
                        px-4 py-4 whitespace-nowrap text-sm
                        ${column.align === 'center' ? 'text-center' : ''}
                        ${column.align === 'right' ? 'text-right' : ''}
                        ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                        ${column.priority === 'low' ? 'hidden lg:table-cell' : ''}
                        ${column.priority === 'medium' ? 'hidden sm:table-cell' : ''}
                      `}
                    >
                      {column.render ? column.render(value, item, rowIndex) : value}
                    </td>
                  )
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
