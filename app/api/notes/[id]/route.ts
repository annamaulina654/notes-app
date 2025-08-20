import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, content, category } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category?.trim() || null,
      },
    });

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}