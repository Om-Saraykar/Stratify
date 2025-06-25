"use client"

import { useEffect, useState } from "react"
import { NewNoteDialog } from "@/components/journal/new-note-dialog"
import { NoteCard } from "@/components/journal/note-card"
import { Input } from "@/registry/new-york/ui/input"
import { Button } from "@/registry/default/ui/button"
import { MdSmartToy } from "react-icons/md"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/registry/default/ui/dropdown-menu"

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
  stressScore?: number
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
        console.log("📒 Loaded entries:", data)
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
    console.log("✅ Entry added:", newEntry)
    setEntries((prev) => [newEntry, ...prev])
  }

  const handleEntryEdit = async (id: string, updatedEntry: Partial<JournalEntry>) => {
    const res = await fetch(`/api/journal-entry/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedEntry),
      headers: { "Content-Type": "application/json" },
    })
    const updated = await res.json()
    console.log("✏️ Entry edited:", updated)
    setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)))
  }

  const handleEntryDelete = async (id: string) => {
    await fetch(`/api/journal-entry/${id}`, { method: "DELETE" })
    console.log("🗑️ Entry deleted:", id)
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  useEffect(() => {
    console.log("📋 Entries updated:", entries)
  }, [entries])
  
  const handleStressCheck = async () => {
    try {
      const unscoredEntries = entries.filter((entry) => entry.stressScore === null)
      console.log(unscoredEntries);

      if (unscoredEntries.length === 0) {
        alert("All entries are already analyzed ✅")
        return
      }

      setAnalyzing(true)
      console.log("🔍 Starting stress analysis...")

      const res = await fetch("/api/ai/stress-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: unscoredEntries }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("❌ Error from AI API:", text)
        throw new Error("API returned an error")
      }

      const data = await res.json()
      console.log("✅ AI Response:", data)

      const analyzedEntries = data.analyzedEntries || []
      const summary = data.summary || null

      // 🧠 Save each stress score to DB
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

      // 🧠 Update frontend state
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
    <div>
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <NoteCard
              key={entry.id}
              {...entry}
              onEdit={(updated) => handleEntryEdit(entry.id, updated)}
              onDelete={() => handleEntryDelete(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
