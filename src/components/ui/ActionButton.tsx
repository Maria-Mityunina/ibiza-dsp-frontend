import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ActionButtonProps {
  onClick: () => void
  icon: LucideIcon
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullTextOnMobile?: boolean
  shortText?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullTextOnMobile = false,
  shortText
}) => {
  const baseClasses = 'flex items-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white 
      hover:from-slate-800 hover:via-slate-700 hover:to-slate-800
      focus:ring-slate-500 shadow-lg hover:shadow-xl
      relative overflow-hidden group
    `,
    secondary: `
      bg-white/20 backdrop-blur-md text-gray-700 border border-white/30 
      hover:bg-white/30 hover:border-white/40 focus:ring-gray-500
      shadow-lg hover:shadow-xl relative overflow-hidden group
    `,
    danger: `
      bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white 
      hover:from-red-700 hover:via-red-600 hover:to-red-700
      focus:ring-red-500 shadow-lg hover:shadow-xl
      relative overflow-hidden group
    `
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        ${className}
      `}
      style={{
        backgroundSize: variant === 'primary' || variant === 'danger' ? '200% 100%' : undefined,
      }}
    >
      {/* Shimmer effect for primary and danger buttons */}
      {(variant === 'primary' || variant === 'danger') && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      )}
      
      {/* Glass shine effect for secondary button */}
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
      )}
      
      <Icon className={`${iconSizes[size]} relative z-10 transition-transform duration-200 group-hover:rotate-12`} />
      <span className="relative z-10">
        {fullTextOnMobile ? (
          <span>{children}</span>
        ) : (
          <>
            <span className="hidden sm:inline">{children}</span>
            {shortText && <span className="sm:hidden">{shortText}</span>}
          </>
        )}
      </span>
    </button>
  )
}

export default ActionButton
