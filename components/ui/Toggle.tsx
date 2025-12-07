'use client'

import { forwardRef } from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, disabled = false, size = 'md' }, ref) => {
    const sizes = {
      sm: {
        track: 'w-[42px] h-[26px]',
        thumb: 'w-[22px] h-[22px]',
        translate: 'translate-x-[16px]',
        padding: 'p-[2px]',
      },
      md: {
        track: 'w-[51px] h-[31px]',
        thumb: 'w-[27px] h-[27px]',
        translate: 'translate-x-[20px]',
        padding: 'p-[2px]',
      },
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:ring-offset-2
          ${sizes[size].track}
          ${sizes[size].padding}
          ${checked
            ? 'bg-[#3182F6]'
            : 'bg-[#E5E8EB]'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white
            shadow-[0_2px_4px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]
            transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${sizes[size].thumb}
            ${checked ? sizes[size].translate : 'translate-x-0'}
          `}
        />
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'
