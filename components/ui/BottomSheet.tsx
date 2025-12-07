'use client'

import { ReactNode, useEffect, useState } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = 'unset'
      }, 300)
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-[2px]
          transition-opacity duration-300 ease-out
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`
          absolute bottom-0 left-0 right-0
          bg-white
          rounded-t-[24px]
          shadow-[0_-8px_32px_rgba(0,0,0,0.12)]
          max-h-[85vh] overflow-y-auto
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isAnimating ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white">
          <div className="w-9 h-[5px] bg-[#E5E8EB] rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-5 pt-2 pb-4">
            <h2 className="text-[18px] font-bold text-[#191F28] text-center tracking-[-0.02em]">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="px-5 pb-10">{children}</div>
      </div>
    </div>
  )
}
