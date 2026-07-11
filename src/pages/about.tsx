import { ArraReveal, ArraSection, EngravingFigure } from "@/components/arra"
import { images } from "@/content/arra"
import { motion, type Variants } from "framer-motion"
import { BlurFade } from "@/components/ui/blur-fade"
import { MagicCard } from "@/components/ui/magic-card"

const founders = [
  {
    name: "Oliver O",
    role: "Co-founder",
    image: images.founderOliver,
    note: "Oliver brings a systems-oriented lens to company direction and technical foundations, with an emphasis on clarity before scale.",
  },
  {
    name: "Omega N",
    role: "Co-founder",
    image: images.founderOmega,
    note: "Omega brings a grounded operating lens to research, execution, and regional context, keeping the work close to real conditions.",
  },
]

const headingText = "Built from Northeast India, with a long view."
const words = headingText.split(" ")



const foundersContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
}

const founderItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
}

export default function About() {
  return (
    <>
      <section className="arra-section surface-light pb-14 pt-32 md:pb-24 md:pt-40 px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-7xl mx-auto">
          <ArraReveal>
            <p className="mono-label">About ARRA</p>
          </ArraReveal>
          
          <h1 className="serif-display mt-7 max-w-5xl text-balance text-[clamp(2.75rem,8vw,6rem)] leading-[0.94]">
            {words.map((word, i) => (
              <BlurFade 
                key={i} 
                delay={0.15 + i * 0.05} 
                inView 
                className="inline-block mr-[0.25em]"
              >
                {word}
              </BlurFade>
            ))}
          </h1>

          <ArraReveal>
            <div className="mt-8 grid gap-6 border-t border-border pt-6 md:grid-cols-[1.1fr_0.9fr]">
              <p className="body-copy max-w-2xl text-lg opacity-80">
                ARRA is an early-stage technology company founded in Manipur. We are building the research habits, technical foundations, and partnerships needed to create useful work over time.
              </p>
              <p className="body-copy max-w-xl opacity-70">
                Our approach is deliberate: understand the context, make careful choices, and communicate only what the work can support.
              </p>
            </div>
          </ArraReveal>
        </div>
      </section>

      <ArraSection
        id="founders"
        tone="split"
        eyebrow="The founders"
        title="Two perspectives, one shared practice"
        description="ARRA is shaped by two co-founders whose work is collaborative and deliberately cross-functional. The company grows from a shared commitment to regional understanding and responsible technology."
      >
        <motion.div 
          className="mt-12 grid gap-6 lg:grid-cols-2"
          variants={foundersContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10px" }}
        >
          {founders.map((founder, index) => (
            <motion.div key={founder.name} variants={founderItem} className="h-full">
              <MagicCard 
                className="h-full pt-4 cursor-pointer bg-transparent shadow-none border-t border-border rounded-none" 
                gradientColor="var(--arra-fjord)" 
                gradientOpacity={0.1}
              >
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <p className="mono-label">0{index + 1}</p>
                  <p className="text-sm opacity-60">{founder.role}</p>
                </div>
                <EngravingFigure
                  src={founder.image.src}
                  alt={founder.image.alt}
                  tone="light"
                  frameClassName="aspect-square w-full"
                  imageClassName="h-full w-full object-cover"
                  caption={
                    <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
                      <h2 className="serif-display text-3xl">{founder.name}</h2>
                      <p className="body-copy text-sm opacity-75">{founder.note}</p>
                    </div>
                  }
                />
              </MagicCard>
            </motion.div>
          ))}
        </motion.div>
      </ArraSection>
    </>
  )
}
