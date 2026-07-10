import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState } from "react"

export default function DebugPage() {
  const [input, setInput] = useState("")
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  const chatAvailable = Boolean(supabaseUrl && supabaseAnonKey)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${supabaseUrl}/functions/v1/chat`,
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
    }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !chatAvailable) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="min-h-screen bg-background p-10 text-foreground">
      <p className="mono-label">Development only</p>
      <h1 className="serif-display mt-4 text-5xl">Chat diagnostics</h1>
      <p className="mt-4 text-sm text-foreground/65">
        Supabase transport: {chatAvailable ? "configured" : "unavailable"}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
        <label htmlFor="debug-message" className="mono-label">
          Test message
        </label>
        <input 
          id="debug-message"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Message"
          className="contact-field my-3 w-full px-3"
          disabled={!chatAvailable}
        />
        <button 
          type="submit"
          className="bg-foreground px-5 py-3 text-sm font-semibold text-background"
          disabled={!chatAvailable || status === 'submitted' || status === 'streaming'}
        >
          Send
        </button>
      </form>
      <div className="mt-4">
        Status: <span id="chat-status">{status}</span>
      </div>
      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
      <pre id="chat-messages" className="mt-4 border p-4 text-xs whitespace-pre-wrap">
        {JSON.stringify(messages, null, 2)}
      </pre>
    </div>
  )
}
