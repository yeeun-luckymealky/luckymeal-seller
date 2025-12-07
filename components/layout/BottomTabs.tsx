'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Sliders, Store, PiggyBank } from 'lucide-react'

const tabs = [
  {
    name: '주문',
    href: '/',
    icon: LayoutGrid,
  },
  {
    name: '판매설정',
    href: '/sales',
    icon: Sliders,
  },
  {
    name: '가게',
    href: '/store',
    icon: Store,
  },
  {
    name: '정산',
    href: '/settlement',
    icon: PiggyBank,
  },
]

export function BottomTabs() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white pb-safe z-40">
      {/* Top border with shadow effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-b from-[#E5E8EB] to-transparent" />

      <div className="flex justify-around items-center h-[56px]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex flex-col items-center justify-center flex-1 h-full gap-1
                transition-all duration-200 ease-out
                toss-pressable
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-[#191F28] rounded-b-full" />
              )}

              <Icon
                className={`
                  w-[22px] h-[22px] transition-colors duration-200
                  ${isActive ? 'text-[#191F28]' : 'text-[#B0B8C1]'}
                `}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                className={`
                  text-[11px] font-semibold tracking-[-0.02em] transition-colors duration-200
                  ${isActive ? 'text-[#191F28]' : 'text-[#B0B8C1]'}
                `}
              >
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
