'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'sm', dot = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#F2F4F6] text-[#6B7684]',
      success: 'bg-[#E8F9EF] text-[#00A03E]',
      warning: 'bg-[#FFF5E6] text-[#CC7A00]',
      danger: 'bg-[#FFEBEE] text-[#E02D3C]',
      info: 'bg-[#EBF4FF] text-[#2272EB]',
      primary: 'bg-[#3182F6] text-white',
    }

    const dotColors = {
      default: 'bg-[#6B7684]',
      success: 'bg-[#00C853]',
      warning: 'bg-[#FF9500]',
      danger: 'bg-[#F04452]',
      info: 'bg-[#3182F6]',
      primary: 'bg-white',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-[11px]',
      md: 'px-2.5 py-1 text-[12px]',
    }

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          font-semibold
          rounded-[6px]
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
