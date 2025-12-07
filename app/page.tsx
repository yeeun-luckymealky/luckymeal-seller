'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Clock, Package } from 'lucide-react'
import { OrderCard } from '@/components/orders/OrderCard'
import { Toast } from '@/components/ui'
import { useAppStore } from '@/lib/store'

export default function OrderManagementPage() {
  const {
    orders,
    setOrders,
    updateOrder,
    timeSlots,
    setTimeSlots,
    selectedTimeSlotId,
    setSelectedTimeSlotId,
    toast,
    showToast,
    hideToast,
    isLoading,
    setIsLoading,
  } = useAppStore()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [ordersRes, slotsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/timeslots'),
      ])

      const ordersData = await ordersRes.json()
      const slotsData = await slotsRes.json()

      setOrders(ordersData)
      setTimeSlots(slotsData)

      if (slotsData.length > 0 && !selectedTimeSlotId) {
        setSelectedTimeSlotId(slotsData[0].id)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('데이터를 불러오는데 실패했습니다', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setOrders, setTimeSlots, selectedTimeSlotId, setSelectedTimeSlotId, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
    showToast('새로고침 완료', 'success')
  }

  const handleConfirmPickup = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      if (res.ok) {
        updateOrder(orderId, { status: 'CONFIRMED' })
        showToast('픽업이 확인되었습니다', 'success')
      } else {
        showToast('픽업 확인에 실패했습니다', 'error')
      }
    } catch (error) {
      console.error('Error confirming pickup:', error)
      showToast('픽업 확인에 실패했습니다', 'error')
    }
  }

  const handleCancelOrder = async (orderId: string, reason: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELED', cancelReason: reason }),
      })

      if (res.ok) {
        updateOrder(orderId, { status: 'CANCELED', cancelReason: reason })
        showToast('주문이 취소되었습니다', 'warning')
      } else {
        showToast('주문 취소에 실패했습니다', 'error')
      }
    } catch (error) {
      console.error('Error canceling order:', error)
      showToast('주문 취소에 실패했습니다', 'error')
    }
  }

  const filteredOrders = selectedTimeSlotId
    ? orders.filter((order) => order.timeSlotId === selectedTimeSlotId)
    : orders

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const statusOrder = { PAID: 0, CONFIRMED: 1, CANCELED: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const selectedSlot = timeSlots.find((slot) => slot.id === selectedTimeSlotId)
  const paidCount = sortedOrders.filter((o) => o.status === 'PAID').length
  const confirmedCount = sortedOrders.filter((o) => o.status === 'CONFIRMED').length

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[26px] font-bold text-[#191F28] tracking-[-0.03em]">
            주문 관리
          </h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-10 h-10 rounded-full bg-[#F2F4F6] flex items-center justify-center toss-pressable"
          >
            <RefreshCw
              className={`w-5 h-5 text-[#6B7684] ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {/* Time Slot Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
          {timeSlots.map((slot) => {
            const isActive = slot.id === selectedTimeSlotId
            const orderCount = orders.filter(
              (o) => o.timeSlotId === slot.id && o.status !== 'CANCELED'
            ).length

            return (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlotId(slot.id)}
                className={`
                  flex-shrink-0 px-4 py-2.5 rounded-full
                  transition-all duration-200 toss-pressable
                  ${isActive
                    ? 'bg-[#191F28] text-white'
                    : 'bg-[#F2F4F6] text-[#6B7684]'
                  }
                `}
              >
                <span className="text-[14px] font-semibold whitespace-nowrap">
                  {slot.startTime}~{slot.endTime}
                </span>
                {orderCount > 0 && (
                  <span className={`
                    ml-1.5 text-[13px] font-bold
                    ${isActive ? 'text-[#3182F6]' : 'text-[#3182F6]'}
                  `}>
                    {orderCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats Summary */}
      {selectedSlot && (
        <div className="bg-white mt-2 px-5 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EBF4FF] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#3182F6]" />
              </div>
              <div>
                <p className="text-[12px] text-[#6B7684]">대기중</p>
                <p className="text-[18px] font-bold text-[#191F28]">{paidCount}건</p>
              </div>
            </div>
            <div className="w-px h-8 bg-[#E5E8EB]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E8F9EF] flex items-center justify-center">
                <Package className="w-4 h-4 text-[#00C853]" />
              </div>
              <div>
                <p className="text-[12px] text-[#6B7684]">픽업완료</p>
                <p className="text-[18px] font-bold text-[#191F28]">{confirmedCount}건</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order List */}
      <div className="px-5 py-4 space-y-3">
        {isLoading && sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full bg-[#F2F4F6] flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-[#B0B8C1] animate-spin" />
            </div>
            <p className="text-[14px] text-[#6B7684]">주문을 불러오는 중...</p>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#F2F4F6] flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-[#B0B8C1]" />
            </div>
            <p className="text-[16px] font-medium text-[#191F28] mb-1">아직 주문이 없어요</p>
            <p className="text-[14px] text-[#6B7684]">이 시간대에 예약된 주문이 없습니다</p>
          </div>
        ) : (
          sortedOrders.map((order, index) => (
            <div
              key={order.id}
              className="animate-toss-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <OrderCard
                order={order}
                onConfirmPickup={handleConfirmPickup}
                onCancelOrder={handleCancelOrder}
              />
            </div>
          ))
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}
