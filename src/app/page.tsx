"use client";

import Link from "next/link";

import { ThemeSwitcher } from "@/vue/components/theme-switcher";
import { Button } from "@/vue/components/ui/button";

export default function Home() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Amai</h1>

			<div className="flex gap-4">
				<Button asChild variant="outline">
					<Link href="/test-sw">Test Service Worker</Link>
				</Button>
			</div>

			<ThemeSwitcher />
		</div>
	);
}
