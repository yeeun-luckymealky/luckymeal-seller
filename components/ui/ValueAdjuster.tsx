'use client'

import { Minus, Plus } from 'lucide-react'

interface ValueAdjusterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  formatValue?: (value: number) => string
  hint?: string
}

export function ValueAdjuster({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v) => v.toString(),
  hint,
}: ValueAdjusterProps) {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={value <= min}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-xl font-semibold text-gray-900 min-w-[100px] text-center">
          {formatValue(value)}
        </span>
        <button
          type="button"
          onClick={handleIncrease}
          disabled={value >= max}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      {hint && <span className="text-sm text-gray-500">{hint}</span>}
    </div>
  )
}
