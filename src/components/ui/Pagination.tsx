import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showPageNumbers?: boolean
  maxVisiblePages?: number
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const delta = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - delta)
    let end = Math.min(totalPages, currentPage + delta)

    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1)
      } else {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 1
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">
          Страница {currentPage} из {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Назад</span>
        </button>

        {showPageNumbers && (
          <>
            {/* First page */}
            {showStartEllipsis && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </>
            )}

            {/* Visible pages */}
            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page */}
            {showEndEllipsis && (
              <>
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Далее</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
