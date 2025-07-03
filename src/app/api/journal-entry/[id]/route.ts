import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getAuthSession } from "@/lib/getAuthSession"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, date, image, checklist, stressScore } = body

  const existingEntry = await prisma.journalEntry.findUnique({
    where: { id },
  })

  if (!existingEntry || existingEntry.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    )
  }

  const dataToUpdate: any = {}

  if (title !== undefined) dataToUpdate.title = title
  if (description !== undefined) dataToUpdate.description = description
  if (date !== undefined) dataToUpdate.date = new Date(date)
  if (image !== undefined) dataToUpdate.image = image
  if (typeof stressScore === "number") dataToUpdate.stressScore = stressScore

  if (Array.isArray(checklist)) {
    await prisma.checklistItem.deleteMany({ where: { entryId: id } })
    dataToUpdate.checklist = {
      create: checklist.map((item: any) => ({
        text: item.text,
        checked: item.checked ?? false,
      })),
    }
  }

  try {
    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: dataToUpdate,
      include: { checklist: true },
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error("❌ Failed to update journal entry:", error)
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existingEntry = await prisma.journalEntry.findUnique({
    where: { id },
  })

  if (!existingEntry || existingEntry.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    )
  }

  try {
    await prisma.journalEntry.delete({ where: { id } })
    return NextResponse.json({ message: "Entry deleted" })
  } catch (error) {
    console.error("❌ Failed to delete journal entry:", error)
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    )
  }
}
