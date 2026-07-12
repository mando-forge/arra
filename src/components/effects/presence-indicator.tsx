import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Generate a random user ID for this session
const sessionId = crypto.randomUUID()

export function PresenceIndicator() {
  const [onlineUsers, setOnlineUsers] = useState(1) // Default to 1 (self)

  useEffect(() => {
    // Only connect if Supabase is properly initialized
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return
    }

    const roomOne = supabase.channel('arra_global_presence')

    roomOne
      .on('presence', { event: 'sync' }, () => {
        const newState = roomOne.presenceState()
        // Count unique users across the presence state
        let count = 0
        for (const presenceId in newState) {
          count += newState[presenceId].length
        }
        setOnlineUsers(Math.max(1, count))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await roomOne.track({
            user: sessionId,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(roomOne)
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 glass-panel rounded-none border border-arra-cyan/30 bg-background/50 backdrop-blur-md"
      >
        <div className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-arra-cyan opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-none bg-arra-cyan"></span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest mono-label text-arra-cyan/90">
          <Users className="size-3" />
          <span>Nodes: {onlineUsers}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
