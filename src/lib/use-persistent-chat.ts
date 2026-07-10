import { useEffect, useMemo, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { DefaultChatTransport } from "ai"

import { getChatSessionId } from "./chat-session"

type StoredMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

type HistoryResponse = {
  messages?: StoredMessage[]
}

export function usePersistentChat(apiEndpoint: string, supabaseAnonKey: string) {
  const sessionId = useMemo(() => getChatSessionId(), [])
  const [isReady, setIsReady] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiEndpoint,
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: { sessionId },
      }),
    [apiEndpoint, sessionId, supabaseAnonKey]
  )

  const chat = useChat({ transport })
  const { setMessages } = chat

  useEffect(() => {
    const controller = new AbortController()

    async function loadHistory() {
      if (!apiEndpoint || !supabaseAnonKey) {
        setIsReady(true)
        return
      }

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            apikey: supabaseAnonKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "history", sessionId }),
          signal: controller.signal,
        })

        if (!response.ok) {
          setHistoryError(
            response.status === 503
              ? "The ARRA guide is temporarily unavailable."
              : "Previous messages could not be restored."
          )
          return
        }

        const data = (await response.json()) as HistoryResponse
        const messages: UIMessage[] = (data.messages ?? []).map((message) => ({
          id: message.id,
          role: message.role,
          parts: [{ type: "text", text: message.content }],
        }))
        setMessages(messages)
      } catch (error) {
        if (!controller.signal.aborted && import.meta.env.DEV) {
          console.warn("Chat history could not be restored", error)
        }
        if (!controller.signal.aborted) {
          setHistoryError("Previous messages could not be restored.")
        }
      } finally {
        if (!controller.signal.aborted) setIsReady(true)
      }
    }

    void loadHistory()
    return () => controller.abort()
  }, [apiEndpoint, sessionId, setMessages, supabaseAnonKey])

  const sendMessage = async (input: string) => {
    setHistoryError(null)
    await chat.sendMessage({ text: input })
  }

  const clearMessages = async () => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "clear", sessionId }),
      })
      if (!response.ok) throw new Error("Unable to clear chat history")
      setMessages([])
      setHistoryError(null)
    } catch {
      setHistoryError("Chat history could not be cleared. Please try again.")
    }
  }

  return { ...chat, sendMessage, clearMessages, isReady, historyError }
}
