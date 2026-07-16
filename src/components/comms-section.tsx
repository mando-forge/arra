import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MailIcon, PhoneIcon } from "lucide-react";
import { GlobalWrapper } from "@/components/layout/global-wrapper";

const transmissionAddress = "transmission@arra.tech";

const contactInfo = [
	{
		icon: <MailIcon />,
		label: "Email",
		value: "transmission@arra.tech",
	},
	{
		icon: <PhoneIcon />,
		label: "Phone",
		value: "UNDISCLOSED",
	},
];

export function CommsSection() {
	return (
		<section
			id="resonance"
			className="relative flex w-full flex-col justify-between overflow-hidden bg-background pt-32"
		>
			<GlobalWrapper className="relative z-10 mb-32 flex flex-col items-center justify-center">
				<div className="relative mx-auto grid h-full w-full max-w-6xl border border-white/20 bg-black/40 shadow-[0_0_30px_rgba(0,0,0,0.8)] md:grid-cols-2">
					<div className="col-span-1 flex flex-col space-y-4 p-8 lg:p-12">
						<p className="text-primary text-sm tracking-[0.2em] uppercase font-bold mb-2">/ RESONANCE</p>
						<h1 className="font-black text-4xl tracking-tight md:text-5xl text-white uppercase">
							Communications
						</h1>
						<p className="max-w-md text-muted-foreground text-sm leading-relaxed md:text-base mt-2">
							If you require direct assistance or need to establish a secure comms relay regarding our services, please
							fill out the transmission form here.
						</p>
						<p className="max-w-md text-muted-foreground text-xs leading-relaxed md:text-sm font-mono mt-1">
							We do our best to respond within 1 business cycle.
						</p>
						<div className="grid gap-4 mt-8">
							{contactInfo?.map((info) => (
								<ContactInfo key={info.label} {...info} />
							))}
						</div>
					</div>
					<div className="col-span-1 flex items-center border-t border-white/10 bg-white/5 p-8 lg:p-12 md:border-t-0 md:border-l">
						<ContactForm />
					</div>
				</div>
			</GlobalWrapper>

			{/* Footer */}
			<div className="border-t border-white/10 bg-background pt-16 pb-8">
				<GlobalWrapper>
					<div className="grid grid-cols-1 gap-8 font-mono text-xs tracking-widest text-muted-foreground uppercase md:grid-cols-4 md:gap-4">
						<div className="flex flex-col gap-4">
							<span className="font-bold text-foreground">ARRA-CORE NEXUS</span>
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
	);
}

function ContactForm() {
	return (
		<form className="w-full">
			<div className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="full-name" className="text-primary uppercase tracking-wider text-xs font-mono">&gt; Full name</Label>
					<Input autoComplete="off" id="full-name" placeholder="[ ENTER IDENTIFICATION ]" className="border-white/10 bg-black/50 text-foreground placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-0 font-mono text-sm" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="email" className="text-primary uppercase tracking-wider text-xs font-mono">&gt; Email</Label>
					<Input
						autoComplete="off"
						id="email"
						placeholder="[ ENTER EMAIL RELAY ]"
						type="email"
						className="border-white/10 bg-black/50 text-foreground placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-0 font-mono text-sm"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="phone" className="text-primary uppercase tracking-wider text-xs font-mono">&gt; Phone</Label>
					<Input
						autoComplete="off"
						id="phone"
						placeholder="[ ENTER FREQUENCY ]"
						type="tel"
						className="border-white/10 bg-black/50 text-foreground placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-0 font-mono text-sm"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="message" className="text-primary uppercase tracking-wider text-xs font-mono">&gt; Message</Label>
					<Textarea
						autoComplete="off"
						id="message"
						placeholder="[ ENTER TRANSMISSION LOG ]"
						className="border-white/10 bg-black/50 text-foreground placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-0 min-h-[140px] font-mono text-sm resize-none"
					/>
				</div>
			</div>
			<div className="mt-8 flex items-center gap-2">
                <span className="text-primary font-mono">&gt;</span>
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
	);
}

type ContactInfoProps = React.ComponentProps<"div"> & {
	icon: React.ReactNode;
	label: string;
	value: string;
};

function ContactInfo({
	icon,
	label,
	value,
	className,
	...props
}: ContactInfoProps) {
	return (
		<div className={cn("flex items-center gap-4 py-3", className)} {...props}>
			<div className="border border-white/10 bg-white/5 p-3 text-primary [&_svg]:size-5">
				{icon}
			</div>
			<div>
				<p className="font-bold text-white uppercase tracking-wider text-sm">{label}</p>
				<p className="text-muted-foreground text-xs font-mono">{value}</p>
			</div>
		</div>
	);
}
