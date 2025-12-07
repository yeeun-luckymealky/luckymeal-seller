import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const settings = await prisma.luckyBagSettings.findUnique({
      where: { storeId: store.id },
    })

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const body = await request.json()

    const settings = await prisma.luckyBagSettings.update({
      where: { storeId: store.id },
      data: body,
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
