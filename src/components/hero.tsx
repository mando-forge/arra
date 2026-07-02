import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon } from "lucide-react";

export function HeroSection() {
	return (
		<section id="nexus-gateway" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16">


			{/* Main Content Container */}
			<div className="relative z-10 mx-auto w-full max-w-5xl">
				{/* Top Shades */}
				<div
					aria-hidden="true"
					className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
				>
					<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.15),transparent)] contain-strict" />
				</div>

				{/* X Bold Faded Borders */}
				<div
					aria-hidden="true"
					className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
				>
					<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15" />
					<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15" />
				</div>

				{/* main content */}
				<div className="relative flex flex-col items-center justify-center gap-6 py-20 px-4">
					{/* X Content Faded Borders */}
					<div
						aria-hidden="true"
						className="absolute inset-0 -z-1 size-full overflow-hidden"
					>
						<div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
						<div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
						<div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
						<div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
					</div>

					<a
						className={cn(
							"group mx-auto flex w-fit items-center gap-3 border border-foreground/20 bg-background/50 backdrop-blur-md px-4 py-1.5 shadow-lg",
							"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out hover:bg-background/80"
						)}
						href="#nexus"
					>
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
						</span>
						<span className="text-xs font-medium tracking-wide uppercase text-foreground/90">System Online: Macroscope & GBrain Active</span>
						<span className="block h-5 border-l border-foreground/20" />
						<ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
					</a>

					<h1
						className={cn(
							"fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-5xl font-bold tracking-tight delay-100 duration-500 ease-out md:text-6xl lg:text-7xl",
							"text-shadow-[0_0px_50px_theme(--color-primary/.3)]"
						)}
					>
						Orchestrating Intelligence <br /> at the Speed of Thought
					</h1>

					<p className="fade-in slide-in-from-bottom-10 mx-auto max-w-2xl animate-in fill-mode-backwards text-center text-base text-foreground/80 tracking-wide delay-200 duration-500 ease-out sm:text-lg md:text-xl leading-relaxed">
						Arra Nexus fuses your development workflow with autonomous agent networks. Review code, execute plans, and ship products from a single unified cosmos.
					</p>

					<div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-4 fill-mode-backwards pt-6 delay-300 duration-500 ease-out">
						<Button className="font-semibold bg-primary/90 hover:bg-primary shadow-[0_0_20px_theme(--color-primary/.3)] transition-all" size="lg">
							<RocketIcon className="mr-2 size-4" />
							Initialize Sequence
						</Button>
						<Button className="font-semibold bg-background/50 backdrop-blur-md border border-foreground/20 hover:bg-background/80" size="lg" variant="outline">
							Explore the Nexus
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
