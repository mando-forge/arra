import { useEffect, useRef, useState } from "react"
import { MessageSquare, X, ArrowUp, AlertCircle, Trash2, Edit2, Copy, Check } from "lucide-react"
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
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchNext,
  MessageBranchPage,
  MessageToolbar,
} from "@/components/ai-elements/message"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { cjk } from "@streamdown/cjk"
import { code } from "@streamdown/code"
import { math } from "@streamdown/math"
import { mermaid } from "@streamdown/mermaid"
import { Streamdown } from "streamdown"

const streamdownPlugins = { cjk, code, math, mermaid }
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
  role: "system" | "user" | "assistant" | "data"
  parts?: ChatMessagePart[]
  content?: unknown
}

const MessageParts = ({
  message,
  isLastMessage = false,
  isStreaming = false,
}: {
  message: ChatMessage
  isLastMessage?: boolean
  isStreaming?: boolean
}) => {
  const parts = message.parts || (typeof message.content === "string" ? [{ type: "text", text: message.content }] : [])

  const reasoningParts = parts.filter((part) => part.type === "reasoning")
  const reasoningText = reasoningParts.map((part) => part.text || "").join("\n\n")
  const hasReasoning = reasoningParts.length > 0

  const lastPart = parts.at(-1)
  const isReasoningStreaming = isLastMessage && isStreaming && lastPart?.type === "reasoning"

  return (
    <>
      {hasReasoning && (
        <Reasoning className="w-full mb-3" isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      )}
      {parts.map((part, i) => {
        if (part.type === "text" || !part.type) {
          return (
            <MessageResponse key={`${message.id}-${i}`}>
              <Streamdown plugins={streamdownPlugins}>{part.text || ""}</Streamdown>
            </MessageResponse>
          )
        }
        return null
      })}
    </>
  )
}

const getMessageText = (msg: ChatMessage) => {
  if (typeof msg.content === "string") return msg.content
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((part) => part.type === "text" || !part.type)
      .map((part) => part.text || "")
      .join("\n\n")
  }
  return ""
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

  const { messages, sendMessage, clearMessages, status, error, isReady, historyError, stop, setMessages } = usePersistentChat(
    `${supabaseUrl}/functions/v1/chat`,
    supabaseAnonKey
  )

  const messagesRef = useRef(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editInputText, setEditInputText] = useState("")
  const [chatBranches, setChatBranches] = useState<Record<number, ChatMessage[][]>>({})
  const [activeBranchIdx, setActiveBranchIdx] = useState<Record<number, number>>({})
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const handleEditClick = (msgId: string, text: string) => {
    setEditingMessageId(msgId)
    setEditInputText(text)
  }

  const handleClearChat = async () => {
    await clearMessages()
    setChatBranches({})
    setActiveBranchIdx({})
  }

  const handleEditSave = async (idx: number) => {
    if (!editInputText.trim() || isLoading) return
    const currentSuffix = messagesRef.current.slice(idx) as ChatMessage[]
    const currentBranchList = chatBranches[idx] || [currentSuffix]

    // Truncate messages list
    setMessages(messagesRef.current.slice(0, idx))
    setEditingMessageId(null)

    // Wait a brief tick to ensure AI SDK state settles on the truncated array
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Send the new prompt
    await sendMessage(editInputText.trim())

    // Once sendMessage resolves, the streaming is finished!
    // Slice the newly updated messagesRef.current containing both the user edit and the assistant response
    const newSuffix = messagesRef.current.slice(idx) as ChatMessage[]

    // Store branches locally
    const newActiveIdx = currentBranchList.length
    setChatBranches((prev) => ({
      ...prev,
      [idx]: [...currentBranchList, newSuffix],
    }))
    setActiveBranchIdx((prev) => ({
      ...prev,
      [idx]: newActiveIdx,
    }))
  }

  const handleBranchSwitch = (idx: number, targetIdx: number) => {
    const currentSuffix = messages.slice(idx) as ChatMessage[]
    const activeIdx = activeBranchIdx[idx] ?? 0
    const list = [...(chatBranches[idx] || [])]
    list[activeIdx] = currentSuffix

    const targetBranch = list[targetIdx]

    // Swap active list in useChat
    setMessages(messages.slice(0, idx).concat(targetBranch as typeof messages))

    setChatBranches((prev) => ({ ...prev, [idx]: list }))
    setActiveBranchIdx((prev) => ({ ...prev, [idx]: targetIdx }))
  }

  const handleCopyClick = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(msgId)
      setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)
    } catch (err) {
      console.warn("Failed to copy message", err)
    }
  }

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

  // iOS Safari virtual keyboard handler: adjusts dialog height when keyboard opens/closes
  useEffect(() => {
    if (!isOpen) return
    const vv = window.visualViewport
    if (!vv) return

    const onResize = () => {
      const dialog = dialogRef.current
      if (!dialog) return
      // visualViewport.height shrinks when iOS keyboard is visible
      dialog.style.height = `${vv.height}px`
    }

    vv.addEventListener("resize", onResize)
    // Set initial height
    onResize()
    return () => {
      vv.removeEventListener("resize", onResize)
      const dialog = dialogRef.current
      if (dialog) dialog.style.height = ""
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
              className="size-14 flex rounded-none items-center justify-center bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
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
            className="group flex h-14 items-center justify-center gap-3 rounded-none bg-primary px-4 text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <span className="relative">
              <MessageSquare className="size-5" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 size-2.5 rounded-none border-2 border-primary bg-emerald-400 motion-safe:animate-pulse" aria-hidden="true" />
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
        className="fixed inset-x-0 top-0 sm:top-auto bottom-0 z-50 m-0 ml-auto hidden h-[100dvh] sm:h-[min(42rem,88dvh)] w-full max-w-none flex-col overflow-hidden rounded-none border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/35 backdrop:backdrop-blur-[2px] [&[open]]:flex right-0 sm:right-4 md:right-6 bottom-0 sm:bottom-6 left-0 sm:left-auto sm:max-w-md sm:rounded-none"
      >
        <TooltipProvider>
          <header className="flex items-start justify-between gap-6 border-b border-border bg-background px-5 py-4 shrink-0">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-primary text-xs font-bold tracking-[0.16em] text-primary-foreground" aria-hidden="true">
                A
              </div>
              <div>
              <p className="mono-label">ARRA guide</p>
              <h2 id="arra-chat-title" className="mt-1 text-lg font-semibold">
                Ask about our work
              </h2>
              <p id="arra-chat-description" className="mt-1 text-xs leading-5 opacity-65">
                <span className="mr-1.5 inline-block size-1.5 rounded-none bg-emerald-500" aria-hidden="true" />
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
                  onClick={() => void handleClearChat()}
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
                          className="rounded-none border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  (messages as ChatMessage[]).map((message, idx) => {
                    const branchList = chatBranches[idx] || [[message]];
                    const totalBranches = branchList.length;
                    const currentBranch = activeBranchIdx[idx] ?? 0;

                    return (
                      <MessageBranch
                        key={message.id}
                        defaultBranch={currentBranch}
                        onBranchChange={(newBranch) => handleBranchSwitch(idx, newBranch)}
                        className="w-full"
                      >
                        <MessageBranchContent>
                          {branchList.map((branchSuffix, bIdx) => {
                            const msgAtBranch = branchSuffix[0];
                            const isEditing = editingMessageId === msgAtBranch.id;

                            return (
                              <div key={bIdx} className={`group flex flex-col w-full ${msgAtBranch.role === "user" ? "items-end" : "items-start"}`}>
                                {isEditing ? (
                                  <div className="w-full max-w-sm flex flex-col gap-2 p-3 bg-muted/65 rounded-none border border-border">
                                    <textarea
                                      value={editInputText}
                                      onChange={(e) => setEditInputText(e.target.value)}
                                      aria-label="Edit message"
                                      className="w-full min-h-16 p-2 text-sm bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-ring resize-none text-foreground"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingMessageId(null)}
                                        className="h-8 text-xs"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleEditSave(idx)}
                                        className="h-8 text-xs"
                                      >
                                        Save & Submit
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className={`flex items-end gap-2 w-full ${msgAtBranch.role === "user" ? "justify-end" : "justify-start"}`}>

                                    <div className={`flex flex-col max-w-[85%] w-full ${msgAtBranch.role === "user" ? "items-end" : "items-start"}`}>
                                      <Message from={msgAtBranch.role as "user" | "assistant"}>
                                        <MessageContent>
                                          <MessageParts
                                            message={msgAtBranch}
                                            isLastMessage={idx === messages.length - 1}
                                            isStreaming={isStreaming}
                                          />
                                        </MessageContent>
                                      </Message>
                                      
                                      {/* Action Buttons */}
                                      <div className="mt-1 flex items-center gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        {msgAtBranch.role === "user" && (
                                          <button
                                            type="button"
                                            onClick={() => handleEditClick(msgAtBranch.id, getMessageText(msgAtBranch))}
                                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label="Edit message"
                                          >
                                            <Edit2 className="size-3" />
                                          </button>
                                        )}
                                        {msgAtBranch.role === "assistant" && (
                                          <button
                                            type="button"
                                            onClick={() => handleCopyClick(msgAtBranch.id, getMessageText(msgAtBranch))}
                                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label="Copy message"
                                          >
                                            {copiedMessageId === msgAtBranch.id ? (
                                              <Check className="size-3 text-emerald-500" />
                                            ) : (
                                              <Copy className="size-3" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </MessageBranchContent>

                        {totalBranches > 1 && (
                          <MessageToolbar className="mt-1 flex justify-end w-full">
                            <MessageBranchSelector>
                              <MessageBranchPrevious />
                              <MessageBranchPage className="text-xs" />
                              <MessageBranchNext />
                            </MessageBranchSelector>
                          </MessageToolbar>
                        )}
                      </MessageBranch>
                    );
                  })
                )}
                {status === "submitted" && (
                  <div className="flex items-end gap-2" role="status" aria-label="ARRA is preparing a response">

                    <div className="rounded-none border border-border bg-background px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shimmer duration={2}>Consulting ARRA field notes...</Shimmer>
                      </div>
                    </div>
                  </div>
                )}
                {(error || historyError) && (
                  <div className="flex gap-3 rounded-none border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <p>{historyError ?? (error ? error.message : "The guide could not respond. Please wait a moment and try again.")}</p>
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          <div className="border-t border-border bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0">
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
