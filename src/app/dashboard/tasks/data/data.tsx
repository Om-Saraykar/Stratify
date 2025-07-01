import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react"

export const labels = [
  { value: "PERSONAL", label: "Personal" },
  { value: "WORK", label: "Work" },
  { value: "HEALTH", label: "Health" },
  { value: "STUDY", label: "Study" },
  { value: "OTHER", label: "Other" },
]

export const statuses = [
  {
    value: "BACKLOG",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "TODO",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: CircleOff,
  },
]

// 👇 Matches TaskPriority enum
export const priorities = [
  {
    value: "LOW",
    label: "Low",
    icon: ArrowDown,
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: ArrowRight,
  },
  {
    value: "HIGH",
    label: "High",
    icon: ArrowUp,
  },
]
