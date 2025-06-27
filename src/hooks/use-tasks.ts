// hooks/useTasks.ts
"use client"

import { useEffect, useState } from "react"

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(data)
      setLoading(false)
    }

    fetchTasks()
  }, [])

  return { tasks, loading }
}
