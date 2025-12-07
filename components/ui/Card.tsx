'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', padding = 'md', variant = 'default', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
      xl: 'p-8',
    }

    const variants = {
      default: `
        bg-white
        rounded-[20px]
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
      `,
      elevated: `
        bg-white
        rounded-[24px]
        shadow-[0_8px_24px_rgba(0,0,0,0.08)]
      `,
      outlined: `
        bg-white
        rounded-[20px]
        border border-[#E5E8EB]
      `,
      filled: `
        bg-[#F2F4F6]
        rounded-[16px]
      `,
    }

    return (
      <div
        ref={ref}
        className={`
          ${variants[variant]}
          ${paddings[padding]}
          transition-shadow duration-200
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
