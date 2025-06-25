import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { date: 'desc' },
    include: { checklist: true }
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, date, image, checklist = [] } = body;

  const entry = await prisma.journalEntry.create({
    data: {
      title,
      description,
      date: new Date(date),
      image,
      checklist: {
        create: checklist.map((item: any) => ({
          text: item.text,
          checked: item.checked ?? false
        }))
      }
    },
    include: { checklist: true }
  });

  return NextResponse.json(entry, { status: 201 });
}
