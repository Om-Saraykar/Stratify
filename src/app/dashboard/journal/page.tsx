"use client"

import { useEffect, useState } from "react"
import { NewNoteDialog } from "@/components/journal/new-note-dialog"
import { NoteCard } from "@/components/journal/note-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MdSmartToy } from "react-icons/md"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { SkeletonCard } from "@/components/journal/journal-skeleton" 

interface ChecklistItem {
  id?: string
  text: string
  checked: boolean
}

interface JournalEntry {
  id: string
  title: string
  description: string
  date: string
  image?: string
  checklist?: ChecklistItem[]
  stressScore?: number | null
}

interface StressSummary {
  level: string
  emoji: string
  advice: string
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<StressSummary | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/journal-entry")
        const data = await res.json()
        setEntries(data)
      } catch (err) {
        console.error("❌ Failed to fetch journal entries:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  const handleEntryAdd = async (entry: Omit<JournalEntry, "id">) => {
    const res = await fetch("/api/journal-entry", {
      method: "POST",
      body: JSON.stringify(entry),
      headers: { "Content-Type": "application/json" },
    })
    const newEntry = await res.json()
    setEntries((prev) => [newEntry, ...prev])
  }

  const handleEntryEdit = async (id: string, updatedEntry: Partial<JournalEntry>) => {
    const res = await fetch(`/api/journal-entry/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedEntry),
      headers: { "Content-Type": "application/json" },
    })
    const updated = await res.json()
    setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)))
  }

  const handleEntryDelete = async (id: string) => {
    await fetch(`/api/journal-entry/${id}`, { method: "DELETE" })
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const handleStressCheck = async () => {
    try {
      const unscoredEntries = entries.filter((entry) => entry.stressScore == null)

      if (unscoredEntries.length === 0) {
        alert("All entries are already analyzed ✅")
        return
      }

      setAnalyzing(true)

      const res = await fetch("/api/ai/stress-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: unscoredEntries }),
      })

      if (!res.ok) throw new Error("AI API returned an error")

      const data = await res.json()
      const analyzedEntries = data.analyzedEntries || []
      const summary = data.summary || null

      await Promise.all(
        analyzedEntries.map(async ({ id, stressScore }: { id: string; stressScore: number }) => {
          try {
            await fetch(`/api/journal-entry/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stressScore }),
            })
          } catch (err) {
            console.error(`❌ Failed to persist stressScore for ${id}`, err)
          }
        })
      )

      setEntries((prev) =>
        prev.map((entry) => {
          const match = analyzedEntries.find((e) => e.id === entry.id)
          return match ? { ...entry, stressScore: match.stressScore } : entry
        })
      )

      setSummary(summary)
    } catch (err) {
      console.error("❌ Stress check failed", err)
      alert("Failed to calculate stress. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="w-6xl mx-auto h-full p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h1 className="text-2xl font-semibold">Your Journal</h1>
        <div className="flex items-center gap-4">
          <Input type="search" placeholder="Search entries" className="max-w-sm" />

          <Button
            variant="outline"
            onClick={handleStressCheck}
            disabled={analyzing}
            className="flex items-center gap-2"
          >
            <MdSmartToy className="text-lg" />
            {analyzing ? "Analyzing..." : "AI Stress Check"}
          </Button>

          {summary && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-lg">
                  {summary.emoji} {summary.level}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 max-w-sm text-sm">
                <p className="mb-1 font-medium text-foreground">{summary.level}</p>
                <p className="mb-2 text-muted-foreground">{summary.advice}</p>
                <p className="text-muted-foreground text-xs italic">
                  Based on AI analysis of your journal entries.
                </p>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <NewNoteDialog onSave={handleEntryAdd} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : entries.map((entry) => (
            <NoteCard
              key={entry.id}
              {...entry}
              stressScore={entry.stressScore ?? undefined}
              onEdit={(updated) => handleEntryEdit(entry.id, updated)}
              onDelete={() => handleEntryDelete(entry.id)}
            />
          ))}
      </div>
    </div>
  )
}
