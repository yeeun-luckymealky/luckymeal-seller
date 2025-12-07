import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const store = await prisma.store.findFirst({
      include: {
        luckyBag: true,
        timeSlots: {
          include: {
            _count: {
              select: { orders: true }
            }
          }
        },
        staff: true,
      },
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json({ error: 'Failed to fetch store' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const store = await prisma.store.findFirst()

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: body,
    })

    return NextResponse.json(updatedStore)
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json({ error: 'Failed to update store' }, { status: 500 })
  }
}
