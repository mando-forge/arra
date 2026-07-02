import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<XIcon className="size-4.5" />
				) : (
					<MenuIcon className="size-4.5" />
				)}
			</Button>
			{open && (
				<Portal className="top-14" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-4"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-2">
							{navLinks.map((link) => (
								<Button
									asChild
									className="justify-start"
									key={link.label}
									variant="ghost"
								>
									<a href={link.href}>{link.label}</a>
								</Button>
							))}
						</div>
						<div className="mt-6 flex items-center justify-between px-2">
							<span className="text-sm font-medium">Theme</span>
							<AnimatedThemeToggler 
								variant="star"
								theme={resolvedTheme} 
								onThemeChange={(newTheme) => setTheme(newTheme)}
								className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
							/>
						</div>
						<div className="mt-6 flex flex-col gap-2">
							<Button className="w-full" variant="outline">
								Sign In
							</Button>
							<Button className="w-full">Get Started</Button>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
