import Link from "next/link";
import { Settings } from "lucide-react";

import { CrisisVisualizer } from "@/vue/components";
import { Button } from "@/vue/components/ui/button";

export default function AppPage() {
	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex w-full items-center justify-between">
				<div className="h-8 w-8"></div>
				<h1 className="text-lg font-medium">Amai</h1>
				<Button variant="ghost" size="icon" asChild>
					<Link href="/app/settings" className="h-8 w-8">
						<Settings className="!h-6 !w-6" />
					</Link>
				</Button>
			</div>
			<div className="flex flex-1 flex-col items-center justify-center text-center">
				<CrisisVisualizer />
			</div>

			<div className="w-full">
				<Button size="lg" className="h-12 w-full">
					Lancer un crise
				</Button>
			</div>
		</div>
	);
}
