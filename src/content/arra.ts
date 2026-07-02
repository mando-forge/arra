import type { LucideIcon } from "lucide-react"
import {
  BrainCircuit,
  Building2,
  Code2,
  Compass,
  DatabaseZap,
  Eye,
  FileCheck2,
  GraduationCap,
  Layers3,
  LockKeyhole,
  Network,
  Route,
  Scale,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
}

export type ImageAsset = {
  src: string
  srcSet?: string
  alt: string
}

export type ProofPoint = {
  label: string
  value: string
}

export type ProductArea = {
  icon: LucideIcon
  title: string
  description: string
  narrative: string
  signals: string[]
}

export type Principle = {
  title: string
  body: string
}

export type AudienceCard = {
  icon: LucideIcon
  title: string
  body: string
}

export type OperatingStep = {
  phase: string
  title: string
  body: string
}

export type ReadinessSignal = {
  icon: LucideIcon
  title: string
  body: string
  label: string
}

export type RoadmapPhase = {
  phase: string
  title: string
  description: string
  details: string[]
}

export type FAQItem = {
  question: string
  answer: string
}

export const navItems: NavItem[] = [
  { label: "Vision", href: "#vision" },
  { label: "Direction", href: "#products" },
  { label: "Process", href: "#process" },
  { label: "Principles", href: "#readiness" },
  { label: "Trust", href: "#trust" },
  { label: "Contact", href: "#contact" },
]

export const images = {
  hero: {
    src: "/images/arra-founders-gateway.png",
    alt: "Flat vector futuristic poster of two ARRA founders looking from a Manipur hilltop toward a quiet luminous pathway and gateway",
  },
  loom: {
    src: "/images/arra-founders-product-ecosystem.png",
    alt: "Flat vector futuristic poster of two ARRA founders overlooking four connected product directions across hills and water",
  },
  learning: {
    src: "/images/arra-founders-learning-campus.png",
    alt: "Flat vector futuristic poster of two ARRA founders walking through a calm learning and workflow campus beside water",
  },
  governance: {
    src: "/images/arra-founders-trust-observatory.png",
    alt: "Flat vector futuristic poster of two ARRA founders reviewing a transparent data vault in a quiet observatory",
  },
  topographic: {
    src: "/images/arra-founders-terrain.png",
    alt: "Flat vector futuristic poster of two ARRA founders mapping Manipur terrain as it becomes a connected intelligence grid",
  },
} satisfies Record<string, ImageAsset>

export const heroProofPoints: ProofPoint[] = [
  {
    label: "Current stage",
    value: "Early research, product thinking, and private technical exploration.",
  },
  {
    label: "Operating base",
    value: "A two-founder journey grounded in Manipur, built with patience and care.",
  },
  {
    label: "Working standard",
    value: "Clarity, restraint, accessibility, and responsible use of technology.",
  },
]

export const productAreas: ProductArea[] = [
  {
    icon: BrainCircuit,
    title: "Applied AI research",
    description:
      "Exploring how intelligence can help people understand context without hiding human judgment.",
    narrative:
      "ARRA is still shaping its AI direction privately. The focus is not to make loud claims, but to study where context, uncertainty, and human confirmation matter.",
    signals: ["Context first", "Human judgment", "Private exploration"],
  },
  {
    icon: GraduationCap,
    title: "Learning tools",
    description:
      "Studying ways technology can support teaching, practice, and clearer understanding.",
    narrative:
      "The education direction is still early. We are interested in tools that respect the pace of teachers and learners before trying to scale anything publicly.",
    signals: ["Patient design", "Local context", "Learning support"],
  },
  {
    icon: Workflow,
    title: "Workflow clarity",
    description:
      "Looking at how scattered work, decisions, and information might become easier to follow.",
    narrative:
      "This is a direction of study, not a public product claim. The aim is to understand real coordination problems before deciding what should be built.",
    signals: ["Less noise", "Clearer context", "Careful scope"],
  },
  {
    icon: Code2,
    title: "Developer support",
    description:
      "Exploring quiet tools and practices that may help small teams plan, review, and document better.",
    narrative:
      "ARRA is not revealing technical projects yet. For now, the focus is on building internal discipline and learning what is worth turning into software.",
    signals: ["Internal practice", "Documentation", "Quality habits"],
  },
]

export const principles: Principle[] = [
  {
    title: "Local pressure, global quality",
    body: "Building from Manipur creates a useful discipline: work should be resilient, legible, and efficient because ideal conditions cannot be assumed.",
  },
  {
    title: "Human judgment stays visible",
    body: "Technology should not hide the route from input to decision. ARRA wants to preserve responsibility wherever intelligence is used.",
  },
  {
    title: "Quiet work before public claims",
    body: "The company is not built around spectacle. ARRA would rather stay patient than describe products before they are real enough to discuss.",
  },
  {
    title: "Trust starts before launch",
    body: "Privacy, permissions, accessibility, and operational risk need to be considered early, not added after attention arrives.",
  },
]

export const audienceCards: AudienceCard[] = [
  {
    icon: Users,
    title: "Builders and operators",
    body: "People carrying messy workflows. We are still learning where software can reduce friction instead of adding another layer.",
  },
  {
    icon: GraduationCap,
    title: "Teachers and learners",
    body: "Classrooms, independent learners, and education teams that deserve tools shaped around patience, context, and usefulness.",
  },
  {
    icon: Building2,
    title: "Careful technology teams",
    body: "Teams thinking carefully about intelligence, data, and responsibility before adopting tools into important work.",
  },
]

export const operatingSteps: OperatingStep[] = [
  {
    phase: "01",
    title: "Discover the terrain",
    body: "The founders study real context, constraints, user needs, risks, and the smallest useful problem worth understanding.",
  },
  {
    phase: "02",
    title: "Shape the idea",
    body: "They turn early thinking into small private prototypes, notes, and experiments without treating them as finished products.",
  },
  {
    phase: "03",
    title: "Review honestly",
    body: "They look for usefulness, confusion, risk, and unnecessary complexity before expanding the scope of any idea.",
  },
  {
    phase: "04",
    title: "Prepare carefully",
    body: "They keep product details private until the work is clear, responsible, and mature enough to be shared.",
  },
]

export const readinessSignals: ReadinessSignal[] = [
  {
    icon: SearchCheck,
    title: "Clarity before complexity",
    body: "We want future work to explain context plainly before adding automation or advanced features.",
    label: "Internal focus",
  },
  {
    icon: ShieldCheck,
    title: "Responsible technical habits",
    body: "Security, privacy, and data boundaries are being treated as early habits, not launch-day decorations.",
    label: "Internal focus",
  },
  {
    icon: Scale,
    title: "Measured commitments",
    body: "ARRA is avoiding public product promises until the work has enough evidence and clarity behind it.",
    label: "Public posture",
  },
  {
    icon: FileCheck2,
    title: "Private project discipline",
    body: "Project details remain private while the founders refine scope, assumptions, and technical direction.",
    label: "Internal focus",
  },
]

export const roadmap: RoadmapPhase[] = [
  {
    phase: "Now",
    title: "Private groundwork",
    description:
      "Research, planning, and small internal experiments across AI, learning, workflow, and developer-support ideas.",
    details: [
      "Clarify the company direction.",
      "Study real problems before naming products.",
      "Keep the work private while it is still forming.",
    ],
  },
  {
    phase: "Next",
    title: "Focused validation",
    description:
      "Private conversations and careful validation with people who understand the problems being explored.",
    details: [
      "Listen before presenting solutions.",
      "Test usefulness before scale.",
      "Refine scope without public pressure.",
    ],
  },
  {
    phase: "Later",
    title: "Responsible reveal",
    description:
      "Share specific projects only when they are clear, useful, and responsible enough to introduce.",
    details: [
      "Reveal only what is ready.",
      "Explain the problem and approach clearly.",
      "Avoid hype and premature promises.",
    ],
  },
]

export const trustItems = [
  { icon: ShieldCheck, text: "Security considered from the beginning" },
  { icon: LockKeyhole, text: "Careful handling of sensitive data" },
  { icon: Layers3, text: "Reusable design and engineering habits" },
  { icon: ServerCog, text: "Practical performance expectations" },
  { icon: DatabaseZap, text: "Clear data boundaries where relevant" },
  { icon: Eye, text: "Human judgment kept visible" },
]

export const faqs: FAQItem[] = [
  {
    question: "What does ARRA build?",
    answer:
      "ARRA is an early-stage tech startup exploring software ideas around context, intelligence, learning, workflow, and developer support. No public product has launched yet.",
  },
  {
    question: "What is the larger ARRA vision?",
    answer:
      "The vision is to build calm, useful technology that helps people understand context and move with better direction. The exact projects are still private and in development.",
  },
  {
    question: "Is ARRA ready to reveal its projects?",
    answer:
      "Not yet. The work is still in the pipeline, and ARRA is choosing not to reveal project details before they are mature enough to discuss responsibly.",
  },
  {
    question: "Why are project details private?",
    answer:
      "ARRA is sharing the direction first and keeping specifics private while the founders refine the scope, risks, and technical approach.",
  },
  {
    question: "How does ARRA think about trust and data?",
    answer:
      "Trust is being treated as an early responsibility. Privacy, access, data exposure, accessibility, and security need attention before any product is shown publicly.",
  },
  {
    question: "Why mention Manipur?",
    answer:
      "Because place shapes judgment. Building from Manipur gives ARRA a direct relationship with infrastructure gaps, learning barriers, coordination problems, and resilience.",
  },
]

export const contactIntents = [
  "General conversation",
  "Builder introduction",
  "Potential collaboration",
  "Early supporter",
]

export const storyMarkers = [
  {
    icon: Compass,
    title: "Understand the terrain",
    body: "Start with the real operating context instead of forcing people into generic software patterns.",
  },
  {
    icon: Network,
    title: "Connect the signals",
    body: "Bring scattered knowledge, tools, and decisions into a clearer view before deciding what to build.",
  },
  {
    icon: Route,
    title: "Reveal the path",
    body: "Use intelligence to make direction clearer while keeping responsibility with people.",
  },
  {
    icon: Sparkles,
    title: "Work before announcements",
    body: "Prioritize honest progress, responsible technology, and product quality over spectacle.",
  },
]

export const enterpriseChecklist = [
  "A clear direction without claiming finished products.",
  "A grounded origin story from Manipur.",
  "Private exploration across AI, learning, workflow, and developer support.",
  "A trust posture that considers privacy, security, accessibility, and restraint.",
  "A patient path toward revealing only what is ready.",
]

export const mailToPilot =
  "mailto:transmission@arra.tech?subject=ARRA%20Conversation"
