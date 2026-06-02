import type { ReactNode } from "react"
import { Flame, Lock, Network } from "lucide-react"

import { cn } from "@/lib/utils"

const icons = {
  Flame,
  Lock,
  Network,
}

export function TimelineContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col justify-center gap-6 py-10">
      {children}
    </div>
  )
}

export function TimelineEvent({
  label,
  message,
  icon,
  isLast = false,
}: Event & { isLast?: boolean }) {
  const Icon = icons[icon.name]

  return (
    <div className="group relative -m-2 flex gap-8 border border-transparent p-2">
      <div className="relative">
        <div
          className={cn(
            "bg-black rounded-none border-2 p-3 shadow-[0_0_15px_var(--color-primary)] transition-all",
            icon.borderColor
          )}
        >
          <Icon className={cn("h-6 w-6", icon.textColor)} />
        </div>
        {!isLast ? (
          <div className="bg-primary/50 absolute inset-x-0 mx-auto h-full w-[1px]" />
        ) : null}
      </div>
      <div className="mt-1 flex flex-1 flex-col gap-2 pb-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-white">{label}</p>
        </div>
        <p className="text-white/60 text-sm md:text-base font-mono">{message}</p>
      </div>
    </div>
  )
}

export function Timeline() {
  return (
    <div className="">
      <TimelineContainer>
        {timeline.map((event, i) => (
          <TimelineEvent
            key={event.message}
            isLast={i === timeline.length - 1}
            {...event}
          />
        ))}
      </TimelineContainer>
    </div>
  )
}

interface Event {
  label: string
  message: string
  icon: {
    name: keyof typeof icons
    textColor: string
    borderColor: string
  }
}

const timeline: Event[] = [
  {
    label: "PHASE I: THE FORGE IGNITES",
    message:
      "Initial architecture mapped. The foundational core is built in absolute silence. No public previews.",
    icon: {
      name: "Flame",
      textColor: "text-primary",
      borderColor: "border-primary",
    },
  },
  {
    label: "PHASE II: COVERT ARCHITECTURE LOCK",
    message: "Systems hardened. Data streams synchronized. We are operating from the shadows to build the Vergence Protocol.",
    icon: {
      name: "Lock",
      textColor: "text-primary",
      borderColor: "border-primary",
    },
  },
  {
    label: "PHASE III: NEXUS EXPANSION",
    message: "The gateway opens. We invite select visionaries to cross the bridge. Public deployment initiated.",
    icon: {
      name: "Network",
      textColor: "text-primary",
      borderColor: "border-primary",
    },
  }
]
