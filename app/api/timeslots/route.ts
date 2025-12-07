import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    const timeSlots = await prisma.timeSlot.findMany({
      where: { storeId: store.id },
      include: {
        _count: {
          select: {
            orders: {
              where: {
                pickupDate: {
                  gte: today,
                  lte: endOfDay,
                },
                status: {
                  not: 'CANCELED',
                },
              },
            },
          },
        },
      },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json({ error: 'Failed to fetch time slots' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const body = await request.json()

    const timeSlot = await prisma.timeSlot.create({
      data: {
        ...body,
        storeId: store.id,
      },
    })

    return NextResponse.json(timeSlot)
  } catch (error) {
    console.error('Error creating time slot:', error)
    return NextResponse.json({ error: 'Failed to create time slot' }, { status: 500 })
  }
}
