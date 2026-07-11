const SESSION_KEY = "arra_chat_session_id"

export function getChatSessionId(): string {
  const createSessionId = () => crypto.randomUUID()

  try {
    const storedSessionId = localStorage.getItem(SESSION_KEY)
    if (storedSessionId) return storedSessionId

    const sessionId = createSessionId()
    localStorage.setItem(SESSION_KEY, sessionId)
    return sessionId
  } catch {
    // Private browsing and restrictive storage policies should not disable chat.
    return createSessionId()
  }
}
