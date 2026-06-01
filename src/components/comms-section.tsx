"use client"

import { Button } from "@/components/ui/button"
import { GlobalWrapper } from "./layout/global-wrapper"

export function CommsSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Echo transmitted. We will find you.")
  }

  return (
    <section id="resonance" className="w-full pt-32 bg-background relative overflow-hidden flex flex-col justify-between">
      
      {/* Terminal Window */}
      <GlobalWrapper className="flex flex-col items-center justify-center relative z-10 mb-32">
        <div className="w-full max-w-4xl bg-black border border-white/20 font-mono text-sm relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          
          {/* Terminal Header */}
          <div className="border-b border-white/20 bg-white/5 px-4 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="size-3 rounded-none bg-white/20"></div>
              <div className="size-3 rounded-none bg-white/20"></div>
              <div className="size-3 rounded-none bg-white/20"></div>
            </div>
            <h3 className="text-xs tracking-widest text-muted-foreground uppercase">
              Terminal // Resonance
            </h3>
          </div>

          {/* Terminal Body */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <p className="text-primary mb-2">INITIALIZING SECURE COMMS RELAY...</p>
              <p className="text-muted-foreground">WARNING: UNAUTHORIZED TRANSMISSIONS WILL BE TRACED.</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label htmlFor="alias" className="text-primary whitespace-nowrap uppercase">
                  &gt; INPUT ALIAS:
                </label>
                <input 
                  id="alias" 
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder-white/20"
                  placeholder="[ ENTER IDENTIFICATION ]"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label htmlFor="origin" className="text-primary whitespace-nowrap uppercase">
                  &gt; ORIGIN COORDINATES:
                </label>
                <input 
                  id="origin" 
                  type="email"
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder-white/20"
                  placeholder="[ ENTER EMAIL RELAY ]"
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="frequency" className="text-primary uppercase flex items-center gap-2">
                  &gt; TRANSMIT FREQUENCY:
                </label>
                <textarea 
                  id="frequency" 
                  className="w-full bg-transparent border border-white/10 outline-none focus:border-primary focus:ring-0 text-foreground p-4 min-h-[150px] resize-none placeholder-white/20"
                  placeholder="[ ENTER MESSAGE LOG ]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-primary">&gt;</span>
                <Button type="submit" variant="ghost" className="h-auto p-0 font-mono text-primary hover:bg-transparent hover:text-white uppercase tracking-widest transition-colors rounded-none cursor-pointer">
                  [ EXECUTE_TRANSMISSION ]
                </Button>
                <span className="inline-block w-2.5 h-5 bg-primary animate-pulse ml-1"></span>
              </div>
            </form>
          </div>
        </div>
      </GlobalWrapper>

      {/* Footer Anchor: 4-Column Grid */}
      <div className="border-t border-white/10 bg-background pt-16 pb-8">
        <GlobalWrapper>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 text-xs font-mono tracking-widest uppercase text-muted-foreground">
            
            <div className="flex flex-col gap-4">
              <span className="text-foreground font-bold">MOKORO NEXUS</span>
              <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-primary">SECTOR LOCATION:</span>
              <span>MANIPUR, EARTH</span>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-primary">OPERATIONAL STATUS:</span>
              <span>UNDISCLOSED NEXUS</span>
            </div>

            <div className="flex flex-col gap-4 md:items-end">
              <a href="#" className="hover:text-primary transition-colors cursor-pointer">ENCRYPTION KEY</a>
              <a href="#" className="hover:text-primary transition-colors cursor-pointer">SYSTEM ARCHITECTURE</a>
            </div>

          </div>
        </GlobalWrapper>
      </div>
      
    </section>
  )
}
