"use client";

import Link from "next/link";
import { BarChart3, Brain, ChevronLeft } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vue/components/ui/card";
import { SettingsContainer } from "@/vue/features/settings";

export default function SettingsPage() {
	return (
		<div className="bg-background min-h-screen">
			<div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button size="lg" variant="outline" asChild className="h-12 w-12 p-0">
							<Link href="/app">
								<ChevronLeft className="!h-6 !w-6" />
							</Link>
						</Button>
						<div>
							<h1 className="text-2xl font-bold">Paramètres</h1>
							<p className="text-muted-foreground text-sm">
								Personnalisez votre expérience de respiration
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-6">
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Brain className="h-5 w-5" />
								Programmes de respiration
							</CardTitle>
							<CardDescription>Choisissez votre programme adapté à votre état actuel.</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/app/settings/program">
								<Button variant="outline" className="w-full">
									Sélectionner un programme
								</Button>
							</Link>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="h-5 w-5" />
								Notes et historique
							</CardTitle>
							<CardDescription>Consultez vos sessions passées et vos notes.</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/app/settings/history">
								<Button variant="outline" className="w-full">
									Voir l&apos;historique
								</Button>
							</Link>
						</CardContent>
					</Card>

					<SettingsContainer />
				</div>
			</div>
		</div>
	);
}
