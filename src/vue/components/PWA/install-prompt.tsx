"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { usePWAInstall } from "@/vue/hooks/usePWAInstall";
import { usePWAStatus } from "@/vue/hooks/usePWAStatus";
import { cn } from "@/vue/lib/utils";
import { InstallButton } from "./install-button";

interface InstallPromptProps {
	onInstall: () => void;
	onDismiss: () => void;
	loading?: boolean;
	installState?: "idle" | "loading" | "error" | "ios-manual";
	message?: string;
	className?: string;
}

export const InstallPrompt = memo<InstallPromptProps>(
	({
		onInstall,
		onDismiss,
		loading = false,
		installState = "idle",
		message = "Installer cette application pour l'utiliser",
		className
	}) => {
		const { isInstalled, canInstall } = usePWAStatus();

		const shouldShow = !isInstalled && canInstall;

		const handleInstall = useCallback(() => {
			if (!loading) {
				onInstall();
			}
		}, [onInstall, loading]);

		const handleDismiss = useCallback(() => {
			onDismiss();
		}, [onDismiss]);

		return (
			<AnimatePresence>
				{shouldShow && (
					<motion.div
						initial={{ y: "-100%" }}
						animate={{ y: 0 }}
						exit={{ y: "-100%" }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
							mass: 0.8
						}}
						className={cn("fixed top-0 right-0 left-0 z-50", className)}
						role="alert"
						aria-live="polite"
						aria-label="Bannière d'installation de l'application"
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ delay: 0.1, duration: 0.2 }}
							className="border-border bg-background border-b p-4 shadow-sm"
						>
							<div className="mx-auto flex max-w-7xl items-center justify-between">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2, duration: 0.3 }}
									className="flex-1 pr-4"
								>
									<p className="text-muted-foreground text-sm">{message}</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3, duration: 0.3 }}
									className="flex items-center gap-3"
								>
									<InstallButton
										onClick={handleInstall}
										loading={loading}
										state={installState}
										variant="primary"
										size="sm"
									>
										{installState === "error"
											? "Réessayer"
											: installState === "ios-manual"
												? "Instructions"
												: "Installer"}
									</InstallButton>

									<Button
										variant="ghost"
										size="sm"
										onClick={handleDismiss}
										className="p-1.5"
										aria-label="Fermer la bannière"
									>
										<X className="h-4 w-4 text-gray-400" />
									</Button>
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		);
	}
);

InstallPrompt.displayName = "InstallPrompt";

export const AutoInstallPrompt = memo(() => {
	const { installApp } = usePWAInstall();
	const [isDismissed, setIsDismissed] = useState(false);

	const handleInstall = useCallback(async () => {
		try {
			const result = await installApp();
			if (result.success) {
				setIsDismissed(true);
			}
		} catch (error) {
			console.error("Installation failed:", error);
		}
	}, [installApp]);

	const handleDismiss = useCallback(() => {
		setIsDismissed(true);
		try {
			localStorage.setItem("pwa-install-dismissed", "true");
		} catch (error) {
			console.warn("Failed to save dismissal state:", error);
		}
	}, []);

	useEffect(() => {
		try {
			const dismissed = localStorage.getItem("pwa-install-dismissed");
			if (dismissed === "true") {
				setIsDismissed(true);
			}
		} catch (error) {
			console.warn("Failed to read dismissal state:", error);
		}
	}, []);

	const { canInstall } = usePWAStatus();
	useEffect(() => {
		if (canInstall && isDismissed) {
			const timer = setTimeout(
				() => {
					setIsDismissed(false);
					try {
						localStorage.removeItem("pwa-install-dismissed");
					} catch (error) {
						console.warn("Failed to clear dismissal state:", error);
					}
				},
				24 * 60 * 60 * 1000
			);

			return () => clearTimeout(timer);
		}
	}, [canInstall, isDismissed]);

	if (isDismissed) {
		return null;
	}

	return <InstallPrompt onInstall={handleInstall} onDismiss={handleDismiss} />;
});

AutoInstallPrompt.displayName = "AutoInstallPrompt";
