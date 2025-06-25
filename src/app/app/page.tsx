"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

import { CrisisVisualizer } from "@/vue/components";
import { Circle } from "@/vue/components/SVG/circle";
import { Button } from "@/vue/components/ui/button";
import { useTheme } from "@/vue/hooks/useTheme";

export default function AppPage() {
	const { getCurrentThemeHex } = useTheme();
	const themeHexColors = getCurrentThemeHex();

	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex w-full items-center justify-between">
				<div className="h-8 w-8 -translate-x-1"></div>
				<h1 className="text-lg font-medium">Amai</h1>
				<Button variant="ghost" size="icon" asChild>
					<Link href="/app/settings" className="h-8 w-8 translate-x-1">
						<Settings className="!h-6 !w-6" />
					</Link>
				</Button>
			</div>
			<div className="flex flex-1 flex-col items-center justify-center text-center">
				<CrisisVisualizer />
				<Circle className="w-[400px]" color={themeHexColors?.primaryColor} />
			</div>

			<div className="flex w-full justify-center">
				<Button size="lg" className="h-12 w-full max-w-[400px]">
					Lancer
				</Button>
			</div>
		</div>
	);
}
