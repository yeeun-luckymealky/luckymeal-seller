'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronRight, ArrowUpRight, ArrowDownRight, CreditCard, Clock } from 'lucide-react'
import { Badge, Toast } from '@/components/ui'
import { useAppStore } from '@/lib/store'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function SettlementPage() {
  const { settlements, setSettlements, toast, showToast, hideToast } = useAppStore()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')

  const fetchSettlements = useCallback(async () => {
    try {
      const res = await fetch('/api/settlements')
      const data = await res.json()
      setSettlements(data)
    } catch (error) {
      console.error('Error fetching settlements:', error)
      showToast('정산 내역을 불러오는데 실패했습니다', 'error')
    }
  }, [setSettlements, showToast])

  useEffect(() => {
    fetchSettlements()
  }, [fetchSettlements])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'M월 d일 (E)', { locale: ko })
  }

  // Calculate summary
  const totalAmount = settlements.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalNet = settlements.reduce((sum, s) => sum + s.netAmount, 0)
  const totalCommission = settlements.reduce((sum, s) => sum + s.commission, 0)
  const pendingSettlements = settlements.filter((s) => s.status === 'PENDING')
  const pendingAmount = pendingSettlements.reduce((sum, s) => sum + s.netAmount, 0)

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Hero Section - 토스 스타일 큰 숫자 */}
      <div className="bg-white px-5 pt-14 pb-8">
        <p className="text-[14px] text-[#6B7684] mb-2">이번 달 정산 예정</p>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-[40px] font-bold text-[#191F28] tracking-[-0.03em]">
            {formatPrice(pendingAmount)}
          </span>
          <span className="text-[24px] font-bold text-[#191F28]">원</span>
        </div>

        {/* Period Selector Pills */}
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`
                px-4 py-2 rounded-full text-[14px] font-semibold
                transition-all duration-200 toss-pressable
                ${selectedPeriod === period
                  ? 'bg-[#191F28] text-white'
                  : 'bg-[#F2F4F6] text-[#6B7684]'
                }
              `}
            >
              {period === 'week' ? '이번 주' : period === 'month' ? '이번 달' : '전체'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white mt-2 px-5 py-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F2F4F6] rounded-[16px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#3182F6] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] text-[#6B7684]">총 매출</span>
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">{formatPrice(totalAmount)}원</p>
          </div>
          <div className="bg-[#F2F4F6] rounded-[16px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#F04452] flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] text-[#6B7684]">수수료</span>
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">-{formatPrice(totalCommission)}원</p>
          </div>
        </div>

        {/* Net Amount Banner */}
        <div className="mt-4 bg-[#EBF4FF] rounded-[16px] p-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] text-[#3182F6] font-medium mb-1">실수령액</p>
            <p className="text-[22px] font-bold text-[#3182F6]">{formatPrice(totalNet)}원</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#3182F6] flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Settlement History */}
      <div className="bg-white mt-2 px-5 py-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-[#191F28]">정산 내역</h2>
          <button className="flex items-center gap-0.5 text-[14px] text-[#6B7684] toss-pressable">
            전체보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          {settlements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#F2F4F6] flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-[#B0B8C1]" />
              </div>
              <p className="text-[15px] text-[#6B7684]">아직 정산 내역이 없어요</p>
            </div>
          ) : (
            settlements.map((settlement, index) => (
              <div
                key={settlement.id}
                className="flex items-center justify-between py-4 border-b border-[#F2F4F6] last:border-0 toss-pressable animate-toss-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-11 h-11 rounded-full flex items-center justify-center
                      ${settlement.status === 'COMPLETED' ? 'bg-[#E8F9EF]' : 'bg-[#FFF5E6]'}
                    `}
                  >
                    {settlement.status === 'COMPLETED' ? (
                      <CreditCard className="w-5 h-5 text-[#00C853]" />
                    ) : (
                      <Clock className="w-5 h-5 text-[#FF9500]" />
                    )}
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#191F28]">
                      {formatDate(settlement.date)}
                    </p>
                    <p className="text-[13px] text-[#6B7684] mt-0.5">
                      {settlement.totalOrders}건 판매
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-bold text-[#191F28]">
                    +{formatPrice(settlement.netAmount)}원
                  </p>
                  <Badge
                    variant={settlement.status === 'COMPLETED' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {settlement.status === 'COMPLETED' ? '완료' : '예정'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bank Account Card */}
      <div className="bg-white mt-2 px-5 py-5 mb-4">
        <h2 className="text-[18px] font-bold text-[#191F28] mb-4">정산 계좌</h2>
        <div
          className="
            bg-gradient-to-br from-[#191F28] to-[#333D4B]
            rounded-[20px] p-5 relative overflow-hidden
          "
        >
          {/* Card Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 rounded bg-[#FFD700]" />
                <span className="text-[13px] text-white/60">국민은행</span>
              </div>
              <button className="text-[13px] text-[#3182F6] font-medium toss-pressable">
                변경
              </button>
            </div>

            <p className="text-[20px] font-bold text-white tracking-[0.1em] mb-2">
              123-456-789012
            </p>
            <p className="text-[13px] text-white/60">예금주: 맛있는 베이커리</p>
          </div>
        </div>
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
