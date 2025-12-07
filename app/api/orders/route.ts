import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeSlotId = searchParams.get('timeSlotId')
    const date = searchParams.get('date')

    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const where: Record<string, unknown> = { storeId: store.id }

    if (timeSlotId) {
      where.timeSlotId = timeSlotId
    }

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      where.pickupDate = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        timeSlot: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
