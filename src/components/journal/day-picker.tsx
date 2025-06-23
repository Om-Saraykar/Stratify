"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

interface DayPickerProps {
  date: Date | undefined; // Prop for the selected date
  onDateSelect: (date: Date | undefined) => void; // Prop for handling date selection
}

export default function DayPicker({ date, onDateSelect }: DayPickerProps) {
  // Remove internal state for `date` as it's now controlled by props
  // const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDateSelect} // Use the prop's onSelect
        className="rounded-md border p-2"
      />
    </div>
  )
}