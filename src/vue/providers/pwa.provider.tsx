"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import type { Platform } from "@/vue/types/pwa";

export interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
	standalone?: boolean;
}

interface PWAState {
	isOnline: boolean;
	isInstalled: boolean;
	canInstall: boolean;
	hasUpdate: boolean;
	isRegistered: boolean;
	platform: Platform;
	isInstalling: boolean;
	isUpdating: boolean;
}

interface PWAContextValue extends PWAState {
	installApp: () => Promise<boolean>;
	activateUpdate: () => Promise<boolean>;
}

const PWAContext = createContext<PWAContextValue | null>(null);

interface PWAProviderProps {
	children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
	const [state, setState] = useState<PWAState>({
		isOnline: true,
		isInstalled: false,
		canInstall: false,
		hasUpdate: false,
		isRegistered: false,
		platform: "other",
		isInstalling: false,
		isUpdating: false
	});

	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

	// Detect platform
	const detectPlatform = (): Platform => {
		if (typeof window === "undefined") return "other";

		const userAgent = window.navigator.userAgent.toLowerCase();

		if (userAgent.includes("edg/")) return "edge";
		if (userAgent.includes("chrome") && !userAgent.includes("edg/")) return "chrome";
		if (userAgent.includes("firefox")) return "firefox";
		if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "safari";

		return "other";
	};

	// Check if app is installed
	const isAppInstalled = (): boolean => {
		if (typeof window === "undefined") return false;

		// Standalone mode (PWA installed)
		if (window.matchMedia("(display-mode: standalone)").matches) return true;

		// iOS Safari
		if ("standalone" in window.navigator) {
			return (window.navigator as NavigatorWithStandalone).standalone as boolean;
		}

		// Android Chrome
		return window.matchMedia("(display-mode: minimal-ui)").matches;
	};

	// Register service worker
	const registerServiceWorker = async () => {
		if (!("serviceWorker" in navigator)) return false;

		try {
			const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

			// Listen for updates
			registration.addEventListener("updatefound", () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener("statechange", () => {
						if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
							setState((prev) => ({ ...prev, hasUpdate: true }));
						}
					});
				}
			});

			setState((prev) => ({ ...prev, isRegistered: true }));
			return true;
		} catch (error) {
			console.error("Service Worker registration failed:", error);
			return false;
		}
	};

	// Install app
	const installApp = async (): Promise<boolean> => {
		if (!deferredPrompt) return false;

		setState((prev) => ({ ...prev, isInstalling: true }));

		try {
			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;

			setDeferredPrompt(null);

			if (outcome === "accepted") {
				setState((prev) => ({ ...prev, isInstalled: true, canInstall: false }));
				return true;
			}

			return false;
		} catch (error) {
			console.error("Installation failed:", error);
			return false;
		} finally {
			setState((prev) => ({ ...prev, isInstalling: false }));
		}
	};

	// Activate update
	const activateUpdate = async (): Promise<boolean> => {
		if (!("serviceWorker" in navigator)) return false;

		setState((prev) => ({ ...prev, isUpdating: true }));

		try {
			const registration = await navigator.serviceWorker.getRegistration();

			if (registration?.waiting) {
				const messageChannel = new MessageChannel();

				const responsePromise = new Promise<boolean>((resolve) => {
					messageChannel.port1.onmessage = (event) => {
						resolve(event.data.success === true);
					};

					setTimeout(() => resolve(false), 5000);
				});

				registration.waiting.postMessage({ type: "SKIP_WAITING" }, [messageChannel.port2]);

				const success = await responsePromise;
				if (success) {
					window.location.reload();
				}
				return success;
			}

			return false;
		} catch (error) {
			console.error("Update activation failed:", error);
			return false;
		} finally {
			setState((prev) => ({ ...prev, isUpdating: false }));
		}
	};

	// Initialize PWA
	useEffect(() => {
		const platform = detectPlatform();
		const isInstalled = isAppInstalled();
		const isOnline = navigator.onLine;

		setState((prev) => ({
			...prev,
			platform,
			isInstalled,
			isOnline,
			canInstall: !isInstalled && (platform === "chrome" || platform === "edge" || platform === "safari")
		}));

		// Register service worker
		registerServiceWorker();

		// Handle beforeinstallprompt
		const handleBeforeInstallPrompt = (event: Event) => {
			event.preventDefault();
			setDeferredPrompt(event as BeforeInstallPromptEvent);
			setState((prev) => ({ ...prev, canInstall: true }));
		};

		// Handle app installed
		const handleAppInstalled = () => {
			setDeferredPrompt(null);
			setState((prev) => ({ ...prev, isInstalled: true, canInstall: false }));
		};

		// Handle online/offline
		const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }));
		const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }));

		// Handle service worker controller change
		const handleControllerChange = () => {
			window.location.reload();
		};

		// Add event listeners
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
		}

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);

			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
			}
		};
	}, []);

	const contextValue: PWAContextValue = {
		...state,
		installApp,
		activateUpdate
	};

	return <PWAContext.Provider value={contextValue}>{children}</PWAContext.Provider>;
}

// Hook to use PWA context
export function usePWA(): PWAContextValue {
	const context = useContext(PWAContext);

	if (!context) {
		throw new Error("usePWA must be used within a PWAProvider");
	}

	return context;
}
