import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backPath?: string
  actionButton?: React.ReactNode
  className?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backPath,
  actionButton,
  className = ''
}) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative z-10 ${className}`}
    >
      <div className="py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {backPath && (
              <button
                onClick={() => navigate(backPath)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>
            )}
            <div>
              <h1 
                className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {title}
              </h1>
              {subtitle && (
                <p 
                  className="text-sm text-gray-600 mt-1 font-normal"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {actionButton && (
            <div className="flex-shrink-0">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default PageHeader
