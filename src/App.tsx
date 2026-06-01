import { Header } from "./layout/header"
import { HeroSection } from "./components/hero-section"
import { SeveredNodeSection } from "./components/severed-node-section"
import { BentoSection as PathfindersSection } from "./components/bento-section"
import { VaultSection } from "./components/vault-section"
import { MethodologySection } from "./components/methodology-section"
import { NavComputerSection } from "./components/nav-computer-section"
import { MarqueeSection } from "./components/marquee-section"
import { CommsSection } from "./components/comms-section"

export default function App() {
  return (
    <div className="dark flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SeveredNodeSection />
        <PathfindersSection />
        <VaultSection />
        <MethodologySection />
        <NavComputerSection />
        <MarqueeSection />
        <CommsSection />
      </main>
    </div>
  )
}
