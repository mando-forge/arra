"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScrollThreshold } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { useTheme } from "@/components/theme-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export const navLinks = [
	{
		label: "Features",
		href: "#",
	},
	{
		label: "Pricing",
		href: "#",
	},
	{
		label: "About",
		href: "#",
	},
];

export function Header() {
	const scrolled = useScrollThreshold(10);
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<a
					className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
					href="#"
				>
					<Logo className="h-4" />
				</a>
				<div className="hidden items-center gap-2 md:flex">
					{navLinks.map((link) => (
						<Button asChild key={link.label} size="sm" variant="ghost">
							<a href={link.href}>{link.label}</a>
						</Button>
					))}
					<AnimatedThemeToggler 
						variant="star"
						theme={resolvedTheme} 
						onThemeChange={(newTheme) => setTheme(newTheme)}
						className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
					/>
					<Button size="sm" variant="outline">
						Sign In
					</Button>
					<Button size="sm">Get Started</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
