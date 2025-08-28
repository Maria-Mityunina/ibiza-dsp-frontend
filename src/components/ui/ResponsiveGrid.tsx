import React from 'react'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  gap?: 'sm' | 'md' | 'lg'
  minItemWidth?: string
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  gap = 'md',
  minItemWidth = '300px',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  }

  // Generate responsive grid classes
  const gridClasses = `
    grid
    grid-cols-${columns.mobile}
    sm:grid-cols-${columns.tablet}
    lg:grid-cols-${columns.desktop}
    xl:grid-cols-${columns.desktop}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div 
      className={`${gridClasses} ${gapClasses[gap]} ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`
      }}
    >
      {children}
    </div>
  )
}

export default ResponsiveGrid

