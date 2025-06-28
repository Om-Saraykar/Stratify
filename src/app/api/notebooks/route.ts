import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// POST: Create a new notebook
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content } = await req.json();

    const notebook = await prisma.notebook.create({
      data: {
        title,
        content,
        userId: session.user.id,
      },
    });

    return NextResponse.json(notebook);
  } catch (error) {
    return NextResponse.json({ error: "Error creating notebook" }, { status: 500 });
  }
}

// GET: Get all notebooks for the logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notebooks = await prisma.notebook.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notebooks);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching notebooks" }, { status: 500 });
  }
}
