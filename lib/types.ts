// lib/types.ts
// Type definitions untuk aplikasi Notes

export type Note = {
  id: string
  title: string
  content: string
  category: string | null
  createdAt: string // ISO string dari database
  updatedAt: string // ISO string dari database
}

export type CreateNoteInput = {
  title: string
  content: string
  category?: string | null
}

export type UpdateNoteInput = {
  title?: string
  content?: string
  category?: string | null
}

export type NotesResponse = {
  notes: Note[]
}

export type NoteResponse = {
  note: Note
}

export type CategoriesResponse = {
  categories: string[]
}

export type ErrorResponse = {
  error: string
}