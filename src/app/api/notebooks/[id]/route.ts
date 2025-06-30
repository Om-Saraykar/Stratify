import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET: Retrieve a specific notebook for the logged-in user
export async function GET(_: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const notebook = await prisma.notebook.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          {
            SharedNotebook: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
    });

    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }

    return NextResponse.json(notebook);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching notebook" }, { status: 500 });
  }
}

// PUT: Update a notebook owned by the logged-in user
export async function PUT(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { title, content } = await req.json();

  try {
    const hasEditAccess = await prisma.notebook.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          {
            SharedNotebook: {
              some: {
                userId: session.user.id,
                access: "EDIT",
              },
            },
          },
        ],
      },
    });

    if (!hasEditAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updated = await prisma.notebook.update({
      where: { id },
      data: { title, content },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Error updating notebook" }, { status: 500 });
  }
}


// DELETE: Delete a notebook owned by the logged-in user
export async function DELETE(_: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const notebook = await prisma.notebook.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
    }

    await prisma.notebook.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notebook deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting notebook" }, { status: 500 });
  }
}
