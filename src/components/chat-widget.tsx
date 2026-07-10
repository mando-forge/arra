import { useEffect, useRef, useState } from "react"
import { MessageSquare, X, ArrowUp, AlertCircle, Trash2 } from "lucide-react"
import { useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePersistentChat } from "@/lib/use-persistent-chat"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input"

type ChatMessagePart = {
  type?: string
  text?: string
}

type ChatMessage = {
  id: string
  role: string
  parts?: ChatMessagePart[]
  content?: unknown
}

const MessageParts = ({
  message,
}: {
  message: ChatMessage
}) => {
  const parts = message.parts || (typeof message.content === "string" ? [{ type: "text", text: message.content }] : [])

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "text" || !part.type) {
          return (
            <MessageResponse key={`${message.id}-${i}`}>
              {part.text || ""}
            </MessageResponse>
          )
        }
        return null
      })}
    </>
  )
}

export function ChatWidget() {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  const chatAvailable = Boolean(supabaseUrl && supabaseAnonKey)
  const showTrigger = pathname !== "/contact"

  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const { messages, sendMessage, clearMessages, status, error, isReady, historyError, stop } = usePersistentChat(
    `${supabaseUrl}/functions/v1/chat`,
    supabaseAnonKey
  )

  const isStreaming = status === "streaming"
  const isLoading = status === "submitted" || isStreaming || !isReady

  const closeChat = () => setIsOpen(false)

  const openChat = () => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : triggerRef.current
    setIsOpen(true)
  }

  const handlePromptSubmit = async (msg: PromptInputMessage) => {
    if (!msg.text.trim() || isLoading || !chatAvailable) return
    await sendMessage(msg.text.trim())
  }

  const suggestedPrompts = [
    "What is ARRA exploring?",
    "Why Northeast India?",
    "How can I start a conversation?",
  ]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
      requestAnimationFrame(() => closeButtonRef.current?.focus())
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const handleOpenChat = () => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : triggerRef.current
      setIsOpen(true)
    }

    window.addEventListener("open-chat", handleOpenChat)
    return () => window.removeEventListener("open-chat", handleOpenChat)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {showTrigger ? (
        <div className={`fixed right-4 sm:right-6 xl:right-12 3xl:right-16 bottom-4 sm:bottom-6 xl:bottom-8 z-40 flex-col gap-3 ${isOpen ? "hidden" : "flex"}`}>
          {showScrollTop && (
            <button
              type="button"
              aria-label="Scroll to top"
              onClick={scrollToTop}
              className="size-14 flex rounded-full items-center justify-center bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
            >
              <ArrowUp className="size-5" aria-hidden="true" />
            </button>
          )}
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open ARRA chat"
            aria-haspopup="dialog"
            aria-controls="arra-chat-dialog"
            aria-expanded={isOpen}
            onClick={openChat}
            className="group flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-4 text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <span className="relative">
              <MessageSquare className="size-5" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-primary bg-emerald-400 motion-safe:animate-pulse" aria-hidden="true" />
            </span>
            <span className="hidden text-sm font-semibold sm:inline">Ask ARRA</span>
          </button>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        id="arra-chat-dialog"
        aria-labelledby="arra-chat-title"
        aria-describedby="arra-chat-description"
        onCancel={(event) => {
          event.preventDefault()
          closeChat()
        }}
        onClose={() => {
          setIsOpen(false)
          requestAnimationFrame(() => returnFocusRef.current?.focus())
        }}
        className="fixed inset-x-0 top-auto bottom-0 z-50 m-0 ml-auto hidden h-[min(42rem,88dvh)] w-full max-w-none flex-col overflow-hidden rounded-t-lg border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/35 backdrop:backdrop-blur-[2px] [&[open]]:flex right-0 sm:right-4 md:right-6 bottom-0 sm:bottom-6 left-0 sm:left-auto sm:max-w-md sm:rounded-lg"
      >
        <TooltipProvider>
          <header className="flex items-start justify-between gap-6 border-b border-border bg-background px-5 py-4 shrink-0">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold tracking-[0.16em] text-primary-foreground" aria-hidden="true">
                A
              </div>
              <div>
              <p className="mono-label">ARRA guide</p>
              <h2 id="arra-chat-title" className="mt-1 text-lg font-semibold">
                Ask about our work
              </h2>
              <p id="arra-chat-description" className="mt-1 text-xs leading-5 opacity-65">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Online · A concise guide to ARRA’s focus and approach.
              </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Clear chat history"
                  onClick={() => void clearMessages()}
                  disabled={isLoading}
                  className="size-9 shrink-0"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              )}
              <Button
                ref={closeButtonRef}
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close ARRA chat"
                onClick={closeChat}
                className="size-9 shrink-0"
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0 bg-muted/35">
            <Conversation className="flex-1 size-full">
              <ConversationContent className="px-5 py-5 space-y-4">
                {messages.length === 0 ? (
                  <div className="space-y-5">
                    <ConversationEmptyState
                      icon={<MessageSquare className="size-12" />}
                      title="What would you like to know?"
                      description="Ask about ARRA’s areas of exploration, regional context, or how to begin a conversation."
                    />
                    <div className="grid gap-2" aria-label="Suggested questions">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          disabled={!chatAvailable || isLoading}
                          onClick={() => void sendMessage(prompt)}
                          className="rounded-sm border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  (messages as ChatMessage[]).map((message) => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      {message.role === "assistant" && (
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[0.6rem] font-bold text-primary-foreground" aria-hidden="true">A</span>
                      )}
                      <Message from={message.role as "user" | "assistant"}>
                        <MessageContent>
                          <MessageParts message={message} />
                        </MessageContent>
                      </Message>
                    </div>
                  ))
                )}
                {status === "submitted" && (
                  <div className="flex items-end gap-2" role="status" aria-label="ARRA is preparing a response">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[0.6rem] font-bold text-primary-foreground" aria-hidden="true">A</span>
                    <div className="rounded-lg border border-border bg-background px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Consulting ARRA field notes</span>
                        <span className="flex gap-1" aria-hidden="true">
                          {[0, 1, 2].map((dot) => (
                            <span key={dot} className="size-1.5 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: `${dot * 120}ms` }} />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {(error || historyError) && (
                  <div className="flex gap-3 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <p>{historyError ?? (error ? error.message : "The guide could not respond. Please wait a moment and try again.")}</p>
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          <div className="border-t border-border bg-background p-4 shrink-0">
            <PromptInput
              onSubmit={handlePromptSubmit}
              className="w-full relative"
            >
              <PromptInputTextarea
                placeholder={chatAvailable ? "Type your question…" : "Chat is currently unavailable"}
                className="pr-12 bg-background min-h-12 border-none shadow-none focus-visible:ring-0 resize-none"
                disabled={!chatAvailable || isLoading}
                maxLength={2000}
              />
              <PromptInputSubmit
                status={status === "streaming" ? "streaming" : "ready"}
                disabled={!chatAvailable || isLoading}
                onStop={() => {
                  if (status === "streaming") {
                    stop();
                  }
                }}
                className="absolute bottom-1.5 right-2"
              />
            </PromptInput>
          </div>
        </TooltipProvider>
      </dialog>
    </>
  )
}
