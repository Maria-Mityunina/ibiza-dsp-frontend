import React from 'react'
import { ScrollButtons, ToastContainer } from '@components/ui'
import Breadcrumb from './Breadcrumb'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Clean Monochrome Background */}
      <div className="fixed inset-0 -z-20">
        {/* Simple gradient base */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(249, 250, 251, 1) 0%,
                rgba(243, 244, 246, 0.98) 25%,
                rgba(229, 231, 235, 0.95) 50%,
                rgba(243, 244, 246, 0.98) 75%,
                rgba(249, 250, 251, 1) 100%
              )
            `
          }}
        />
        
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0,0,0,0.03) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.8) 0%, transparent 30%),
              radial-gradient(circle at 50% 10%, rgba(0,0,0,0.02) 0%, transparent 40%),
              radial-gradient(circle at 10% 90%, rgba(255,255,255,0.6) 0%, transparent 35%)
            `,
            backgroundSize: '400px 400px, 300px 300px, 500px 500px, 350px 350px',
            backgroundPosition: '0 0, 150px 150px, 50px 200px, 250px 50px'
          }}
        />
        
        {/* Fine grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      {/* Main Layout Container with Glass Effect */}
      <div className="relative flex flex-col min-h-screen">
        {/* Header with enhanced glass effect */}
        <div className="relative z-50">
          <Header />
        </div>
        
        {/* Page content */}
        <main className="flex-1 relative z-10">
          {/* Breadcrumb - transparent */}
          <div className="w-full">
            <div className="max-w-7xl xxl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xxl:px-16 py-4 sm:py-6">
              <div className="text-gray-700">
                <Breadcrumb />
              </div>
            </div>
          </div>
          
          {/* Page content - properly centered */}
          <div className="w-full">
            <div className="max-w-7xl xxl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xxl:px-16 pb-6">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Scroll Buttons */}
      <ScrollButtons />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default DashboardLayout
