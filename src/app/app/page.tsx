"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

import { BreathingExercise } from "@/vue/components/Breathing";
import { Button } from "@/vue/components/ui/button";

export default function AppPage() {
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
			<div className="flex flex-1 flex-col gap-6">
				<BreathingExercise className="flex-1" />
			</div>
		</div>
	);
}
