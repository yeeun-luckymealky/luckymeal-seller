'use client'

import { useEffect, useState } from 'react'
import { Check, X, AlertTriangle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', isVisible, onClose, duration = 2500 }: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 200)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: (
      <div className="w-6 h-6 rounded-full bg-[#00C853] flex items-center justify-center">
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
      </div>
    ),
    error: (
      <div className="w-6 h-6 rounded-full bg-[#F04452] flex items-center justify-center">
        <X className="w-4 h-4 text-white" strokeWidth={3} />
      </div>
    ),
    warning: (
      <div className="w-6 h-6 rounded-full bg-[#FF9500] flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
    ),
    info: (
      <div className="w-6 h-6 rounded-full bg-[#3182F6] flex items-center justify-center">
        <Info className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
    ),
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className={`
          flex items-center gap-3 px-5 py-4
          bg-[#191F28]
          rounded-[16px]
          shadow-[0_8px_24px_rgba(0,0,0,0.24)]
          pointer-events-auto
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isAnimating
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95'
          }
        `}
      >
        {icons[type]}
        <span className="text-[14px] font-medium text-white tracking-[-0.01em]">
          {message}
        </span>
      </div>
    </div>
  )
}
