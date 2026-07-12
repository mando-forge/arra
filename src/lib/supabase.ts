import { createClient } from "@supabase/supabase-js"

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ifkvqudwumbndnajtcma.supabase.co"
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlma3ZxdWR3dW1ibmRuYWp0Y21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NDk1ODAsImV4cCI6MjA5OTAyNTU4MH0.p_vDQSLSoDyurpSCwpXPrOsrK5qMv6zl0_gh7ONUg9U"
export const chatAvailable = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
