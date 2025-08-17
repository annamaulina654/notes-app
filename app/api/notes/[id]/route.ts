import { type NextRequest, NextResponse } from "next/server"
import { storageHelpers } from "@/lib/storage"

// GET /api/notes/[id] - Get a specific note by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const note = storageHelpers.findNoteById(params.id)

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Error fetching note:", error)
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 })
  }
}

// PUT /api/notes/[id] - Update a specific note
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updatedNote = storageHelpers.updateNote(params.id, {
      title: title.trim(),
      content: content.trim(),
      category: category?.trim() || undefined,
    })

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ note: updatedNote })
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

// DELETE /api/notes/[id] - Delete a specific note
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = storageHelpers.deleteNote(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}
