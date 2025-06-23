import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface CheckboxContainerProps {
  id: string
  text: string
  checked: boolean
  onTextChange: (text: string) => void
  onCheckChange: (checked: boolean) => void
}

export default function CheckboxContainer({
  id,
  text,
  checked,
  onTextChange,
  onCheckChange,
}: CheckboxContainerProps) {
  return (
    <div
      className={`flex items-center gap-2 w-full rounded-md border px-3 py-2 ${checked ? "bg-muted/40" : ""
        }`}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckChange(!!value)}
      />
      <Input
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className={`flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 ${checked ? "line-through text-muted-foreground" : ""
          }`}
        placeholder="Checklist item..."
      />
    </div>
  )
}
