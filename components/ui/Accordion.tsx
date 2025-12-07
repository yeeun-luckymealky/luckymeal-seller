'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  rightElement?: ReactNode
}

export function Accordion({ title, children, defaultOpen = false, rightElement }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <div className="flex items-center gap-2">
          {rightElement}
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">{children}</div>
      </div>
    </div>
  )
}
