import { useRef } from "react"
import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { Map, BookOpen, Server, ShieldCheck } from "lucide-react"
import { ArraReveal, ArraSection, EngravingFigure } from "@/components/arra"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { images } from "@/content/arra"

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

export default function Products() {
  const containerRef = useRef<HTMLElement>(null)
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
              <InteractiveHoverButton>Read Field Notes</InteractiveHoverButton>
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
    </>
  )
}
