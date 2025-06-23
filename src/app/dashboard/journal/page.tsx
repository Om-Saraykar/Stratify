"use client"

import { useState } from "react"
import { NewNoteDialog } from "@/components/journal/new-note-dialog"
import { NoteCard } from "@/components/journal/note-card"

export default function Journal() {
  const [notes, setNotes] = useState<any[]>([
    // --- DAILY LIFE ENTRIES (One entry per day, written at day's end) ---
    
    {
      id: "day-2",
      title: "Wednesday: Meeting After Meeting",
      description: "What a day of back-to-back virtual meetings. My brain felt fried by noon, and I struggled to focus on any actual tasks between calls. It was tough to catch up, and everything felt so fragmented. The only break was a short walk outside, which helped a little, but I ended the day pretty drained.",
      date: "2025-06-18T20:00:00.000Z", // Wednesday evening
      image: "" // Image reflecting meetings/office
    },
    {
      id: "day-3",
      title: "Tuesday's Tech Troubles",
      description: "Started the day with a really frustrating internet glitch. It took almost an hour to sort out, which was just what I didn't need when I had a big file to upload first thing. That put me behind, and the rest of the day felt like I was constantly playing catch-up. On a brighter note, I'm already looking forward to the weekend, even though I know I have that online course module and laundry to tackle.",
      date: "2025-06-17T22:15:00.000Z", // Tuesday evening
      checklist: [
        { id: "c6", text: "Complete online course module", checked: false },
        { id: "c7", text: "Do laundry", checked: false },
        { id: "c8", text: "Confirm hike with Sarah", checked: false }
      ],
      image: "" // Image reflecting tech/frustration
    },
    {
      id: "day-4",
      title: "Monday Blues & Full Inbox",
      description: "Back to the grind after the weekend. My inbox was overflowing, and I spent the first few hours just triaging emails. Had a difficult conversation with a colleague about project scope, which was a bit draining. The thought of the whole week stretching ahead feels a little overwhelming right now. Just want to unwind.",
      date: "2025-06-16T20:45:00.000Z", // Monday evening
      image: "" // No specific image for this one
    },
    {
      id: "day-1",
      title: "Thursday's Hectic Pace",
      description: "Today felt like a marathon. Woke up late and had to scramble, barely catching my bus. My morning was packed with meetings, and the 'Alpha' project deadline is really looming – I spent most of the afternoon trying to tie up loose ends. Even a quick grocery run felt like a chore with how crowded the store was. I'm honestly too tired for yoga tonight, a quiet evening with a book it is. My back's been a bit stiff from sitting all day.",
      date: "2025-06-15T21:30:00.000Z", // Thursday evening
      checklist: [
        { id: "c1", text: "Finalize presentation slides", checked: false },
        { id: "c2", text: "Integrate latest user data", checked: false },
        { id: "c3", text: "Review legal disclaimers", checked: false },
        { id: "c4", text: "Respond to client feedback (Alpha project)", checked: false },
        { id: "c5", text: "Prepare for tomorrow's stand-up", checked: false }
      ],
      image: "/demo-images/4.jpg" // Image reflecting work/tiredness
    },
  // --- DAILY LIFE ENTRIES END ---
  ] );

  // Add a new note with a unique id and the date selected in the dialog
  const handleNoteAdd = (note: any) => {
    // The NewNoteDialog already provides the date from its state or initialNote.date
    const newNote = { ...note, id: crypto.randomUUID() };
    setNotes((prev) => [newNote, ...prev])
  }

  // Edit note by id
  const handleNoteEdit = (id: string, updatedNote: any) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updatedNote } : n))
    )
  }

  // Delete note by id
  const handleNoteDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Journal</h1>
        <NewNoteDialog onSave={handleNoteAdd} /> {/* This is for adding new notes */}
      </div>

      {/* Note Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            {...note}
            // Pass the entire note object to onEdit
            onEdit={(updatedNote) => handleNoteEdit(note.id, updatedNote)}
            onDelete={() => handleNoteDelete(note.id)}
          />
        ))}
      </div>
    </div>
  )
}