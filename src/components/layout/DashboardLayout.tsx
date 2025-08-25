import React from 'react'
import { ScrollButtons, ToastContainer } from '@components/ui'
import { useUIStore } from '@stores/uiStore'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import Header from './Header'
import { motion } from 'framer-motion'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Water texture background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='water'%3E%3CfeTurbulence baseFrequency='0.05 0.1' numOctaves='3' stitchTiles='stitch'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='8'/%3E%3C/filter%3E%3Cfilter id='ripple'%3E%3CfeTurbulence baseFrequency='0.02 0.03' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.95 0 0 0 0 1 0 0 0 1 0'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc' filter='url(%23water)'/%3E%3Ccircle cx='20%25' cy='30%25' r='100' fill='none' stroke='%23e2e8f0' stroke-width='1' opacity='0.4' filter='url(%23ripple)'/%3E%3Ccircle cx='60%25' cy='70%25' r='80' fill='none' stroke='%23e2e8f0' stroke-width='1' opacity='0.3' filter='url(%23ripple)'/%3E%3Ccircle cx='80%25' cy='20%25' r='60' fill='none' stroke='%23e2e8f0' stroke-width='1' opacity='0.2' filter='url(%23ripple)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.3)_0%,transparent_50%)] bg-[length:600px_600px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,0,0,0.02)_0%,transparent_40%)] bg-[length:400px_400px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.2)_0%,transparent_30%)] bg-[length:300px_300px]" />
      </div>
      
      {/* Main Layout Container */}
      <div className="flex h-screen gap-6">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
        
        {/* Main content area */}
        <motion.div 
          animate={{ 
            marginLeft: sidebarCollapsed ? '0px' : '0px' 
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col min-w-0 pr-6"
        >
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto max-w-full overflow-x-hidden">
            {/* Breadcrumb */}
            <div className="px-8 py-6 border-b border-black/5">
              <div className="text-gray-600">
                <Breadcrumb />
              </div>
            </div>
            
            {/* Page content */}
            <div className="px-8">
              {children}
            </div>
          </main>
        </motion.div>
      </div>

      {/* Notifications - temporarily disabled */}
      {/* <NotificationContainer /> */}
      
      {/* Scroll Buttons */}
      <ScrollButtons />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default DashboardLayout
