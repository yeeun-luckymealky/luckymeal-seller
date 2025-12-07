'use client'

import { useEffect, useState, useCallback } from 'react'
import { Camera, MapPin, Phone, FileText, ChevronRight, Star, ShoppingBag, TrendingUp, Clock, Calendar, Utensils, MessageSquare } from 'lucide-react'
import { Button, Toast } from '@/components/ui'
import { useAppStore } from '@/lib/store'

export default function StoreManagementPage() {
  const { store, setStore, toast, showToast, hideToast } = useAppStore()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fetchStore = useCallback(async () => {
    try {
      const res = await fetch('/api/store')
      const data = await res.json()
      setStore(data)
      setName(data.name || '')
      setDescription(data.description || '')
      setAddress(data.address || '')
      setPhone(data.phone || '')
    } catch (error) {
      console.error('Error fetching store:', error)
      showToast('가게 정보를 불러오는데 실패했습니다', 'error')
    }
  }, [setStore, showToast])

  useEffect(() => {
    fetchStore()
  }, [fetchStore])

  useEffect(() => {
    if (store) {
      const changed =
        name !== (store.name || '') ||
        description !== (store.description || '') ||
        address !== (store.address || '') ||
        phone !== (store.phone || '')
      setHasChanges(changed)
    }
  }, [name, description, address, phone, store])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, address, phone }),
      })

      if (res.ok) {
        const updatedStore = await res.json()
        setStore({ ...store, ...updatedStore })
        setHasChanges(false)
        showToast('가게 정보가 저장되었습니다', 'success')
      } else {
        showToast('저장에 실패했습니다', 'error')
      }
    } catch (error) {
      console.error('Error saving store:', error)
      showToast('저장에 실패했습니다', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const menuItems = [
    { icon: Clock, label: '영업 시간 설정', href: '#' },
    { icon: Calendar, label: '휴무일 설정', href: '#' },
    { icon: Utensils, label: '메뉴 관리', href: '#' },
    { icon: MessageSquare, label: '리뷰 관리', href: '#', badge: '3' },
  ]

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Hero Section with Store Profile */}
      <div className="bg-white px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[26px] font-bold text-[#191F28] tracking-[-0.03em]">
            가게 관리
          </h1>
          {hasChanges && (
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={isSaving}
            >
              저장
            </Button>
          )}
        </div>

        {/* Store Profile Card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-[20px] bg-[#F2F4F6] flex items-center justify-center overflow-hidden">
              {store?.imageUrl ? (
                <img
                  src={store.imageUrl}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-[#B0B8C1]" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#3182F6] flex items-center justify-center shadow-lg toss-pressable">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-[#191F28]">{name || '가게 이름'}</h2>
            <p className="text-[13px] text-[#6B7684] mt-1">대표 이미지를 설정하세요</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white mt-2 px-5 py-5">
        <h2 className="text-[18px] font-bold text-[#191F28] mb-4">이번 달 통계</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#EBF4FF] rounded-[16px] p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#3182F6] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <p className="text-[24px] font-bold text-[#3182F6]">127</p>
            <p className="text-[12px] text-[#6B7684] mt-1">총 주문</p>
          </div>
          <div className="bg-[#FFF5E6] rounded-[16px] p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FF9500] flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <p className="text-[24px] font-bold text-[#FF9500]">4.8</p>
            <p className="text-[12px] text-[#6B7684] mt-1">평균 평점</p>
          </div>
          <div className="bg-[#E8F9EF] rounded-[16px] p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#00C853] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-[24px] font-bold text-[#00C853]">98%</p>
            <p className="text-[12px] text-[#6B7684] mt-1">픽업률</p>
          </div>
        </div>
      </div>

      {/* Store Info Form */}
      <div className="bg-white mt-2 px-5 py-5">
        <h2 className="text-[18px] font-bold text-[#191F28] mb-5">기본 정보</h2>

        <div className="space-y-5">
          {/* Store Name */}
          <div>
            <label className="block text-[13px] font-medium text-[#6B7684] mb-2">
              가게 이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px]
                text-[15px] text-[#191F28] placeholder-[#B0B8C1]
                focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:bg-white
                transition-all duration-200
              "
              placeholder="가게 이름을 입력하세요"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#6B7684] mb-2">
              <FileText className="w-4 h-4" />
              가게 소개
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="
                w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px]
                text-[15px] text-[#191F28] placeholder-[#B0B8C1]
                focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:bg-white
                transition-all duration-200 resize-none
              "
              placeholder="가게를 소개해주세요"
            />
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#6B7684] mb-2">
              <MapPin className="w-4 h-4" />
              주소
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="
                w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px]
                text-[15px] text-[#191F28] placeholder-[#B0B8C1]
                focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:bg-white
                transition-all duration-200
              "
              placeholder="가게 주소를 입력하세요"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#6B7684] mb-2">
              <Phone className="w-4 h-4" />
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="
                w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px]
                text-[15px] text-[#191F28] placeholder-[#B0B8C1]
                focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:bg-white
                transition-all duration-200
              "
              placeholder="전화번호를 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white mt-2 px-5 py-2 mb-4">
        <h2 className="text-[18px] font-bold text-[#191F28] pt-3 pb-2">빠른 설정</h2>
        <div className="divide-y divide-[#F2F4F6]">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className="
                  w-full py-4 flex items-center justify-between
                  toss-pressable animate-toss-fade-in
                "
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                    <Icon className="w-[18px] h-[18px] text-[#6B7684]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#191F28]">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-[#F04452] text-white text-[11px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Customer Support Card */}
      <div className="bg-white mx-5 mb-8 rounded-[20px] overflow-hidden">
        <div className="bg-gradient-to-br from-[#3182F6] to-[#1B64DA] p-5">
          <h3 className="text-[16px] font-bold text-white mb-1">도움이 필요하신가요?</h3>
          <p className="text-[13px] text-white/80 mb-4">
            가게 운영에 관한 질문이 있으시면 언제든지 문의해주세요
          </p>
          <button className="px-4 py-2.5 bg-white rounded-[12px] text-[14px] font-semibold text-[#3182F6] toss-pressable">
            고객센터 문의하기
          </button>
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
