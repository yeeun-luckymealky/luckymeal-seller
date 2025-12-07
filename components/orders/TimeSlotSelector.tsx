'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TimeSlot } from '@/lib/store'

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[]
  selectedSlotId: string | null
  onSelectSlot: (slotId: string | null) => void
}

export function TimeSlotSelector({
  timeSlots,
  selectedSlotId,
  onSelectSlot,
}: TimeSlotSelectorProps) {
  const selectedSlot = timeSlots.find((slot) => slot.id === selectedSlotId)
  const currentIndex = selectedSlot ? timeSlots.indexOf(selectedSlot) : 0

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectSlot(timeSlots[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < timeSlots.length - 1) {
      onSelectSlot(timeSlots[currentIndex + 1].id)
    }
  }

  const activeSlot = selectedSlot || timeSlots[0]
  const activeOrderCount = activeSlot?._count?.orders || 0
  const maxOrders = activeSlot?.maxOrders || 15

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {activeSlot?.startTime}~{activeSlot?.endTime} 픽업
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            <span className="text-green-600 font-medium">{activeOrderCount}건</span> 예약 /{' '}
            {maxOrders}건 중
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === timeSlots.length - 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
