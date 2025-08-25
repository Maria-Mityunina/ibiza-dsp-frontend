import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

const ScrollButtons: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToTop}
        className="w-14 h-14 bg-white/90 backdrop-blur-xl border border-black/10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:bg-white hover:scale-110"
        title="Наверх"
      >
        <ChevronUp className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors duration-300 group-hover:-translate-y-1" />
      </button>
    </div>
  )
}

export default ScrollButtons
