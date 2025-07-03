import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

// GET: Fetch all journal entries for the logged-in user
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    include: { checklist: true },
  })

  return NextResponse.json(entries)
}

// POST: Create a new journal entry for the logged-in user
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, date, image, checklist = [] } = body

  const entry = await prisma.journalEntry.create({
    data: {
      title,
      description,
      date: new Date(date),
      image,
      userId: session.user.id,
      checklist: {
        create: checklist.map((item: any) => ({
          text: item.text,
          checked: item.checked ?? false,
        })),
      },
    },
    include: { checklist: true },
  })

  return NextResponse.json(entry, { status: 201 })
}
