import React from 'react'
import clsx from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  as?: keyof JSX.IntrinsicElements
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  hover = true,
  onClick,
  as: Component = 'div'
}) => {
  const baseClasses = "bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm transition-all duration-200"
  const hoverClasses = hover ? "hover:shadow-lg hover:bg-white/70 hover:border-gray-300/50" : ""
  const interactiveClasses = onClick ? "cursor-pointer" : ""

  return (
    <Component
      className={clsx(baseClasses, hoverClasses, interactiveClasses, className)}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

export default GlassCard

