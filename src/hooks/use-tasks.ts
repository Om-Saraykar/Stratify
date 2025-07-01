// hooks/useTasks.ts
"use client"

import { useEffect, useState, useCallback } from "react"

export function useTasks() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks")
    const data = await res.json()
    setTasks(data)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return { tasks, refetchTasks: fetchTasks }
}
