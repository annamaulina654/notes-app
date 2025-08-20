"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NoteDetailSkeleton } from "@/components/ui/note-detail-skeleton"
import { ArrowLeft, Edit } from "lucide-react"
import type { Note } from "@/lib/storage"
import { Skeleton } from "@/components/ui/skeleton"

export default function ViewNotePage() {
  const params = useParams()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

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
        setNote(data.note)
      } else {
        console.error("Note not found")
      }
    } catch (error) {
      console.error("Error fetching note:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

if (loading) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </header>

      {/* Page Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NoteDetailSkeleton />
      </div>
    </div>
  )
}

  if (!note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Note not found</h2>
          <p className="text-muted-foreground mb-4">The note you're looking for doesn't exist.</p>
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
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-foreground truncate">{note.title}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/notes/${note.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{note.title}</CardTitle>
                {note.category && (
                  <Badge variant="secondary" className="mb-2">
                    {note.category}
                  </Badge>
                )}
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Created: {formatDate(note.createdAt)}</p>
                  <p>Updated: {formatDate(note.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">{note.content}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
