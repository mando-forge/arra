"use client";

import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { LatestChange } from "@/components/latest-change";
import { NavGroup } from "@/components/nav-group";

export function AppSidebar() {
	return (
		<Sidebar
			className={cn(
				"border-r border-border/50",
				"*:data-[slot=sidebar-inner]:bg-background/95",
				"*:data-[slot=sidebar-inner]:dark:bg-[radial-gradient(60%_18%_at_10%_0%,color-mix(in_srgb,var(--color-cyan-900,theme(colors.cyan.900))_8%,transparent),transparent)]",
				"**:data-[slot=sidebar-menu-button]:[&>span]:text-foreground/80 **:data-[slot=sidebar-menu-button]:[&>span]:font-mono **:data-[slot=sidebar-menu-button]:[&>span]:text-[11px] **:data-[slot=sidebar-menu-button]:[&>span]:tracking-wider **:data-[slot=sidebar-menu-button]:[&>span]:uppercase"
			)}
			collapsible="icon"
			variant="sidebar"
		>
			<SidebarHeader className="h-14 justify-center border-b px-2">
				<SidebarMenuButton asChild className="hover:bg-transparent">
					<a href="#overview" className="flex items-center gap-2 mt-1">
						<LogoIcon />
						<span className="font-bold mono-label uppercase tracking-[0.2em] text-foreground! text-xs">ARRA_</span>
					</a>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				{navGroups.map((group, index) => (
					<NavGroup key={`sidebar-group-${index}`} {...group} />
				))}
			</SidebarContent>
			<SidebarFooter className="gap-0 p-0">
				<LatestChange />
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className="text-muted-foreground"
								isActive={item.isActive}
								size="sm"
							>
								<a href={item.path}>
									{item.icon}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<div className="px-4 pt-4 pb-2 transition-opacity group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 border-t border-border/50 mt-2">
					<p className="text-nowrap font-mono uppercase tracking-widest text-[9px] text-foreground/40">
						© {new Date().getFullYear()} ARRA-CORE
					</p>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
