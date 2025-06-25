"use client";

import { motion } from "motion/react";

import { InstallManager } from "@/vue/components/PWA/install-manager";
import { Logo } from "@/vue/components/SVG/logo";
import { useTheme } from "@/vue/providers/theme.provider";

export default function HomePage() {
	const { getCurrentThemeHex } = useTheme();
	const themeHexColors = getCurrentThemeHex();

	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<motion.div
				className="flex flex-1 flex-col items-center justify-center text-center"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
					className="flex flex-1 flex-col items-center justify-center text-center"
				>
					<Logo className="h-auto w-[500px] max-w-[80%]" color={themeHexColors?.primaryColor} />
				</motion.div>
				<h1 className="sr-only">Amai</h1>
			</motion.div>

			<motion.div
				className="absolute bottom-0 flex w-full justify-center"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
			>
				<InstallManager mode="button" variant="primary" size="lg" className="h-12 w-full max-w-[400px]">
					Installer l&apos;App
				</InstallManager>
			</motion.div>
		</div>
	);
}
