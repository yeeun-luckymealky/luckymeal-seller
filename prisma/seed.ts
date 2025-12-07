import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a demo store
  const store = await prisma.store.create({
    data: {
      name: '맛있는 베이커리',
      description: '신선한 빵과 케이크를 판매하는 동네 베이커리',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-1234-5678',
    },
  })

  // Create lucky bag settings
  await prisma.luckyBagSettings.create({
    data: {
      storeId: store.id,
      quantity: 15,
      originalPrice: 9800,
      salePrice: 7000,
      description: '오늘의 신선한 빵 3-4개',
    },
  })

  // Create time slots
  const timeSlot1 = await prisma.timeSlot.create({
    data: {
      storeId: store.id,
      startTime: '17:30',
      endTime: '18:30',
      maxOrders: 15,
      isActive: true,
    },
  })

  const timeSlot2 = await prisma.timeSlot.create({
    data: {
      storeId: store.id,
      startTime: '19:00',
      endTime: '20:00',
      maxOrders: 15,
      isActive: true,
    },
  })

  // Create sample orders
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const orders = [
    {
      orderCode: 'A1234',
      storeId: store.id,
      timeSlotId: timeSlot1.id,
      customerName: '김철수',
      customerPhone: '010-1234-5678',
      quantity: 2,
      totalPrice: 14000,
      status: 'PAID',
      customerRating: 4.8,
      customerOrderCount: 15,
      pickupDate: today,
    },
    {
      orderCode: 'A1235',
      storeId: store.id,
      timeSlotId: timeSlot1.id,
      customerName: '이영희',
      customerPhone: '010-2345-6789',
      quantity: 1,
      totalPrice: 7000,
      status: 'PAID',
      customerRating: 4.5,
      customerOrderCount: 8,
      pickupDate: today,
    },
    {
      orderCode: 'A1236',
      storeId: store.id,
      timeSlotId: timeSlot1.id,
      customerName: '박지민',
      customerPhone: '010-3456-7890',
      quantity: 3,
      totalPrice: 21000,
      status: 'CONFIRMED',
      customerRating: 4.9,
      customerOrderCount: 23,
      pickupDate: today,
    },
    {
      orderCode: 'A1237',
      storeId: store.id,
      timeSlotId: timeSlot2.id,
      customerName: '최수진',
      customerPhone: '010-4567-8901',
      quantity: 1,
      totalPrice: 7000,
      status: 'PAID',
      customerRating: 4.2,
      customerOrderCount: 3,
      pickupDate: today,
    },
    {
      orderCode: 'A1238',
      storeId: store.id,
      timeSlotId: timeSlot1.id,
      customerName: '정민호',
      customerPhone: '010-5678-9012',
      quantity: 2,
      totalPrice: 14000,
      status: 'CANCELED',
      customerRating: 4.0,
      customerOrderCount: 5,
      cancelReason: '고객 요청',
      pickupDate: today,
    },
  ]

  for (const order of orders) {
    await prisma.order.create({ data: order })
  }

  // Create staff
  await prisma.staff.create({
    data: {
      storeId: store.id,
      email: 'admin@bakery.com',
      role: 'ADMIN',
      notifyEnabled: true,
    },
  })

  await prisma.staff.create({
    data: {
      storeId: store.id,
      email: 'staff@bakery.com',
      role: 'STAFF',
      notifyEnabled: false,
    },
  })

  // Create settlements
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  await prisma.settlement.create({
    data: {
      storeId: store.id,
      date: yesterday,
      totalOrders: 12,
      totalAmount: 84000,
      commission: 8400,
      netAmount: 75600,
      status: 'COMPLETED',
    },
  })

  await prisma.settlement.create({
    data: {
      storeId: store.id,
      date: today,
      totalOrders: 5,
      totalAmount: 63000,
      commission: 6300,
      netAmount: 56700,
      status: 'PENDING',
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
