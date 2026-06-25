import { GlobalWrapper } from "@/components/layout/global-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const transmissionAddress = "transmission@arra.tech"

export function CommsSection() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const alias = String(data.get("alias") ?? "")
    const origin = String(data.get("origin") ?? "")
    const frequency = String(data.get("frequency") ?? "")

    const MAX_FREQUENCY_CHARS = 1200
    if (frequency.length > MAX_FREQUENCY_CHARS) {
      window.alert(`Message too long. Please keep it under ${MAX_FREQUENCY_CHARS} characters.`)
      return
    }

    const subject = encodeURIComponent(`ARRA transmission from ${alias}`)
    const body = encodeURIComponent(
      `ALIAS: ${alias}\nORIGIN COORDINATES: ${origin}\n\n${frequency}`
    )

    window.location.href = `mailto:${transmissionAddress}?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="resonance"
      className="relative flex w-full flex-col justify-between overflow-hidden bg-background pt-32"
    >
      <GlobalWrapper className="relative z-10 mb-32 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mb-12">
            <p className="text-primary text-sm tracking-[0.2em] uppercase font-bold mb-4">/ RESONANCE</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-white leading-[0.95]">COMMUNICATIONS</h2>
        </div>
        <div className="relative w-full max-w-4xl border border-white/20 bg-black font-mono text-sm shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between border-b border-white/20 bg-white/5 px-4 py-2">
            <div className="flex gap-2" aria-hidden="true">
              <div className="size-3 bg-white/20" />
              <div className="size-3 bg-white/20" />
              <div className="size-3 bg-white/20" />
            </div>
            <h2 className="text-xs tracking-widest text-muted-foreground uppercase">
              Terminal // Resonance
            </h2>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8">
              <p className="mb-2 text-primary">
                INITIALIZING SECURE COMMS RELAY...
              </p>
              <p className="text-muted-foreground">
                DIRECT TRANSMISSIONS OPEN IN YOUR LOCAL MAIL RELAY.
              </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Label
                  htmlFor="alias"
                  className="whitespace-nowrap text-primary uppercase"
                >
                  &gt; Input Alias:
                </Label>
                <Input
                  id="alias"
                  name="alias"
                  type="text"
                  className="flex-1 border-0 bg-transparent text-foreground placeholder:text-white/20 focus-visible:ring-0"
                  placeholder="[ ENTER IDENTIFICATION ]"
                  required
                />
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Label
                  htmlFor="origin"
                  className="whitespace-nowrap text-primary uppercase"
                >
                  &gt; Origin Coordinates:
                </Label>
                <Input
                  id="origin"
                  name="origin"
                  type="email"
                  className="flex-1 border-0 bg-transparent text-foreground placeholder:text-white/20 focus-visible:ring-0"
                  placeholder="[ ENTER EMAIL RELAY ]"
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="frequency" className="text-primary uppercase">
                  &gt; Transmit Frequency:
                </Label>
                <Textarea
                  id="frequency"
                  name="frequency"
                  maxLength={1200}
                  className="min-h-36 resize-none border-white/10 bg-transparent p-4 text-foreground placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-0"
                  placeholder="[ ENTER MESSAGE LOG ]"
                  required
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-primary">&gt;</span>
                <Button
                  type="submit"
                  variant="ghost"
                  className="h-auto cursor-pointer p-0 font-mono tracking-widest text-primary uppercase hover:bg-transparent hover:text-white"
                >
                  [ Execute_Transmission ]
                </Button>
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-5 w-2.5 animate-pulse bg-primary"
                />
              </div>
            </form>
          </div>
        </div>
      </GlobalWrapper>

      <div className="border-t border-white/10 bg-background pt-16 pb-8">
        <GlobalWrapper>
          <div className="grid grid-cols-1 gap-8 font-mono text-xs tracking-widest text-muted-foreground uppercase md:grid-cols-4 md:gap-4">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">ARRA NEXUS</span>
              <span>&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
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
              <a
                href={`mailto:${transmissionAddress}`}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                DIRECT TRANSMISSION
              </a>
              <a
                href="#nexus-gateway"
                className="cursor-pointer transition-colors hover:text-primary"
              >
                RETURN TO GATEWAY
              </a>
            </div>
          </div>
        </GlobalWrapper>
      </div>
    </section>
  )
}
