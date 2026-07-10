import { useState } from "react"
import { ArrowRight, Mail, MapPin } from "lucide-react"
import { motion } from "framer-motion"

import { ArraField } from "@/components/arra"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { toast } from "sonner"
import { contactIntents } from "@/content/arra"
import { supabase } from "@/lib/supabase"

type SubmissionStatus = "idle" | "submitting" | "success" | "error"

export default function Contact() {
  const [status, setStatus] = useState<SubmissionStatus>("idle")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("submitting")

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const intent = String(formData.get("intent") ?? "")
    const message = String(formData.get("message") ?? "").trim()

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name,
        email,
        intent,
        message,
      })

      if (error) {
        throw error
      }

      form.reset()
      setStatus("idle")
      toast.success("Message received", {
        description: "We'll read your note carefully and respond when there is a clear way forward.",
      })
    } catch (error: unknown) {
      console.error("Contact submission failed", error)
      setStatus("idle")
      toast.error("Message failed", {
        description: "We couldn’t send your message. Please try again or email us directly.",
      })
    }
  }

  return (
    <section id="contact" className="arra-section surface-light relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 lg:px-24">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid 
          className="absolute inset-0 size-full z-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-30" 
          squareSize={4} 
          gridGap={6} 
          color="#6B7280" 
          maxOpacity={0.5} 
          flickerChance={0.1}
        />
      </div>

      <div className="w-full relative z-10 max-w-7xl mx-auto">
        <div className="grid min-w-0 gap-10 border-t border-border pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)] lg:gap-16">
          <div className="grid min-h-[28rem] min-w-0 content-between gap-12">
            <div>
              <p className="mono-label">Contact</p>
              <h1 className="serif-display mt-7 max-w-3xl text-[clamp(2.5rem,7vw,6.75rem)] leading-[0.92] text-balance">
                Start a thoughtful conversation.
              </h1>
              <p className="body-copy mt-7 max-w-xl opacity-[0.78]">
                We welcome conversations with founders, collaborators, and
                people committed to useful, long-term work in the region.
              </p>
            </div>

            <address className="grid max-w-md gap-3 not-italic">
              <a
                href="mailto:transmission@arra.tech"
                className="group flex items-center gap-4 border-t border-border py-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <Mail className="size-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0 text-sm leading-6 font-semibold break-words md:text-base">
                  transmission@arra.tech
                </span>
              </a>
              <div className="flex items-center gap-4 border-t border-border py-4">
                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                <span className="text-sm leading-6 font-semibold md:text-base">
                  Northeast India
                </span>
              </div>
            </address>
          </div>

          <div>
            <motion.form
              key="form"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              aria-busy={status === "submitting"}
              className="surface-blue w-full min-w-0 p-8 md:p-12 shadow-2xl rounded-sm"
            >
                  <fieldset disabled={status === "submitting"} className="grid gap-5">
                    <legend className="sr-only">Your contact details and message</legend>

                    <ArraField label="Name">
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        required
                        className="contact-field px-4"
                      />
                    </ArraField>

                    <ArraField label="Email">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        className="contact-field px-4"
                      />
                    </ArraField>

                    <ArraField label="Conversation type">
                      <Select name="intent" defaultValue={contactIntents[0]} required>
                        <SelectTrigger className="contact-field px-4 rounded-sm bg-transparent border-border/20">
                          <SelectValue placeholder="Select conversation type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {contactIntents.map((intent) => (
                            <SelectItem key={intent} value={intent}>
                              {intent}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </ArraField>

                    <ArraField label="Message">
                      <Textarea
                        id="message"
                        name="message"
                        className="contact-field min-h-36 resize-y px-4 py-3"
                        required
                      />
                    </ArraField>

                    <Button
                      type="submit"
                      disabled={status === "submitting"}
                      className="mt-6 h-14 w-full justify-between bg-primary-foreground px-6 text-sm font-semibold text-primary hover:bg-primary-foreground/90 transition-all rounded-sm"
                    >
                      <span>{status === "submitting" ? "Sending…" : "Send message"}</span>
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </fieldset>
                </motion.form>
          </div>
        </div>
      </div>
    </section>
  )
}
