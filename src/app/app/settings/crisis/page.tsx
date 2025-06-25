import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { CrisisListContent } from "@/vue/components/CrisisListContent/CrisisListContent";
import { Button } from "@/vue/components/ui/button";

export const dynamic = "force-dynamic";

function LoadingSpinner() {
	return (
		<div className="p-4 text-center">
			<div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
			<p className="mt-2 text-sm text-gray-600">Chargement des crises...</p>
		</div>
	);
}

export default function CrisisSettingsPage() {
	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/app" className="h-8 w-8 -translate-x-1">
						<ChevronLeft className="!h-6 !w-6" />
					</Link>
				</Button>
				<h1 className="text-lg font-medium">Liste des crises</h1>
				<div className="h-8 w-8"></div>
			</div>
			<div className="flex flex-1 flex-col">
				<Suspense fallback={<LoadingSpinner />}>
					<CrisisListContent />
				</Suspense>
			</div>
		</div>
	);
}
