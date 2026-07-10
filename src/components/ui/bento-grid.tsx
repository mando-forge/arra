import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardTitle, CardContent } from "@/components/ui/card"

export function BentoGrid({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | ReactNode
  description?: string | ReactNode
  header?: ReactNode
  icon?: ReactNode
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "group/bento block h-full",
        className
      )}
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden relative transition-all duration-500 border-border/20 hover:border-border/60 bg-background shadow-none rounded-2xl p-6 md:p-10">
        {/* Subtle Background Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover/bento:opacity-100 pointer-events-none z-0" />
        
        {header && <div className="z-10 w-full mb-12">{header}</div>}
        
        <div className="flex flex-col h-full justify-end z-10 transition duration-500">
          <div className="pb-4 pt-4">
            <div className="mb-6 text-foreground/70">{icon}</div>
            <CardTitle className="serif-display font-medium text-3xl md:text-4xl leading-tight text-foreground">
              {title}
            </CardTitle>
          </div>
          <CardContent className="p-0">
            <p className="body-copy text-base md:text-lg opacity-70 max-w-sm leading-relaxed mt-2">
              {description}
            </p>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}
