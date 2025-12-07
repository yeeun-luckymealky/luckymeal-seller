import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const timeSlot = await prisma.timeSlot.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(timeSlot)
  } catch (error) {
    console.error('Error updating time slot:', error)
    return NextResponse.json({ error: 'Failed to update time slot' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.timeSlot.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting time slot:', error)
    return NextResponse.json({ error: 'Failed to delete time slot' }, { status: 500 })
  }
}
