import React from 'react'

interface MobileBreakpointProps {
  showOnMobile?: React.ReactNode
  showOnTablet?: React.ReactNode
  showOnDesktop?: React.ReactNode
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean
  className?: string
  children?: React.ReactNode
}

const MobileBreakpoint: React.FC<MobileBreakpointProps> = ({
  showOnMobile,
  showOnTablet,
  showOnDesktop,
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  className = '',
  children
}) => {
  // Generate visibility classes
  const getVisibilityClasses = () => {
    let classes = []
    
    if (hideOnMobile) classes.push('hidden')
    if (hideOnTablet) classes.push('sm:hidden')
    if (hideOnDesktop) classes.push('lg:hidden')
    
    // Show classes override hide classes
    if (showOnMobile) classes.push('block')
    if (showOnTablet) classes.push('sm:block')
    if (showOnDesktop) classes.push('lg:block')
    
    return classes.join(' ')
  }

  return (
    <div className={`${getVisibilityClasses()} ${className}`}>
      {/* Mobile content */}
      {showOnMobile && (
        <div className="sm:hidden">
          {showOnMobile}
        </div>
      )}
      
      {/* Tablet content */}
      {showOnTablet && (
        <div className="hidden sm:block lg:hidden">
          {showOnTablet}
        </div>
      )}
      
      {/* Desktop content */}
      {showOnDesktop && (
        <div className="hidden lg:block">
          {showOnDesktop}
        </div>
      )}
      
      {/* Default content */}
      {children}
    </div>
  )
}

// Utility components for common patterns
export const MobileOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`sm:hidden ${className}`}>
    {children}
  </div>
)

export const TabletOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`hidden sm:block lg:hidden ${className}`}>
    {children}
  </div>
)

export const DesktopOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`hidden lg:block ${className}`}>
    {children}
  </div>
)

export const MobileUp: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`block ${className}`}>
    {children}
  </div>
)

export const TabletUp: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`hidden sm:block ${className}`}>
    {children}
  </div>
)

export const DesktopUp: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`hidden lg:block ${className}`}>
    {children}
  </div>
)

export default MobileBreakpoint

