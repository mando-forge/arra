import { BentoSection as PathfindersSection } from "@/components/bento-section"
import { CommsSection } from "@/components/comms-section"
import { EthosSection as ConstellationSection } from "@/components/ethos-section"
import { HeroSection as GatewaySection } from "@/components/hero-section"
import { MethodologySection as ProtocolSection } from "@/components/methodology-section"
import { Header } from "@/layout/header"

export default function App() {
  return (
    <div className="dark flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <GatewaySection />
        <ConstellationSection />
        <PathfindersSection />
        <ProtocolSection />
        <CommsSection />
      </main>
    </div>
  )
}
