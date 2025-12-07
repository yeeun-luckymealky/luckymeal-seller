'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Star, MessageSquare, Flag, X, User } from 'lucide-react'
import { Badge, Button, BottomSheet } from '@/components/ui'
import { Order } from '@/lib/store'

interface OrderCardProps {
  order: Order
  onConfirmPickup: (orderId: string) => void
  onCancelOrder: (orderId: string, reason: string) => void
}

const cancelReasons = [
  { id: 'sold_out', label: '재료 소진' },
  { id: 'closed', label: '영업 종료' },
  { id: 'customer_request', label: '고객 요청' },
  { id: 'other', label: '기타' },
]

export function OrderCard({ order, onConfirmPickup, onCancelOrder }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCancelSheet, setShowCancelSheet] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)

  const getStatusBadge = () => {
    switch (order.status) {
      case 'PAID':
        return <Badge variant="info" dot>예약완료</Badge>
      case 'CONFIRMED':
        return <Badge variant="success" dot>픽업완료</Badge>
      case 'CANCELED':
        return <Badge variant="danger" dot>취소됨</Badge>
      default:
        return null
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  const handleConfirmPickup = () => {
    onConfirmPickup(order.id)
  }

  const handleCancelSubmit = () => {
    if (selectedReason) {
      const reason = cancelReasons.find((r) => r.id === selectedReason)?.label || selectedReason
      onCancelOrder(order.id, reason)
      setShowCancelSheet(false)
      setSelectedReason(null)
    }
  }

  return (
    <>
      <div
        className={`
          bg-white rounded-[20px] overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${order.status === 'CONFIRMED'
            ? 'shadow-[0_2px_8px_rgba(0,200,83,0.15)]'
            : 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
          }
          ${order.status === 'CANCELED' ? 'opacity-50' : ''}
        `}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {getStatusBadge()}
            <span className="text-[15px] font-bold text-[#191F28] tracking-wider">
              {order.orderCode}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                <User className="w-5 h-5 text-[#B0B8C1]" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[#191F28] tracking-[-0.02em]">
                  {order.customerName}
                </p>
                <p className="text-[13px] text-[#6B7684] mt-0.5">
                  럭키백 {order.quantity}개 · {order.timeSlot?.startTime}~{order.timeSlot?.endTime}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-[18px] font-bold text-[#191F28] tracking-[-0.02em]">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {order.status === 'PAID' && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleConfirmPickup}
              >
                <Check className="w-5 h-5 mr-2" strokeWidth={2.5} />
                픽업 확인
              </Button>
            )}
            {order.status === 'CONFIRMED' && (
              <div className="flex-1 h-[52px] rounded-[14px] bg-[#E8F9EF] flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00C853] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-[15px] font-semibold text-[#00A03E]">픽업 완료</span>
              </div>
            )}
            {order.status !== 'CANCELED' && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsExpanded(!isExpanded)}
                className="!px-4"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="px-5 pb-5 pt-1">
            <div className="h-px bg-[#F2F4F6] mb-4" />

            {/* Customer Stats */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                <span className="text-[13px] font-medium text-[#191F28]">
                  {order.customerRating?.toFixed(1) || '-'}
                </span>
              </div>
              <div className="w-px h-3 bg-[#E5E8EB]" />
              <span className="text-[13px] text-[#6B7684]">
                주문 {order.customerOrderCount || 0}회
              </span>
            </div>

            {/* Action Links */}
            <div className="flex gap-2">
              <button className="flex-1 h-10 rounded-[10px] bg-[#F2F4F6] flex items-center justify-center gap-1.5 toss-pressable">
                <MessageSquare className="w-4 h-4 text-[#6B7684]" />
                <span className="text-[13px] font-medium text-[#6B7684]">리뷰</span>
              </button>
              {order.status === 'PAID' && (
                <button
                  className="flex-1 h-10 rounded-[10px] bg-[#FFEBEE] flex items-center justify-center gap-1.5 toss-pressable"
                  onClick={() => setShowCancelSheet(true)}
                >
                  <X className="w-4 h-4 text-[#E02D3C]" />
                  <span className="text-[13px] font-medium text-[#E02D3C]">취소</span>
                </button>
              )}
              <button className="flex-1 h-10 rounded-[10px] bg-[#F2F4F6] flex items-center justify-center gap-1.5 toss-pressable">
                <Flag className="w-4 h-4 text-[#6B7684]" />
                <span className="text-[13px] font-medium text-[#6B7684]">신고</span>
              </button>
            </div>

            {/* Cancel Reason (if canceled) */}
            {order.status === 'CANCELED' && order.cancelReason && (
              <div className="mt-3 p-3 bg-[#FFEBEE] rounded-[12px]">
                <span className="text-[13px] text-[#E02D3C]">
                  취소 사유: {order.cancelReason}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Bottom Sheet */}
      <BottomSheet
        isOpen={showCancelSheet}
        onClose={() => setShowCancelSheet(false)}
        title="주문 취소 사유를 선택해주세요"
      >
        <div className="space-y-2">
          {cancelReasons.map((reason) => (
            <button
              key={reason.id}
              onClick={() => setSelectedReason(reason.id)}
              className={`
                w-full p-4 rounded-[14px] text-left transition-all duration-200 toss-pressable
                ${selectedReason === reason.id
                  ? 'bg-[#EBF4FF] border-2 border-[#3182F6]'
                  : 'bg-[#F2F4F6] border-2 border-transparent'
                }
              `}
            >
              <span className={`
                text-[15px] font-medium
                ${selectedReason === reason.id ? 'text-[#3182F6]' : 'text-[#191F28]'}
              `}>
                {reason.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <Button
            variant="secondary"
            size="xl"
            fullWidth
            onClick={() => setShowCancelSheet(false)}
          >
            닫기
          </Button>
          <Button
            variant="danger"
            size="xl"
            fullWidth
            onClick={handleCancelSubmit}
            disabled={!selectedReason}
          >
            취소하기
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
