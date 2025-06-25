import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { ColorSwitcher } from "@/vue/components/color-switcher";
import { ModeSwitcher } from "@/vue/components/mode-switcher";
import { Button } from "@/vue/components/ui/button";

export default function SettingsPage() {
	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/app" className="h-8 w-8">
						<ChevronLeft className="!h-6 !w-6" />
					</Link>
				</Button>
				<h1 className="text-lg font-medium">Paramètres</h1>
				<div className="h-8 w-8"></div>
			</div>
			<div className="flex flex-1 flex-col">
				<div className="mb-4">
					<h2 className="mb-1 text-sm font-medium">Mode d&apos;apparence</h2>
					<ModeSwitcher showLabels variant="buttons" />
				</div>
				<div className="mb-4">
					<h2 className="mb-1 text-sm font-medium">Couleur</h2>
					<ColorSwitcher showLabels variant="palette" />
				</div>
				<div className="mb-4">
					<h2 className="mb-1 text-sm font-medium">Mode d&apos;apparence</h2>
					<Button size="lg" asChild>
						<Link href="/app/settings/crisis">Historique des crises</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
