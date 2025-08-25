import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <h1 className="text-xl md:text-2xl font-normal text-black">IBIZA</h1>
      </div>

      {/* Background Text - Split Layout */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left - "prime era" */}
        <div className="absolute top-8 left-8 md:top-16 md:left-16 lg:top-20 lg:left-20">
          <div className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] font-normal text-black leading-[0.8] tracking-tight">
            <div>prime</div>
            <div>era</div>
          </div>
        </div>
        
        {/* Bottom Right - "for ads" */}
        <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 lg:bottom-20 lg:right-20">
          <div className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] font-normal text-black leading-[0.8] tracking-tight text-right">
            <div>for</div>
            <div>ads</div>
          </div>
        </div>
      </div>

      {/* Auth Modal - Always Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md lg:max-w-sm xl:max-w-md">
          <div 
            className="rounded-2xl p-6 md:p-8 shadow-2xl"
            style={{
              backgroundColor: 'rgba(48, 48, 48, 0.15)',
              backdropFilter: 'blur(21.6px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
