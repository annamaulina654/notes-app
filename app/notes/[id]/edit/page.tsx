"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import type { Note } from "@/lib/storage"
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
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";


export default function EditNotePage() {
  const params = useParams()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchNote(params.id as string)
    }
  }, [params.id])

  const fetchNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`)
      if (response.ok) {
        const data = await response.json()
        const noteData = data.note
        setNote(noteData)
        setTitle(noteData.title)
        setContent(noteData.content)
        setCategory(noteData.category || "")
      } else {
        console.error("Note not found")
        router.push("/")
      }
    } catch (error) {
      console.error("Error fetching note:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !note) return

    setSaving(true)
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: category.trim() || undefined,
        }),
      })

      if (response.ok) {
        toast.success("Note has been updated successfully.")
        router.push(`/notes/${note.id}`)
      } else {
        const error = await response.json()
        toast.error("Uh oh! Something went wrong.", { description: error.error || "Failed to update note" })
      }
    } catch (error) {
      console.error("Error updating note:", error)
      toast.error("Uh oh! Something went wrong.", { description: "Failed to update note" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!note) return

    try {
      const response = await fetch(`/api/notes/${note.id}`, { method: "DELETE" })
      if (response.ok) {
        // 3. Ganti juga di sini
        toast.success("Note has been deleted.")
        router.push("/")
      } else {
        toast.error("Error", { description: "Failed to delete note" })
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast.error("Error", { description: "Failed to delete note" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading note...</div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Note not found</h2>
          <p className="text-muted-foreground mb-4">The note you're trying to edit doesn't exist.</p>
          <Button asChild>
            <Link href="/">Back to Notes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/notes/${note.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Edit Note</h1>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={saving || !title.trim() || !content.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will overwrite the current version of the note. Are you sure you want to save?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  maxLength={200}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">{title.length}/200 characters</p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Category (optional)
                </label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Work, Personal, Ideas..."
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                  Content *
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note content here..."
                  rows={12}
                  required
                />
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
