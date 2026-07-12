import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, type Variants, AnimatePresence } from "framer-motion"
import { Map, BookOpen, Server, ShieldCheck, Database, Calendar, Orbit, Loader2, Network, TableProperties } from "lucide-react"
import { ArraReveal, ArraSection, EngravingFigure } from "@/components/arra"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { images } from "@/content/arra"
import { supabase } from "@/lib/supabase"
import { FluidCubeScroll } from "@/components/ui/fluid-cube"
import { Button } from "@/components/ui/button"
import { DataGrid } from "@/components/ui/data-grid"

const explorationAreas = [
  {
    title: "Regional intelligence",
    description: "Learning how local knowledge and careful data practices can make complex regional conditions easier to understand.",
    icon: <Map className="size-5 text-foreground/70" />,
    className: "md:col-span-2",
    status: "Active Fieldwork",
  },
  {
    title: "Human-centred learning",
    description: "Studying tools and systems that can support learning without losing sight of language, access, and everyday constraints.",
    icon: <BookOpen className="size-5 text-foreground/70" />,
    className: "md:col-span-1",
    status: "Synthesis",
  },
  {
    title: "Resilient systems",
    description: "Exploring digital foundations designed for uneven connectivity, constrained resources, and long-term maintainability.",
    icon: <Server className="size-5 text-foreground/70" />,
    className: "md:col-span-1",
    status: "Prototyping",
  },
  {
    title: "Trusted operations",
    description: "Examining how clear permissions, accountable decisions, and responsible data handling can shape dependable technology.",
    icon: <ShieldCheck className="size-5 text-foreground/70" />,
    className: "md:col-span-2",
    status: "Active Research",
  },
]

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
}

function SemanticGalaxy({ docs, selectedDoc, onSelectDoc }: { 
  docs: { title: string; chunks: number; created_at: string }[];
  selectedDoc: { title: string; chunks: number; created_at: string } | null;
  onSelectDoc: (doc: { title: string; chunks: number; created_at: string } | null) => void;
}) {
  const viewBoxSize = 400
  const center = viewBoxSize / 2

  // Generate deterministic coordinates
  const nodes = docs.map((doc, idx) => {
    const angle = (idx / docs.length) * Math.PI * 2 + (doc.title.charCodeAt(0) % 10) * 0.15
    const radius = 80 + (doc.title.charCodeAt(doc.title.length - 1) % 4) * 25
    const x = center + Math.cos(angle) * radius
    const y = center + Math.sin(angle) * radius
    return { ...doc, x, y, id: idx }
  })

  return (
    <div className="grid md:grid-cols-5 gap-8 items-center border border-border bg-[#173c3a]/5 backdrop-blur-sm p-6 relative overflow-hidden rounded-none shadow-[0_0_15px_rgba(47,216,216,0.02)]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,216,216,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,216,216,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

      {/* SVG map */}
      <div className="md:col-span-3 flex justify-center items-center relative z-10 select-none">
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full max-w-[340px] aspect-square">
          {/* Outer Orbit rings */}
          <circle cx={center} cy={center} r={80} fill="none" stroke="rgba(47,216,216,0.08)" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={center} cy={center} r={130} fill="none" stroke="rgba(47,216,216,0.08)" strokeWidth={1} strokeDasharray="5 5" />
          <circle cx={center} cy={center} r={170} fill="none" stroke="rgba(47,216,216,0.05)" strokeWidth={1} />

          {/* Central Neural Hub */}
          <g>
            <circle cx={center} cy={center} r={8} className="fill-[var(--arra-ochre)] opacity-20" />
            <circle cx={center} cy={center} r={4} className="fill-[var(--arra-ochre)]" />
            <circle cx={center} cy={center} r={16} fill="none" stroke="var(--arra-ochre)" strokeWidth={1} className="animate-pulse" />
          </g>

          {/* Neural paths connecting nodes to hub */}
          {nodes.map((node) => (
            <line
              key={`line-${node.id}`}
              x1={center}
              y1={center}
              x2={node.x}
              y2={node.y}
              stroke={selectedDoc?.title === node.title ? "var(--arra-cyan)" : "rgba(47,216,216,0.12)"}
              strokeWidth={selectedDoc?.title === node.title ? 1.5 : 1}
              strokeDasharray={selectedDoc?.title === node.title ? "none" : "2 2"}
              className="transition-all duration-300"
            />
          ))}

          {/* Stars / Knowledge Chunks Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedDoc?.title === node.title
            return (
              <g 
                key={`node-${node.id}`} 
                className="cursor-pointer"
                onClick={() => onSelectDoc(isSelected ? null : node)}
              >
                {/* Glow ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 10 : 7}
                  className="fill-none stroke-current text-arra-cyan/20 transition-all duration-300"
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                {/* Node Center */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 5 : 3.5}
                  className={`transition-all duration-300 ${
                    isSelected ? "fill-arra-cyan drop-shadow-[0_0_4px_rgba(47,216,216,0.8)]" : "fill-[var(--arra-spruce)] dark:fill-arra-cyan/70 hover:fill-arra-cyan"
                  }`}
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Detail Panel */}
      <div className="md:col-span-2 space-y-4 relative z-10">
        <AnimatePresence mode="wait">
          {selectedDoc ? (
            <motion.div
              key={selectedDoc.title}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4 p-4 border border-border/40 bg-background/50 rounded-sm"
            >
              <div className="flex items-center gap-2 text-arra-cyan">
                <Orbit className="size-4 animate-spin" />
                <span className="mono-label text-[9px] tracking-wider">ACTIVE KNOWLEDGE NODE</span>
              </div>
              <h4 className="font-serif text-lg font-semibold leading-tight text-foreground">{selectedDoc.title}</h4>
              
              <div className="space-y-2.5 font-mono text-xs text-foreground/75">
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-foreground/40">Vector Volume:</span>
                  <span className="font-bold text-arra-cyan">{selectedDoc.chunks} dimensions</span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-foreground/40">Ledger Ingress:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-foreground/40" />
                    {new Date(selectedDoc.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-foreground/50 font-mono italic">
                This document is chunked, mapped, and embedded into the 1536-dimensional semantic index, forming part of ARRA's private RAG pipeline.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-xs font-mono text-foreground/50 text-center py-10 flex flex-col items-center justify-center gap-3 border border-dashed border-border/40 p-4"
            >
              <Database className="size-6 text-foreground/30 animate-pulse" />
              <span>CLICK ON A TELEMETRY NODE IN THE SECTOR MAP TO MOUNT VECTOR DATA.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Products() {
  const containerRef = useRef<HTMLElement>(null)
  const [docs, setDocs] = useState<{ title: string; chunks: number; created_at: string }[]>([])
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; chunks: number; created_at: string } | null>(null)
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [viewMode, setViewMode] = useState<"map" | "grid">("map")
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDocs() {
      try {
        const { data, error } = await supabase
          .from("knowledge_base")
          .select("id, title, metadata, created_at")

        if (error) throw error

        const docsMap: Record<string, { title: string; chunks: number; created_at: string }> = {}
        data?.forEach((row) => {
          const docTitle = row.metadata?.source_title || row.title
          if (!docsMap[docTitle]) {
            docsMap[docTitle] = {
              title: docTitle,
              chunks: 0,
              created_at: row.created_at
            }
          }
          docsMap[docTitle].chunks += 1
        })
        setDocs(Object.values(docsMap))
      } catch (err) {
        console.error("Failed to load knowledge vectors:", err)
        setLoadError("Failed to load vector telemetry directory.")
      } finally {
        setLoadingDocs(false)
      }
    }
    void loadDocs()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  
  // Parallax subtle drift
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <>
      <section ref={containerRef} className="relative overflow-hidden arra-section surface-light pb-14 pt-32 md:pb-24 md:pt-40 min-h-[90vh] flex items-center px-6 md:px-12 lg:px-24">
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
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
            <ArraReveal>
              <p className="mono-label text-primary">Field notes 02</p>
              <h1 className="serif-display mt-7 max-w-4xl text-balance text-[clamp(2.75rem,8vw,6rem)] leading-[0.94]">
                Areas of exploration
              </h1>
              <p className="body-copy mt-8 max-w-xl text-lg opacity-80 mb-10">
                These are questions we are learning from, not products we are announcing. They describe the territory around ARRA&apos;s early work and may change as evidence grows.
              </p>
              <InteractiveHoverButton href="#methodology">Read Field Notes</InteractiveHoverButton>
            </ArraReveal>

            <motion.div style={{ y }} className="w-full hidden lg:block">
              <EngravingFigure
                src={images.explorations.src}
                alt={images.explorations.alt}
                tone="light"
                frameClassName="aspect-[16/10] w-full rounded-2xl shadow-2xl"
                imageClassName="h-full w-full object-cover"
                meta="Manipur / exploratory study"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Knowledge Galaxy Map (The Innovative Concept) */}
      <ArraSection
        id="knowledge-galaxy"
        tone="light"
        eyebrow="Ingested Telemetry"
        title="Semantic Vector space Map"
        description="A real-time visualization of documents loaded into our vector index. Stars represent source files; coordinates indicate mapped vector clustering paths."
        className="border-t border-foreground/10"
      >
        <div className="flex justify-end gap-2 mb-6 relative z-10">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase h-8 px-3"
          >
            <Network className="size-3.5" />
            Galaxy Map
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase h-8 px-3"
          >
            <TableProperties className="size-3.5" />
            Data Ledger
          </Button>
        </div>

        {loadingDocs ? (
          <div className="flex items-center justify-center p-20 font-mono text-xs text-foreground/50">
            <Loader2 className="animate-spin size-4 mr-2" />
            SYNCHRONIZING VECTOR MAP...
          </div>
        ) : loadError ? (
          <div className="border border-dashed border-destructive/40 p-12 text-center text-xs font-mono text-destructive max-w-md mx-auto bg-destructive/5">
            ERROR: {loadError}
            <br /><br />
            Please verify network access and refresh to attempt synchronization again.
          </div>
        ) : docs.length === 0 ? (
          <div className="border border-dashed border-border/40 p-12 text-center text-xs font-mono text-foreground/50 max-w-md mx-auto">
            THE VECTOR INDEX IS CURRENTLY EMPTY.
            <br /><br />
            Please log into the Admin Control Panel and inject documents into the Neural Net to initialize the galaxy.
          </div>
        ) : viewMode === "map" ? (
          <SemanticGalaxy docs={docs} selectedDoc={selectedDoc} onSelectDoc={setSelectedDoc} />
        ) : (
          <DataGrid docs={docs} />
        )}
      </ArraSection>

      {/* New Methodology Section */}
      <ArraSection
        id="methodology"
        tone="split"
        eyebrow="Our Process"
        title="Research Methodology"
        description="How we approach problems in resource-constrained environments."
      >
        <div className="grid lg:grid-cols-2 gap-12 mt-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-background/10 border-border/20 backdrop-blur-md h-full shadow-none p-6 md:p-12">
              <CardHeader className="p-0 mb-8">
                <div className="mb-4">
                  <Badge variant="secondary" className="font-normal opacity-80 px-4 py-1.5 text-sm tracking-wide">Methodology</Badge>
                </div>
                <CardTitle className="serif-display text-4xl md:text-5xl leading-tight">Context First</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 body-copy opacity-80 p-0 text-lg leading-relaxed">
                <p>We do not begin with software. We begin with the physical, infrastructural, and social constraints of the region.</p>
                <p>By observing how communities naturally solve problems when technology fails, we identify the actual needs rather than assumed ones.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full mt-4 md:mt-0">
              <AccordionItem value="item-1" className="border-border/20 py-4 md:py-6">
                <AccordionTrigger className="text-2xl md:text-3xl serif-display hover:text-primary text-left">1. Observation Phase</AccordionTrigger>
                <AccordionContent className="body-copy opacity-75 text-lg mt-3 leading-relaxed">
                  Extensive field studies focusing on network intermittency and power stability in rural Manipur.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border/20 py-4 md:py-6">
                <AccordionTrigger className="text-2xl md:text-3xl serif-display hover:text-primary text-left">2. Synthesis &amp; Modeling</AccordionTrigger>
                <AccordionContent className="body-copy opacity-75 text-lg mt-3 leading-relaxed">
                  Mapping local constraints to potential technological primitives (e.g. offline-first databases, peer-to-peer sync).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border/20 border-b-0 py-4 md:py-6">
                <AccordionTrigger className="text-2xl md:text-3xl serif-display hover:text-primary text-left">3. Prototype Deployment</AccordionTrigger>
                <AccordionContent className="body-copy opacity-75 text-lg mt-3 leading-relaxed">
                  Testing lightweight applications in real conditions and measuring resilience over feature-completeness.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </ArraSection>

      <ArraSection
        id="exploration-areas"
        tone="split"
        eyebrow="Open questions"
        title="Where we are paying attention"
        description="ARRA is still in an early research and capability-building phase. Each area below is a lens for inquiry rather than a promise of a shipped service."
      >
        <motion.div 
          className="mt-12"
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10px" }}
        >
          <BentoGrid className="max-w-none">
            {explorationAreas.map((item, index) => (
              <motion.div key={item.title} variants={itemVariants} className={item.className}>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="h-full">
                      <BentoGridItem
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        className="h-full cursor-pointer"
                        header={
                          <div className="flex justify-between items-start w-full">
                            <Badge variant="outline" className="opacity-60 px-3 py-1 font-mono text-xs uppercase tracking-widest">{item.status}</Badge>
                            <p className="mono-label opacity-40 text-sm">0{index + 1}</p>
                          </div>
                        }
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent align="end" className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                        <p className="text-sm opacity-80 text-muted-foreground">
                          Status: {item.status}. Research phase ongoing.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            ))}
          </BentoGrid>
        </motion.div>
      </ArraSection>
      <FluidCubeScroll />
    </>
  )
}
