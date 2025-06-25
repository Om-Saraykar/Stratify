"use client"

import { cn } from "@/lib/utils"
import { transcribeAudio } from "./lib/utils/audio"
import { Chat } from "./ui/chat"
import { useOpenRouterChat } from "./hooks/use-openrouter-chat"

export default function ChatDemo() {
  const {
    messages,
    input,
    isStreaming,
    setMessages,
    handleInputChange,
    handleSubmit,
    append,
    stop,
  } = useOpenRouterChat()

  return (
    <div className={cn("flex flex-col h-full w-full p-4")}>
      <Chat
        className="flex-grow"
        messages={messages}
        setMessages={setMessages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isStreaming}
        append={append}
        stop={stop}
        transcribeAudio={transcribeAudio}
        suggestions={[
          "What is the weather in San Francisco?",
          "Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?",
          "Design a simple algorithm to find the longest palindrome in a string.",
        ]}
      />
    </div>
  )
}
