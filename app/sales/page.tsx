'use client'

import { useEffect, useState, useCallback } from 'react'
import { Bell, BellOff, UserPlus, ChevronRight, ChevronLeft, Package, Clock, Minus, Plus, Settings } from 'lucide-react'
import { Toggle, Button, Badge, Modal, Toast } from '@/components/ui'
import { useAppStore } from '@/lib/store'

export default function SalesSettingsPage() {
  const {
    timeSlots,
    setTimeSlots,
    updateTimeSlot,
    luckyBagSettings,
    setLuckyBagSettings,
    staff,
    setStaff,
    toast,
    showToast,
    hideToast,
  } = useAppStore()

  const [quantity, setQuantity] = useState(15)
  const [originalPrice, setOriginalPrice] = useState(9800)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingToggle, setPendingToggle] = useState<{ id: string; newValue: boolean } | null>(null)
  const [hasQuantityChange, setHasQuantityChange] = useState(false)
  const [hasPriceChange, setHasPriceChange] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    try {
      const [slotsRes, settingsRes, staffRes] = await Promise.all([
        fetch('/api/timeslots'),
        fetch('/api/settings'),
        fetch('/api/staff'),
      ])

      const slotsData = await slotsRes.json()
      const settingsData = await settingsRes.json()
      const staffData = await staffRes.json()

      setTimeSlots(slotsData)
      setLuckyBagSettings(settingsData)
      setStaff(staffData)

      if (settingsData) {
        setQuantity(settingsData.quantity)
        setOriginalPrice(settingsData.originalPrice)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('데이터를 불러오는데 실패했습니다', 'error')
    }
  }, [setTimeSlots, setLuckyBagSettings, setStaff, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleToggleTimeSlot = (slotId: string, currentValue: boolean) => {
    if (currentValue) {
      setPendingToggle({ id: slotId, newValue: false })
      setShowConfirmModal(true)
    } else {
      confirmToggle(slotId, true)
    }
  }

  const confirmToggle = async (slotId: string, newValue: boolean) => {
    try {
      const res = await fetch(`/api/timeslots/${slotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newValue }),
      })

      if (res.ok) {
        updateTimeSlot(slotId, { isActive: newValue })
        showToast(newValue ? '영업이 시작되었습니다' : '영업이 중단되었습니다', 'success')
      }
    } catch (error) {
      console.error('Error toggling time slot:', error)
      showToast('변경에 실패했습니다', 'error')
    }
    setShowConfirmModal(false)
    setPendingToggle(null)
  }

  const handleQuantityChange = (newValue: number) => {
    setQuantity(newValue)
    setHasQuantityChange(newValue !== luckyBagSettings?.quantity)
  }

  const handlePriceChange = (newValue: number) => {
    setOriginalPrice(newValue)
    setHasPriceChange(newValue !== luckyBagSettings?.originalPrice)
  }

  const saveQuantity = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })

      if (res.ok) {
        setLuckyBagSettings({ ...luckyBagSettings!, quantity })
        setHasQuantityChange(false)
        showToast('수량이 변경되었습니다', 'success')
      }
    } catch (error) {
      console.error('Error saving quantity:', error)
      showToast('수량 변경에 실패했습니다', 'error')
    }
  }

  const savePrice = async () => {
    try {
      const salePrice = Math.round(originalPrice * 0.7)
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalPrice, salePrice }),
      })

      if (res.ok) {
        setLuckyBagSettings({ ...luckyBagSettings!, originalPrice, salePrice })
        setHasPriceChange(false)
        showToast('가격이 변경되었습니다', 'success')
      }
    } catch (error) {
      console.error('Error saving price:', error)
      showToast('가격 변경에 실패했습니다', 'error')
    }
  }

  const toggleStaffNotification = async (staffId: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/staff/${staffId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifyEnabled: !currentValue }),
      })

      if (res.ok) {
        const updatedStaff = staff.map((s) =>
          s.id === staffId ? { ...s, notifyEnabled: !currentValue } : s
        )
        setStaff(updatedStaff)
        showToast('알림 설정이 변경되었습니다', 'success')
      }
    } catch (error) {
      console.error('Error toggling notification:', error)
      showToast('알림 설정 변경에 실패했습니다', 'error')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const salePrice = Math.round(originalPrice * 0.7)
  const netAmount = Math.round(salePrice * 0.93)

  const pendingSlot = pendingToggle ? timeSlots.find((s) => s.id === pendingToggle.id) : null
  const pendingOrderCount = pendingSlot?._count?.orders || 0

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()
    return { daysInMonth, startDayOfWeek }
  }

  const { daysInMonth, startDayOfWeek } = getDaysInMonth(selectedDate)
  const monthYear = selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })

  const activeSlots = timeSlots.filter(s => s.isActive).length
  const totalSlots = timeSlots.length

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Hero Section */}
      <div className="bg-white px-5 pt-14 pb-6">
        <h1 className="text-[26px] font-bold text-[#191F28] tracking-[-0.03em] mb-2">
          판매 설정
        </h1>
        <p className="text-[14px] text-[#6B7684]">
          오늘의 럭키백 판매를 관리하세요
        </p>
      </div>

      {/* Today's Business Status */}
      <div className="bg-white mt-2 px-5 py-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-[#191F28]">오늘의 영업</h2>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${activeSlots > 0 ? 'bg-[#00C853]' : 'bg-[#B0B8C1]'}`} />
            <span className="text-[13px] text-[#6B7684]">
              {activeSlots}/{totalSlots} 시간대 영업중
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {timeSlots.map((slot, index) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-4 bg-[#F2F4F6] rounded-[16px] animate-toss-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${slot.isActive ? 'bg-[#00C853]' : 'bg-[#E5E8EB]'}
                `}>
                  <Clock className={`w-5 h-5 ${slot.isActive ? 'text-white' : 'text-[#B0B8C1]'}`} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#191F28]">
                    {slot.startTime}~{slot.endTime}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={slot.isActive ? 'success' : 'default'} size="sm">
                      {slot.isActive ? '영업중' : '대기'}
                    </Badge>
                    <span className="text-[12px] text-[#6B7684]">
                      {slot._count?.orders || 0}/{slot.maxOrders}건 예약
                    </span>
                  </div>
                </div>
              </div>
              <Toggle
                checked={slot.isActive}
                onChange={() => handleToggleTimeSlot(slot.id, slot.isActive)}
              />
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3.5 rounded-[14px] bg-[#F2F4F6] text-[14px] font-semibold text-[#6B7684] toss-pressable">
          임시 휴무 설정
        </button>
      </div>

      {/* Lucky Bag Settings */}
      <div className="bg-white mt-2 px-5 py-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-[#191F28]">럭키백 설정</h2>
          <button className="flex items-center gap-0.5 text-[14px] text-[#3182F6] font-medium toss-pressable">
            <Settings className="w-4 h-4" />
            구성 편집
          </button>
        </div>

        {/* Quantity Adjuster */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-medium text-[#6B7684]">판매 수량</span>
            <span className="text-[12px] text-[#B0B8C1]">추천: 20~80개</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F2F4F6] rounded-[16px]">
            <button
              onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] toss-pressable"
            >
              <Minus className="w-5 h-5 text-[#191F28]" />
            </button>
            <div className="text-center">
              <span className="text-[32px] font-bold text-[#191F28]">{quantity}</span>
              <span className="text-[16px] font-medium text-[#6B7684] ml-1">개</span>
            </div>
            <button
              onClick={() => handleQuantityChange(Math.min(100, quantity + 1))}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] toss-pressable"
            >
              <Plus className="w-5 h-5 text-[#191F28]" />
            </button>
          </div>
          {hasQuantityChange && (
            <Button variant="primary" fullWidth className="mt-3" onClick={saveQuantity}>
              수량 변경 저장
            </Button>
          )}
        </div>

        {/* Price Adjuster */}
        <div>
          <span className="text-[14px] font-medium text-[#6B7684] block mb-3">판매 가격</span>
          <div className="flex items-center justify-between p-4 bg-[#F2F4F6] rounded-[16px]">
            <button
              onClick={() => handlePriceChange(Math.max(1000, originalPrice - 100))}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] toss-pressable"
            >
              <Minus className="w-5 h-5 text-[#191F28]" />
            </button>
            <div className="text-center">
              <span className="text-[32px] font-bold text-[#191F28]">{formatPrice(originalPrice)}</span>
              <span className="text-[16px] font-medium text-[#6B7684] ml-1">원</span>
            </div>
            <button
              onClick={() => handlePriceChange(Math.min(50000, originalPrice + 100))}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] toss-pressable"
            >
              <Plus className="w-5 h-5 text-[#191F28]" />
            </button>
          </div>

          {/* Price Summary */}
          <div className="mt-3 p-4 bg-[#EBF4FF] rounded-[14px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-[#6B7684]">판매가 (30% 할인)</span>
              <span className="text-[15px] font-bold text-[#3182F6]">{formatPrice(salePrice)}원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6B7684]">실수령액 (수수료 7%)</span>
              <span className="text-[15px] font-bold text-[#191F28]">{formatPrice(netAmount)}원</span>
            </div>
          </div>

          {hasPriceChange && (
            <Button variant="primary" fullWidth className="mt-3" onClick={savePrice}>
              가격 변경 저장
            </Button>
          )}
        </div>
      </div>

      {/* Pickup Time Calendar */}
      <div className="bg-white mt-2 px-5 py-5">
        <h2 className="text-[18px] font-bold text-[#191F28] mb-5">픽업 시간</h2>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
              )
            }
            className="w-9 h-9 rounded-full bg-[#F2F4F6] flex items-center justify-center toss-pressable"
          >
            <ChevronLeft className="w-5 h-5 text-[#6B7684]" />
          </button>
          <span className="text-[16px] font-bold text-[#191F28]">{monthYear}</span>
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
              )
            }
            className="w-9 h-9 rounded-full bg-[#F2F4F6] flex items-center justify-center toss-pressable"
          >
            <ChevronRight className="w-5 h-5 text-[#6B7684]" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-4">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div key={day} className={`
              py-2 text-[12px] font-semibold
              ${i === 0 ? 'text-[#F04452]' : i === 6 ? 'text-[#3182F6]' : 'text-[#6B7684]'}
            `}>
              {day}
            </div>
          ))}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isWeekend =
              (startDayOfWeek + i) % 7 === 0 || (startDayOfWeek + i) % 7 === 6
            const isActive = !isWeekend
            const isToday = day === new Date().getDate() &&
              selectedDate.getMonth() === new Date().getMonth() &&
              selectedDate.getFullYear() === new Date().getFullYear()

            return (
              <div
                key={day}
                className={`
                  py-2 rounded-full text-[13px] font-medium toss-pressable
                  ${isToday ? 'ring-2 ring-[#3182F6]' : ''}
                  ${isActive
                    ? 'bg-[#E8F9EF] text-[#00A03E]'
                    : 'bg-[#FFEBEE] text-[#E02D3C]'
                  }
                `}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00C853]" />
            <span className="text-[12px] text-[#6B7684]">영업일</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F04452]" />
            <span className="text-[12px] text-[#6B7684]">휴무일</span>
          </div>
        </div>

        <button className="w-full mt-4 py-4 rounded-[14px] flex items-center justify-between px-4 bg-[#F2F4F6] toss-pressable">
          <span className="text-[14px] font-medium text-[#191F28]">기본 픽업 시간 설정</span>
          <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white mt-2 px-5 py-5 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-[#191F28]">알림 설정</h2>
          <button className="flex items-center gap-1 text-[14px] text-[#3182F6] font-medium toss-pressable">
            <UserPlus className="w-4 h-4" />
            직원 초대
          </button>
        </div>

        <div className="space-y-2">
          {staff.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-[#F2F4F6] rounded-[16px] animate-toss-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E5E8EB] flex items-center justify-center">
                  <span className="text-[14px] font-bold text-[#6B7684]">
                    {member.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#191F28]">{member.email}</p>
                  <Badge
                    variant={member.role === 'ADMIN' ? 'info' : 'default'}
                    size="sm"
                  >
                    {member.role === 'ADMIN' ? '관리자' : '직원'}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => toggleStaffNotification(member.id, member.notifyEnabled)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center toss-pressable
                  transition-colors duration-200
                  ${member.notifyEnabled
                    ? 'bg-[#3182F6] text-white'
                    : 'bg-[#E5E8EB] text-[#B0B8C1]'
                  }
                `}
              >
                {member.notifyEnabled ? (
                  <Bell className="w-5 h-5" />
                ) : (
                  <BellOff className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="영업 중단"
      >
        <p className="text-[15px] text-[#6B7684] mb-4">
          {pendingSlot?.startTime}~{pendingSlot?.endTime} 영업을 중단하시겠습니까?
        </p>
        {pendingOrderCount > 0 && (
          <div className="p-4 bg-[#FFF5E6] rounded-[14px] mb-4">
            <p className="text-[14px] text-[#FF9500]">
              현재 예약된 {pendingOrderCount}건의 주문은 유지됩니다.
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => setShowConfirmModal(false)}
          >
            취소
          </Button>
          <Button
            variant="danger"
            size="lg"
            fullWidth
            onClick={() => pendingToggle && confirmToggle(pendingToggle.id, pendingToggle.newValue)}
          >
            확인
          </Button>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}
