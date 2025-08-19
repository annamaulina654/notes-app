import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const notesWithCategories = await prisma.note.findMany({
      where: {
        category: {
          not: null,
        },
      },
      distinct: ['category'],
      select: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      }
    });

    const categories = notesWithCategories.map(note => note.category!).filter(Boolean);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}