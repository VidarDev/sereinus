"use client";

import { ColorSwitcher } from "@/vue/components/color-switcher";
import { ModeSwitcher } from "@/vue/components/mode-switcher";
import { PWAInstallButton } from "@/vue/components/pwa-install-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vue/components/ui/card";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
			<div className="text-center">
				<h1 className="mb-4 text-4xl font-bold">Amai</h1>
				<p className="text-muted-foreground mb-8 text-lg">Application PWA</p>
			</div>

			<div className="flex flex-col gap-4">
				<PWAInstallButton />
			</div>

			<div className="bg-muted mt-8 rounded-lg p-4 text-sm">
				<Card>
					<CardHeader>
						<CardTitle>Theme Controls</CardTitle>
						<CardDescription>Separate controls for mode and color themes</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<div>
								<h4 className="mb-2 text-sm font-medium">Mode Switcher (Dark/Light/Auto)</h4>
								<ModeSwitcher showLabels variant="buttons" />
							</div>

							<div>
								<h4 className="mb-2 text-sm font-medium">Color Theme Switcher</h4>
								<ColorSwitcher showLabels variant="palette" />
							</div>

							<div>
								<h4 className="mb-2 text-sm font-medium">Quick Toggle</h4>
								<div className="flex items-center gap-2">
									<ModeSwitcher variant="toggle" />
									<ColorSwitcher size="sm" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
