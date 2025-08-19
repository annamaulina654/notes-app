// In-memory storage for demo purposes
// In production, this would be replaced with a real database

interface User {
  id: string
  name: string | null
  email: string
  password: string
  createdAt: Date
}


interface Note {
  id: string
  title: string
  content: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

// In-memory storage
const storage = {
  users: new Map<string, User>(),
  notes: new Map<string, Note>(),
}






// Helper functions
export const storageHelpers = {
  // Users
  createUser: (userData: Omit<User, "id" | "createdAt">): User => {
    const id = Date.now().toString()
    const user: User = {
      ...userData,
      id,
      createdAt: new Date(),
    }
    storage.users.set(id, user)
    return user
  },

  findUserByEmail: (email: string): User | null => {
    for (const user of storage.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user
      }
    }
    return null
  },

  findUserById: (id: string): User | null => {
    return storage.users.get(id) || null
  },





  // Notes
  getAllNotes: (): Note[] => {
    return Array.from(storage.notes.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  },

  findNoteById: (id: string): Note | null => {
    return storage.notes.get(id) || null
  },

  createNote: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
    const id = Date.now().toString()
    const note: Note = {
      ...noteData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    storage.notes.set(id, note)
    return note
  },

  updateNote: (id: string, noteData: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>): Note | null => {
    const existingNote = storage.notes.get(id)
    if (!existingNote) return null

    const updatedNote: Note = {
      ...existingNote,
      ...noteData,
      updatedAt: new Date(),
    }
    storage.notes.set(id, updatedNote)
    return updatedNote
  },

  deleteNote: (id: string): boolean => {
    return storage.notes.delete(id)
  },

  searchNotes: (query?: string, category?: string): Note[] => {
    let notes = Array.from(storage.notes.values())

    if (query) {
      const searchTerm = query.toLowerCase()
      notes = notes.filter(
        (note) => note.title.toLowerCase().includes(searchTerm) || note.content.toLowerCase().includes(searchTerm),
      )
    }

    if (category && category !== "all") {
      notes = notes.filter((note) => note.category === category)
    }

    return notes
  },

  getCategories: (): string[] => {
    const categories = new Set<string>()
    for (const note of storage.notes.values()) {
      if (note.category) {
        categories.add(note.category)
      }
    }
    return Array.from(categories).sort()
  },
}

export type { Note }