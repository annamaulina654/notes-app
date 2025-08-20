"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardSkeleton } from "@/components/ui/card-skeleton"
import { Plus, Search, Edit, Trash2, FileText, Filter, X, SortAsc, SortDesc } from "lucide-react"
import type { Note } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // <-- 1. Impor AlertDialog
import { toast } from "sonner"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type SortOption = "updated-desc" | "updated-asc" | "title-asc" | "title-desc" | "created-desc" | "created-asc";

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Ganti `useEffect` ini untuk menyertakan `sortBy`
  useEffect(() => {
    fetchNotes();
    // fetchCategories hanya perlu dipanggil sekali
  }, [debouncedSearchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchQuery) params.append("query", debouncedSearchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      params.append("sortBy", sortBy); // <-- Tambahkan parameter sortBy

      const response = await fetch(`/api/notes?${params}`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const deleteNote = async (id: string) => {
    // 1. Cari catatan yang akan dihapus dari state saat ini
    const noteToDelete = notes.find(note => note.id === id);
    if (!noteToDelete) return;

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Note has been deleted.");

        // 2. Cek apakah ini catatan terakhir dalam kategori yang sedang aktif
        const isLastInCategory = notes.filter(n => n.category === noteToDelete.category).length === 1;
        if (selectedCategory === noteToDelete.category && isLastInCategory) {
          // Jika ya, kembalikan filter ke "All Notes"
          setSelectedCategory("all");
        }

        // 3. Muat ulang daftar catatan DAN daftar kategori dari server
        fetchNotes();
        fetchCategories();
      } else {
        toast.error("Failed to delete note.");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("updated-desc")
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || sortBy !== "updated-desc"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const getSortLabel = (sort: SortOption) => {
    const labels = {
      "updated-desc": "Recently Updated",
      "updated-asc": "Oldest Updated",
      "created-desc": "Recently Created",
      "created-asc": "Oldest Created",
      "title-asc": "Title A-Z",
      "title-desc": "Title Z-A",
    }
    return labels[sort]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">NotesApp</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button asChild>
                <Link href="/notes/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">Filters & Sorting</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="updated-desc">
                          <div className="flex items-center">
                            <SortDesc className="h-4 w-4 mr-2" />
                            Recently Updated
                          </div>
                        </SelectItem>
                        <SelectItem value="updated-asc">
                          <div className="flex items-center">
                            <SortAsc className="h-4 w-4 mr-2" />
                            Oldest Updated
                          </div>
                        </SelectItem>
                        <SelectItem value="created-desc">
                          <div className="flex items-center">
                            <SortDesc className="h-4 w-4 mr-2" />
                            Recently Created
                          </div>
                        </SelectItem>
                        <SelectItem value="created-asc">
                          <div className="flex items-center">
                            <SortAsc className="h-4 w-4 mr-2" />
                            Oldest Created
                          </div>
                        </SelectItem>
                        <SelectItem value="title-asc">
                          <div className="flex items-center">
                            <SortAsc className="h-4 w-4 mr-2" />
                            Title A-Z
                          </div>
                        </SelectItem>
                        <SelectItem value="title-desc">
                          <div className="flex items-center">
                            <SortDesc className="h-4 w-4 mr-2" />
                            Title Z-A
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Notes
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setSelectedCategory("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {sortBy !== "updated-desc" && (
                <Badge variant="secondary" className="gap-1">
                  Sort: {getSortLabel(sortBy)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setSortBy("updated-desc")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Menampilkan 6 kerangka kartu saat memuat */}
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first note."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mr-2 bg-transparent">
                Clear Filters
              </Button>
            )}
            <Button asChild>
              <Link href="/notes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">{note.title}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/notes/${note.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the note titled "{note.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteNote(note.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {note.category && (
                    <Badge variant="secondary" className="w-fit">
                      {note.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">{truncateContent(note.content)}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated {formatDate(note.updatedAt)}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/notes/${note.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}