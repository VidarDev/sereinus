"use client";

import { PWAInstallButton } from "@/vue/components/pwa/pwa-install-button";
import { ThemeSwitcher } from "@/vue/components/theme-switcher";

export default function Home() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Amai - Clean Architecture PWA</h1>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="space-y-4">
					<ThemeSwitcher />
					<PWAInstallButton />
				</div>
			</div>
		</div>
	);
}
