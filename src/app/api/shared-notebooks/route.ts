import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

// GET: Get all notebooks shared with the logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const shared = await prisma.sharedNotebook.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        notebook: {
          include: {
            user: true, // To get the owner's email
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = shared.map((s) => ({
      id: s.notebook.id,
      title: s.notebook.title,
      createdAt: s.notebook.createdAt,
      access: s.access,
      ownerEmail: s.notebook.user.email,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching shared notebooks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { notebookId, email, access } = await req.json();

    if (!notebookId || !email || !access) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the user to share with
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent sharing with self
    if (targetUser.id === session.user.id) {
      return NextResponse.json({ error: "Cannot share notebook with yourself" }, { status: 400 });
    }

    // Check if already shared
    const alreadyShared = await prisma.sharedNotebook.findUnique({
      where: {
        notebookId_userId: {
          notebookId,
          userId: targetUser.id,
        },
      },
    });

    if (alreadyShared) {
      return NextResponse.json({ error: "Notebook already shared with this user" }, { status: 409 });
    }

    // Create new shared notebook entry
    await prisma.sharedNotebook.create({
      data: {
        notebookId,
        userId: targetUser.id,
        access, // must be "VIEW" or "EDIT"
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SHARE_NOTEBOOK_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
