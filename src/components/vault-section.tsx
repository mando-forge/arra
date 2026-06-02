import { Cpu, Database, Hexagon, ShieldAlert } from "lucide-react"

import { GlobalWrapper } from "@/components/layout/global-wrapper"
import { ShineBorder } from "@/components/shine-border"

const ASSETS = [
  { id: "01", name: "ASSET: OMEGA-PROTOCOL", image: "/ai-logo.png", icon: <Database className="size-12" /> },
  { id: "02", name: "ASSET: KINETIC-ENGINE", image: "/templates/ai-icons.jpg", icon: <Hexagon className="size-12" /> },
  { id: "03", name: "ASSET: NEURO-LINK", image: "/templates/ai-logos.jpg", icon: <Cpu className="size-12" /> },
  { id: "04", name: "ASSET: AEGIS-SHIELD", image: "/templates/ai-hero-black.jpg", icon: <ShieldAlert className="size-12" /> },
]

export function VaultSection() {
  return (
    <section id="act-iv" className="w-full py-24 md:py-32 bg-background border-t border-white/5">
      <GlobalWrapper>
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] uppercase text-foreground">The Vault</h2>
          <p className="text-muted-foreground text-xs uppercase font-mono tracking-widest mt-4">
            Classified technology architecture. Access heavily restricted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSETS.map((asset) => (
            <ShineBorder
              key={asset.id}
              borderRadius={0}
              borderWidth={1}
              color={["var(--color-primary)", "transparent", "transparent"]}
              className="group aspect-square w-full bg-black border border-white/10 cursor-crosshair transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_var(--color-primary)]"
            >
              {/* Redacted State (Default) */}
              <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 group-hover:opacity-0">
                <div className="w-full h-8 bg-white/5 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]" />
                </div>
                <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground bg-black/50 px-2 py-1 border border-white/10">
                  REDACTED
                </p>
                <div className="mt-auto w-full border-t border-white/5 pt-4 text-left">
                  <span className="text-[10px] text-white/40 font-mono">[{asset.id}] {asset.name}</span>
                </div>
              </div>

              {/* Revealed State (Hover) */}
              <div className="absolute inset-0 z-0 flex scale-95 flex-col items-center justify-center bg-vault-revealed p-6 text-center text-primary opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <img
                  src={asset.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
                  decoding="async"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-vault-revealed/70" />
                {/* Glowing Wireframe Background */}
                <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklch,var(--color-primary)_15%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--color-primary)_15%,transparent)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
                
                <div className="relative z-10 animate-pulse drop-shadow-[0_0_15px_var(--color-primary)] mb-6">
                  {asset.icon}
                </div>
                
                <h3 className="relative z-10 text-sm font-bold tracking-[0.2em] uppercase glow-text">
                  {asset.name}
                </h3>
                <p className="relative z-10 text-[10px] font-mono mt-2 opacity-70">
                  STATUS: ONLINE // SYNCHRONIZING NODE DATA
                </p>
              </div>
            </ShineBorder>
          ))}
        </div>
      </GlobalWrapper>
    </section>
  )
}

