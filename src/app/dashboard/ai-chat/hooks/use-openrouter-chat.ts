"use client"

import { useState } from "react"

type Role = "user" | "assistant"

export interface OpenRouterMessage {
  id: string
  role: Role
  content: string
}

export function useOpenRouterChat() {
  const [messages, setMessages] = useState<OpenRouterMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const append = async (message: { role: Role; content: string }) => {
    const userMessage = {
      id: crypto.randomUUID(),
      ...message,
    }

    const assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: "",
    }

    const updatedMessages = [...messages, userMessage]
    setMessages([...updatedMessages, assistantMessage])
    setIsStreaming(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let streamed = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        streamed += chunk

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id ? { ...msg, content: streamed } : msg
          )
        )
      }
    } catch (err) {
      console.error("Streaming error (append):", err)
    } finally {
      setIsStreaming(false)
    }
  }
  

  const stop = () => {
    // optional: implement abort logic with AbortController
    console.warn("Stop function is not implemented.")
  }

  const handleSubmit = async (e?: { preventDefault?: () => void }) => {
    if (e?.preventDefault) {
      e.preventDefault()
    }    
    if (!input.trim()) return

    const userMessage: OpenRouterMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    }

    const assistantMessage: OpenRouterMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    }

    const updated = [...messages, userMessage]
    setMessages([...updated, assistantMessage])
    setInput("")
    setIsStreaming(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let streamed = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        streamed += chunk

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id ? { ...msg, content: streamed } : msg
          )
        )
      }
    } catch (err) {
      console.error("Streaming failed:", err)
    } finally {
      setIsStreaming(false)
    }
  }

  return {
    messages,
    input,
    isStreaming,
    setMessages,
    handleInputChange,
    handleSubmit,
    append,
    stop,
  }
}
