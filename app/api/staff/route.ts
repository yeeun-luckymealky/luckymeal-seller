import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const staff = await prisma.staff.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const body = await request.json()

    const staff = await prisma.staff.create({
      data: {
        ...body,
        storeId: store.id,
      },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error creating staff:', error)
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 })
  }
}
