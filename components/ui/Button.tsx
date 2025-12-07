'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-semibold
      transition-all duration-200
      focus:outline-none
      disabled:opacity-40 disabled:cursor-not-allowed
      toss-pressable
    `

    const variants = {
      primary: `
        bg-[#3182F6] text-white
        hover:bg-[#1B64DA]
        active:bg-[#1554B8]
        shadow-[0_2px_8px_rgba(49,130,246,0.32)]
        hover:shadow-[0_4px_12px_rgba(49,130,246,0.4)]
      `,
      secondary: `
        bg-[#F2F4F6] text-[#191F28]
        hover:bg-[#E5E8EB]
        active:bg-[#D1D6DB]
      `,
      danger: `
        bg-[#F04452] text-white
        hover:bg-[#E02D3C]
        active:bg-[#C41E2A]
        shadow-[0_2px_8px_rgba(240,68,82,0.32)]
      `,
      ghost: `
        bg-transparent text-[#6B7684]
        hover:bg-[#F2F4F6]
        active:bg-[#E5E8EB]
      `,
      text: `
        bg-transparent text-[#3182F6]
        hover:text-[#1B64DA]
        active:text-[#1554B8]
        p-0
      `,
    }

    const sizes = {
      sm: 'h-9 px-4 text-[13px] rounded-[10px]',
      md: 'h-11 px-5 text-[14px] rounded-[12px]',
      lg: 'h-[52px] px-6 text-[15px] rounded-[14px]',
      xl: 'h-[56px] px-8 text-[16px] rounded-[16px]',
    }

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${variant !== 'text' ? sizes[size] : 'text-[14px]'}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
