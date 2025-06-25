import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SVGShapeSelector } from "@/vue/components/Breathing/breathing-svg-shape-selector";
import { ThemeSelector } from "@/vue/components/Theme";
import { Button } from "@/vue/components/ui/button";

export default function SettingsPage() {
	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/app/settings" className="h-12 w-12 -translate-x-3">
						<ChevronLeft className="!h-7 !w-7" />
					</Link>
				</Button>
				<h1 className="text-lg font-medium">Apparence</h1>
				<div className="h-8 w-8"></div>
			</div>
			<div className="flex flex-1 flex-col space-y-6">
				<div>
					<h2 className="mb-3 text-sm font-medium">Mode d&apos;apparence</h2>
					<ThemeSelector className="justify-start" />
				</div>

				<div>
					<SVGShapeSelector />
				</div>
			</div>
		</div>
	);
}
