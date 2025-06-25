import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/vue/components/ui/button";

export default function SettingsPage() {
	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/app" className="h-8 w-8 -translate-x-1">
						<ChevronLeft className="!h-6 !w-6" />
					</Link>
				</Button>
				<h1 className="text-lg font-medium">Paramètres</h1>
				<div className="h-8 w-8"></div>
			</div>
			<div className="flex flex-1 flex-col space-y-6">
				<div className="mb-6">
					<h2 className="mb-3 text-sm font-medium">Données</h2>
					<Button size="lg" asChild>
						<Link href="/app/settings/crisis">Historique des crises</Link>
					</Button>
				</div>
				<div className="mb-6">
					<h2 className="mb-3 text-sm font-medium">Apparence</h2>
					<Button size="lg" asChild>
						<Link href="/app/settings/apparence">Apparence</Link>
					</Button>
				</div>
				<div className="mb-6">
					<h2 className="mb-3 text-sm font-medium">Programmes</h2>
					<Button size="lg" asChild>
						<Link href="/app/settings/breathing-program">Programmes</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
