"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { HistorySection } from "@/vue/features/settings/components/HistorySection/HistorySection";

export default function SessionHistoryPage() {
	return (
		<div className="bg-background min-h-screen">
			<div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button size="lg" variant="outline" asChild className="h-12 w-12 p-0">
							<Link href="/app/settings">
								<ChevronLeft className="!h-6 !w-6" />
							</Link>
						</Button>
						<div>
							<h1 className="text-2xl font-bold">Historique des sessions</h1>
							<p className="text-muted-foreground text-sm">Suivez vos crises et consultez vos notes</p>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-6">
				<HistorySection />
			</div>
		</div>
	);
}
