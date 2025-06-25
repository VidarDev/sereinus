"use client";

import Image from "next/image";

import { PWAInstallButton } from "@/vue/components/pwa-install-button";

export default function HomePage() {
	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex flex-1 flex-col items-center justify-center text-center">
				<Image
					src="/apple-touch-icon.png"
					alt="Amai"
					width={500}
					height={500}
					className="h-auto w-[500px] max-w-[80%]"
				/>
				<h1 className="mt-6 mb-4 text-5xl font-semibold">Amai</h1>
			</div>

			<div className="absolute bottom-0 w-full">
				<PWAInstallButton size="lg" className="h-12 w-full" />
			</div>
		</div>
	);
}
