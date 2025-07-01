"use client"

import { useEffect, useId, useState } from "react"
import { ClockIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const id = useId()
  const [date, setDate] = useState(value)
  const [time, setTime] = useState("12:00:00")

  useEffect(() => {
    setDate(value)
    setTime(value.toTimeString().slice(0, 8)) // format: HH:mm:ss
  }, [value])

  const updateDateTime = (newDate: Date, timeStr: string) => {
    const [h, m, s] = timeStr.split(":").map(Number)
    const updated = new Date(newDate)
    updated.setHours(h)
    updated.setMinutes(m)
    updated.setSeconds(s)
    onChange(updated)
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return
    setDate(newDate)
    updateDateTime(newDate, time)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    updateDateTime(date, newTime)
  }

  return (
    <div>
      <div className="rounded-md border">
        <Calendar
          mode="single"
          className="p-2"
          selected={date}
          onSelect={handleDateChange}
        />
        <div className="border-t p-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={id} className="text-xs">
              Enter time
            </Label>
            <div className="relative grow">
              <Input
                id={id}
                type="time"
                step="1"
                value={time}
                onChange={handleTimeChange}
                className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ClockIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground mt-4 text-center text-xs">
        Time input –{" "}
        <a
          className="hover:text-foreground underline"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          React DayPicker
        </a>
      </p>
    </div>
  )
}
