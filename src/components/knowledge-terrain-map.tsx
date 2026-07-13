import { useMemo, useRef, type CSSProperties, type PointerEvent } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { Calendar, Layers3 } from "lucide-react"

import terrainLight from "@/assets/knowledge-terrain-contours.png"
import terrainDark from "@/assets/knowledge-terrain-contours-dark.png"
import sourceBeacon from "@/assets/knowledge-source-beacon.png"
import { useTheme } from "@/components/theme-context"

export type KnowledgeDocument = {
  title: string
  chunks: number
  created_at: string
}

type KnowledgeTerrainMapProps = {
  docs: KnowledgeDocument[]
  selectedDoc: KnowledgeDocument | null
  onSelectDoc: (doc: KnowledgeDocument) => void
}

type SourcePosition = {
  x: number
  y: number
  mobileX: number
  mobileY: number
}

function hashTitle(title: string) {
  return Array.from(title).reduce(
    (value, character) => ((value * 31 + character.charCodeAt(0)) >>> 0),
    2166136261
  )
}

function positionForDocument(doc: KnowledgeDocument, index: number): SourcePosition {
  if (index === 0) return { x: 35.5, y: 17, mobileX: 39, mobileY: 50 }

  const hash = hashTitle(doc.title)
  const x = 23 + (hash % 1000) / 1000 * 58
  const y = 34 + ((hash >>> 10) % 1000) / 1000 * 28

  return {
    x,
    y,
    mobileX: Math.max(18, Math.min(82, x)),
    mobileY: Math.max(42, Math.min(70, y + 10)),
  }
}

function SourceCallout({ doc, index }: { doc: KnowledgeDocument; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-60 -translate-x-1/2 border-l border-[var(--arra-ochre)] bg-background/72 px-3 py-2 text-left backdrop-blur-[1px] after:absolute after:left-[-1px] after:top-full after:h-10 after:border-l after:border-[var(--arra-ochre)] after:content-[''] md:left-4 md:translate-x-0"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4 font-mono text-[11px] leading-none text-[var(--arra-ochre)]">
        <span>Selected source</span>
        <span className="text-foreground/40">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-2 font-mono text-[13px] leading-tight text-foreground">{doc.title}</h3>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-foreground/70">
        <span className="flex items-center gap-1.5">
          <Layers3 className="size-3" aria-hidden="true" />
          {doc.chunks} {doc.chunks === 1 ? "section" : "sections"}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3" aria-hidden="true" />
          {new Date(doc.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2 font-mono text-[10px] leading-relaxed text-foreground/65">
        Verified for ARRA&apos;s research assistant. Public directory information only.
      </p>
    </motion.div>
  )
}

export function KnowledgeTerrainMap({ docs, selectedDoc, onSelectDoc }: KnowledgeTerrainMapProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(pointerX, { stiffness: 55, damping: 20, mass: 0.8 })
  const rotateX = useSpring(pointerY, { stiffness: 55, damping: 20, mass: 0.8 })

  const sources = useMemo(
    () => docs.map((doc, index) => ({ doc, index, position: positionForDocument(doc, index) })),
    [docs]
  )

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5
    pointerX.set(normalizedX * 3.2)
    pointerY.set(normalizedY * -2.2)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      ref={hostRef}
      className="relative left-1/2 isolate min-h-[28rem] w-[calc(100vw-2rem)] max-w-[94rem] -translate-x-1/2 overflow-visible border-y border-foreground/15 md:min-h-[36rem] md:w-[calc(100vw-6rem)]"
      data-knowledge-terrain
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="pointer-events-none absolute left-0 top-5 z-40 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
        <span>Verified terrain</span>
        <span className="h-px w-12 bg-foreground/25" />
        <span>{docs.length} {docs.length === 1 ? "source" : "sources"}</span>
      </div>

      <div className="pointer-events-none absolute right-0 top-5 z-40 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/45 sm:flex">
        <span className="size-1.5 rounded-full bg-[var(--arra-ochre)]" />
        Move to survey · select a source
      </div>

      <motion.div
        className="absolute inset-x-[-60%] bottom-0 top-[-8%] z-0 origin-center sm:inset-x-[-24%] md:inset-x-[-2%] md:top-[-20%]"
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
        data-knowledge-terrain-art
      >
        <motion.div
          className="relative size-full"
          animate={shouldReduceMotion
            ? { scaleX: 1.15, scaleY: 0.82 }
            : { y: [0, -4, 0], scaleX: [1.15, 1.16, 1.15], scaleY: [0.82, 0.825, 0.82] }}
          transition={shouldReduceMotion
            ? { duration: 0 }
            : { duration: 10, ease: "easeInOut", repeat: Infinity }}
        >
          <img
            src={resolvedTheme === "dark" ? terrainDark : terrainLight}
            alt=""
            className="absolute inset-0 size-full object-contain object-center opacity-[0.82] dark:opacity-75"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-20" aria-label="Knowledge sources">
        {sources.map(({ doc, index, position }) => {
          const isSelected = selectedDoc?.title === doc.title
          return (
            <div
              key={doc.title}
              className="absolute left-[var(--node-x-mobile)] top-[var(--node-y-mobile)] -translate-x-1/2 -translate-y-1/2 md:left-[var(--node-x)] md:top-[var(--node-y)]"
              style={{
                "--node-x": `${position.x}%`,
                "--node-y": `${position.y}%`,
                "--node-x-mobile": `${position.mobileX}%`,
                "--node-y-mobile": `${position.mobileY}%`,
              } as CSSProperties}
            >
              {isSelected && <SourceCallout doc={doc} index={index} />}
              <motion.button
                type="button"
                aria-label={`Select research source: ${doc.title}`}
                aria-pressed={isSelected}
                onClick={() => onSelectDoc(doc)}
                className={`relative grid size-16 place-items-center rounded-full text-[var(--arra-ochre)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arra-ochre)] focus-visible:ring-offset-4 focus-visible:ring-offset-background md:size-20 ${
                  isSelected ? "drop-shadow-[0_3px_8px_rgba(178,122,34,0.28)]" : "text-foreground/65"
                }`}
                animate={isSelected && !shouldReduceMotion ? { scale: [1, 1.07, 1] } : undefined}
                transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
              >
                <img
                  src={sourceBeacon}
                  alt=""
                  className={`h-[4.75rem] w-16 object-contain ${isSelected ? "opacity-100" : "grayscale opacity-60"}`}
                  draggable={false}
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {isSelected ? "Selected" : "Select"}: {doc.title}, {doc.chunks} source sections, added {new Date(doc.created_at).toLocaleDateString()}
                </span>
              </motion.button>
            </div>
          )
        })}
      </div>

      <p className="sr-only">
        This visual map contains one interactive point for every verified source in ARRA&apos;s public research directory.
      </p>
    </div>
  )
}
