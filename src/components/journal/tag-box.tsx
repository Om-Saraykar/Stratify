"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  RiBriefcaseLine,
  RiUserHeartLine,
  RiFlashlightLine,
} from "@remixicon/react"

type Props = {
  selectedTag: string
  onSelect: (value: string) => void
}

const labelOptions = [
  { label: "Work", color: "blue", icon: RiBriefcaseLine },
  { label: "Personal", color: "green", icon: RiUserHeartLine },
  { label: "Ideas", color: "purple", icon: RiFlashlightLine },
]

export function TagBox({ selectedTag, onSelect }: Props) {
  return (
    <div>
      <div className="mb-1 text-sm font-medium">Tag</div>
      <RadioGroup
        className="grid grid-cols-3 gap-2"
        value={selectedTag}
        onValueChange={onSelect}
      >
        {labelOptions.map((label, index) => {
          const radioId = `${label.label.toLowerCase()}-${index}`
          const Icon = label.icon

          return (
            <div
              key={label.label}
              className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]"
            >
              <RadioGroupItem
                id={radioId}
                value={label.label}
                className="sr-only"
              />
              <Icon className="opacity-60" size={20} aria-hidden="true" />
              <label
                htmlFor={radioId}
                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
              >
                {label.label}
              </label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
