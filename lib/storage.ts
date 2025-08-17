// In-memory storage for demo purposes
// In production, this would be replaced with a real database

interface User {
  id: string
  name: string | null
  email: string
  password: string
  createdAt: Date
}

interface Destination {
  id: string
  name: string
  description: string
  price: number
  category: string
  location: string
  image: string
  createdAt: Date
}

interface Booking {
  id: string
  userId: string
  destinationId: string
  visitDate: Date
  quantity: number
  totalPrice: number
  customerName: string
  customerEmail: string
  customerPhone: string
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
  destinations: new Map<string, Destination>(),
  bookings: new Map<string, Booking>(),
  notes: new Map<string, Note>(),
}

// Initialize with sample destinations
const sampleDestinations: Omit<Destination, "id" | "createdAt">[] = [
  {
    name: "Borobudur Temple",
    description: "Ancient Buddhist temple and UNESCO World Heritage site with stunning sunrise views",
    price: 350000,
    category: "Cultural",
    location: "Central Java",
    image: "/borobudur-sunrise.png",
  },
  {
    name: "Komodo National Park",
    description: "Home to the legendary Komodo dragons and pristine marine biodiversity",
    price: 2500000,
    category: "Nature",
    location: "East Nusa Tenggara",
    image: "/komodo-dragon-national-park.png",
  },
  {
    name: "Raja Ampat Islands",
    description: "World-class diving destination with incredible marine life and coral reefs",
    price: 3500000,
    category: "Adventure",
    location: "West Papua",
    image: "/raja-ampat-diving.png",
  },
  {
    name: "Ubud Rice Terraces",
    description: "Breathtaking terraced rice fields and traditional Balinese culture",
    price: 150000,
    category: "Nature",
    location: "Bali",
    image: "/ubud-rice-terraces.png",
  },
  {
    name: "Mount Bromo",
    description: "Active volcano with spectacular sunrise views and lunar-like landscape",
    price: 450000,
    category: "Adventure",
    location: "East Java",
    image: "/mount-bromo-sunrise.png",
  },
  {
    name: "Tana Toraja",
    description: "Unique highland culture with traditional houses and ancient burial sites",
    price: 800000,
    category: "Cultural",
    location: "South Sulawesi",
    image: "/tana-toraja-traditional.png",
  },
  {
    name: "Gili Islands",
    description: "Tropical paradise with crystal clear waters and vibrant coral reefs",
    price: 650000,
    category: "Beach",
    location: "Lombok",
    image: "/gili-islands-beach.png",
  },
  {
    name: "Ancol Dreamland",
    description: "Jakarta's premier entertainment complex with theme parks and beaches",
    price: 200000,
    category: "Entertainment",
    location: "Jakarta",
    image: "/ancol-dreamland.png",
  },
]

// Initialize destinations
sampleDestinations.forEach((dest, index) => {
  const destination: Destination = {
    ...dest,
    id: (index + 1).toString(),
    createdAt: new Date(),
  }
  storage.destinations.set(destination.id, destination)
})

// Initialize with sample notes
const sampleNotes: Omit<Note, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Meeting Notes",
    content: "Discussed project timeline and deliverables. Need to follow up on budget approval.",
    category: "Work",
  },
  {
    title: "Grocery List",
    content: "Milk, eggs, bread, apples, chicken, rice, vegetables",
    category: "Personal",
  },
  {
    title: "Book Ideas",
    content: "1. The Art of Clean Code\n2. Modern Web Development\n3. Building Scalable Applications",
    category: "Ideas",
  },
  {
    title: "Travel Plans",
    content: "Visit Japan in spring 2024. Research cherry blossom season and book flights early.",
    category: "Travel",
  },
  {
    title: "Recipe: Pasta Carbonara",
    content: "Ingredients: pasta, eggs, pancetta, parmesan, black pepper. Cook pasta, mix with egg mixture off heat.",
    category: "Recipes",
  },
]

// Initialize notes
sampleNotes.forEach((note, index) => {
  const newNote: Note = {
    ...note,
    id: (index + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  storage.notes.set(newNote.id, newNote)
})

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

  // Destinations
  getAllDestinations: (): Destination[] => {
    return Array.from(storage.destinations.values())
  },

  findDestinationById: (id: string): Destination | null => {
    return storage.destinations.get(id) || null
  },

  searchDestinations: (query?: string, category?: string, location?: string): Destination[] => {
    let destinations = Array.from(storage.destinations.values())

    if (query) {
      const searchTerm = query.toLowerCase()
      destinations = destinations.filter(
        (dest) => dest.name.toLowerCase().includes(searchTerm) || dest.description.toLowerCase().includes(searchTerm),
      )
    }

    if (category && category !== "all") {
      destinations = destinations.filter((dest) => dest.category === category)
    }

    if (location && location !== "all") {
      destinations = destinations.filter((dest) => dest.location === location)
    }

    return destinations
  },

  // Bookings
  createBooking: (bookingData: Omit<Booking, "id" | "createdAt">): Booking => {
    const id = Date.now().toString()
    const booking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date(),
    }
    storage.bookings.set(id, booking)
    return booking
  },

  getBookingsByUserId: (userId: string): (Booking & { destination: Destination })[] => {
    const userBookings = Array.from(storage.bookings.values())
      .filter((booking) => booking.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return userBookings.map((booking) => {
      const destination = storage.destinations.get(booking.destinationId)!
      return { ...booking, destination }
    })
  },

  getAllBookings: (): Booking[] => {
    return Array.from(storage.bookings.values())
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

    return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
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
