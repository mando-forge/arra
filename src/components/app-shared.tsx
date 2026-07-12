import type { ReactNode } from "react";
import { Activity, Database, Mail, FileText, Settings, LifeBuoy } from "lucide-react";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Operator Core",
		items: [
			{
				title: "Overview",
				path: "#overview",
				icon: <Activity />,
				isActive: true,
			},
		],
	},
	{
		label: "Communications",
		items: [
			{
				title: "Inquiries",
				path: "#inquiries",
				icon: <Mail />,
			},
		],
	},
	{
		label: "Neural Net",
		items: [
			{
				title: "Knowledge Base",
				path: "#knowledge",
				icon: <Database />,
			},
		],
	},
	{
		label: "Content Management",
		items: [
			{
				title: "Blog CMS",
				path: "#cms",
				icon: <FileText />,
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Support",
		path: "#support",
		icon: <LifeBuoy />,
	},
	{
		title: "Settings",
		path: "#settings",
		icon: <Settings />,
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
