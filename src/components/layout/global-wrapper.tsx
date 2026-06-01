import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlobalWrapperProps {
  children: ReactNode
  className?: string
}

export function GlobalWrapper({ children, className }: GlobalWrapperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-24", className)}>
      {children}
    </div>
  )
}
