import { create } from 'zustand'

export interface Order {
  id: string
  orderCode: string
  storeId: string
  timeSlotId: string
  customerName: string
  customerPhone?: string
  quantity: number
  totalPrice: number
  status: 'PAID' | 'CONFIRMED' | 'CANCELED'
  customerRating?: number
  customerOrderCount?: number
  cancelReason?: string
  pickupDate: string
  timeSlot?: {
    startTime: string
    endTime: string
  }
}

export interface TimeSlot {
  id: string
  storeId: string
  startTime: string
  endTime: string
  maxOrders: number
  isActive: boolean
  _count?: {
    orders: number
  }
}

export interface LuckyBagSettings {
  id: string
  storeId: string
  quantity: number
  originalPrice: number
  salePrice: number
  description?: string
}

export interface Staff {
  id: string
  storeId: string
  email: string
  role: 'ADMIN' | 'STAFF'
  notifyEnabled: boolean
}

export interface Settlement {
  id: string
  storeId: string
  date: string
  totalOrders: number
  totalAmount: number
  commission: number
  netAmount: number
  status: 'PENDING' | 'COMPLETED'
}

export interface StoreInfo {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  imageUrl?: string
}

interface ToastState {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
}

interface AppState {
  // Store
  store: StoreInfo | null
  setStore: (store: StoreInfo) => void

  // Orders
  orders: Order[]
  setOrders: (orders: Order[]) => void
  updateOrder: (id: string, updates: Partial<Order>) => void

  // Time Slots
  timeSlots: TimeSlot[]
  setTimeSlots: (slots: TimeSlot[]) => void
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void

  // Lucky Bag Settings
  luckyBagSettings: LuckyBagSettings | null
  setLuckyBagSettings: (settings: LuckyBagSettings) => void

  // Staff
  staff: Staff[]
  setStaff: (staff: Staff[]) => void

  // Settlements
  settlements: Settlement[]
  setSettlements: (settlements: Settlement[]) => void

  // Selected Time Slot
  selectedTimeSlotId: string | null
  setSelectedTimeSlotId: (id: string | null) => void

  // Toast
  toast: ToastState
  showToast: (message: string, type?: ToastState['type']) => void
  hideToast: () => void

  // Loading
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Store
  store: null,
  setStore: (store) => set({ store }),

  // Orders
  orders: [],
  setOrders: (orders) => set({ orders }),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      ),
    })),

  // Time Slots
  timeSlots: [],
  setTimeSlots: (timeSlots) => set({ timeSlots }),
  updateTimeSlot: (id, updates) =>
    set((state) => ({
      timeSlots: state.timeSlots.map((slot) =>
        slot.id === id ? { ...slot, ...updates } : slot
      ),
    })),

  // Lucky Bag Settings
  luckyBagSettings: null,
  setLuckyBagSettings: (luckyBagSettings) => set({ luckyBagSettings }),

  // Staff
  staff: [],
  setStaff: (staff) => set({ staff }),

  // Settlements
  settlements: [],
  setSettlements: (settlements) => set({ settlements }),

  // Selected Time Slot
  selectedTimeSlotId: null,
  setSelectedTimeSlotId: (selectedTimeSlotId) => set({ selectedTimeSlotId }),

  // Toast
  toast: { message: '', type: 'success', isVisible: false },
  showToast: (message, type = 'success') =>
    set({ toast: { message, type, isVisible: true } }),
  hideToast: () =>
    set((state) => ({ toast: { ...state.toast, isVisible: false } })),

  // Loading
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}))
