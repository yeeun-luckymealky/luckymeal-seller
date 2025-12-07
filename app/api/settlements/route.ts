import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const store = await prisma.store.findFirst()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const settlements = await prisma.settlement.findMany({
      where: { storeId: store.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(settlements)
  } catch (error) {
    console.error('Error fetching settlements:', error)
    return NextResponse.json({ error: 'Failed to fetch settlements' }, { status: 500 })
  }
}
