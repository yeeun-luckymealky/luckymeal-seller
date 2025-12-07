'use client'

import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  rightElement?: ReactNode
}

export function Header({ title, subtitle, rightElement }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {rightElement && <div>{rightElement}</div>}
        </div>
      </div>
    </header>
  )
}
