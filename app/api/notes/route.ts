import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// The GET function is already correct. No changes needed here.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query") || undefined;
    const category = searchParams.get("category") || undefined;

    const notes = await prisma.note.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
          } : {},
          category && category !== 'all' ? { category: { equals: category } } : {},
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

// FIX IS APPLIED IN THIS POST FUNCTION
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { title, content, category } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    if (title.length > 200) {
      return NextResponse.json({ error: "Title must be less than 200 characters" }, { status: 400 });
    }

    // This ensures an empty string category becomes null in the database
    const finalCategory = category?.trim() ? category.trim() : null;

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: finalCategory,
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}