import { type NextRequest, NextResponse } from "next/server"
import { storageHelpers } from "@/lib/storage"

// GET /api/notes - Get all notes with optional search and category filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || undefined
    const category = searchParams.get("category") || undefined

    const notes = storageHelpers.searchNotes(query, category)

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    if (title.length > 200) {
      return NextResponse.json({ error: "Title must be less than 200 characters" }, { status: 400 })
    }

    const note = storageHelpers.createNote({
      title: title.trim(),
      content: content.trim(),
      category: category?.trim() || undefined,
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
