"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import CheckboxContainer from "./checkbox-container"

type ChecklistItem = {
  id: string
  text: string
  checked: boolean
}

type Props = {
  title: string
  description: string
  checklist: ChecklistItem[]
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onChecklistChange: (items: ChecklistItem[]) => void
}

export function DataBox({
  title,
  description,
  checklist,
  onTitleChange,
  onDescriptionChange,
  onChecklistChange,
}: Props) {
  const addChecklistItem = () => {
    onChecklistChange([
      ...checklist,
      { id: Date.now().toString(), text: "", checked: false },
    ])
  }

  const updateChecklistItem = (id: string, text: string) => {
    onChecklistChange(
      checklist.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    )
  }

  const toggleChecklistItem = (id: string, checked: boolean) => {
    onChecklistChange(
      checklist.map((item) =>
        item.id === id ? { ...item, checked } : item
      )
    )
  }

  const removeChecklistItem = (id: string) => {
    onChecklistChange(checklist.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />

      <Textarea
        placeholder="Description"
        rows={4}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      <div className="space-y-2">
        <div className="text-sm font-medium">Checklist</div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <CheckboxContainer
                id={item.id}
                text={item.text}
                checked={item.checked}
                onTextChange={(text) => updateChecklistItem(item.id, text)}
                onCheckChange={(checked) =>
                  toggleChecklistItem(item.id, checked)
                }
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeChecklistItem(item.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addChecklistItem}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Checklist Item
          </Button>
        </div>
      </div>
    </div>
  )
}
