"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PWAInstallationService } from "@/main/presentation/services/installation-pwa.service";
import type {
	BeforeInstallPromptEvent,
	NavigatorWithStandalone,
	PWAInstallationResult,
	PWAInstallationState
} from "@/vue/features/pwa/types/pwa";

const installationService = PWAInstallationService.getInstance();

export function usePWAInstall() {
	const [installationState, setInstallationState] = useState<PWAInstallationState>({
		canInstall: false,
		isInstalled: false,
		platform: "other",
		installMethod: "none"
	});

	const [isInstalling, setIsInstalling] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [retryCount, setRetryCount] = useState(0);

	const updateInstallationState = useCallback(async () => {
		try {
			setIsLoading(true);
			const state = await installationService.getInstallationState();
			setInstallationState(state);

			if (state.isInstalled) {
				document.cookie = "pwa-installed=true; path=/; max-age=31536000; SameSite=Lax";
			} else {
				document.cookie = "pwa-installed=false; path=/; max-age=0; SameSite=Lax";
			}
		} catch (error) {
			console.error("[PWA Hook] Failed to update state:", error);
			if (retryCount < 3) {
				const delay = Math.pow(2, retryCount) * 1000;
				setTimeout(() => {
					setRetryCount((prev) => prev + 1);
					updateInstallationState();
				}, delay);
			}
		} finally {
			setIsLoading(false);
		}
	}, [retryCount]);

	const installApp = useCallback(async (): Promise<PWAInstallationResult> => {
		if (isInstalling) {
			return { success: false, error: "Installation déjà en cours" };
		}

		setIsInstalling(true);

		try {
			const result = await installationService.installApp();

			if (result.success) {
				await updateInstallationState();
			} else {
				console.warn("[PWA Hook] Installation failed:", result.error);
			}

			return result;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Erreur d'installation inconnue";
			console.error("[PWA Hook] Installation error:", error);
			return { success: false, error: errorMessage };
		} finally {
			setIsInstalling(false);
		}
	}, [isInstalling, updateInstallationState]);

	const getInstallInstructions = useCallback(() => {
		return installationService.getInstallInstructions(installationState.platform);
	}, [installationState.platform]);

	const refreshState = useCallback(async () => {
		setRetryCount(0);
		await updateInstallationState();
	}, [updateInstallationState]);

	useEffect(() => {
		let isComponentMounted = true;

		const handleBeforeInstallPrompt = (event: Event) => {
			event.preventDefault();
			const promptEvent = event as BeforeInstallPromptEvent;
			installationService.setDeferredPrompt(promptEvent);

			if (isComponentMounted) {
				updateInstallationState();
			}
		};

		const handleAppInstalled = () => {
			installationService.clearDeferredPrompt();

			if (isComponentMounted) {
				updateInstallationState();
			}
		};

		const handleVisibilityChange = () => {
			if (!document.hidden && isComponentMounted) {
				updateInstallationState();
			}
		};

		const handleFocus = () => {
			if (isComponentMounted) {
				updateInstallationState();
			}
		};

		updateInstallationState();

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("focus", handleFocus);

		return () => {
			isComponentMounted = false;
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("focus", handleFocus);
		};
	}, [updateInstallationState]);

	useEffect(() => {
		if (installationState.platform === "safari" || !installationState.canInstall) {
			const interval = setInterval(() => {
				updateInstallationState();
			}, 10000);

			return () => clearInterval(interval);
		}
	}, [installationState.platform, installationState.canInstall, updateInstallationState]);

	// Effect to immediately detect standalone mode on mount
	useEffect(() => {
		const checkStandaloneMode = () => {
			if (typeof window === "undefined") return;

			const isStandalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				("standalone" in window.navigator &&
					(window.navigator as NavigatorWithStandalone).standalone === true) ||
				window.matchMedia("(display-mode: minimal-ui)").matches ||
				window.matchMedia("(display-mode: fullscreen)").matches;

			if (isStandalone) {
				document.cookie = "pwa-installed=true; path=/; max-age=31536000; SameSite=Lax";
			}
		};

		checkStandaloneMode();

		const mediaQuery = window.matchMedia("(display-mode: standalone)");
		const handleChange = () => checkStandaloneMode();

		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		} else {
			// Fallback for older browsers
			mediaQuery.addListener(handleChange);
			return () => mediaQuery.removeListener(handleChange);
		}
	}, []);

	// Memoized values
	const memoizedValues = useMemo(
		() => ({
			canInstall: installationState.canInstall,
			isInstalled: installationState.isInstalled,
			platform: installationState.platform,
			installMethod: installationState.installMethod,
			hasDeferredPrompt: installationService.hasDeferredPrompt(),
			// Derived state
			isPWACapable: installationState.canInstall || installationState.isInstalled,
			requiresManualInstall:
				installationState.installMethod === "ios-safari" || installationState.installMethod === "manual",
			canUsePrompt:
				installationState.installMethod === "beforeinstallprompt" && installationService.hasDeferredPrompt()
		}),
		[installationState]
	);

	return {
		// State
		installationState,
		isInstalling,
		isLoading,

		// Actions
		installApp,
		getInstallInstructions,
		updateInstallationState: refreshState,

		// Memoized helpers
		...memoizedValues
	};
}
