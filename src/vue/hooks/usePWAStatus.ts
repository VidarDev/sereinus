"use client";

import { useEffect, useState } from "react";

import { usePWAInstall } from "@/vue/hooks/usePWAInstall";
import { usePWAUpdate } from "@/vue/hooks/usePWAUpdate";
import type { PWAStatus } from "@/vue/types/pwa";

export function usePWAStatus() {
	const [isOnline, setIsOnline] = useState(true);

	const { installationState, canInstall, isInstalled } = usePWAInstall();

	const { hasUpdate, isRegistered, version } = usePWAUpdate();

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		setIsOnline(navigator.onLine);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	// Construire le statut PWA global
	const pwaStatus: PWAStatus = {
		isOnline,
		isInstalled,
		canInstall,
		hasUpdate,
		isRegistered,
		platform: installationState.platform
	};

	return {
		// Global state
		pwaStatus,

		// Individual states
		isOnline,
		isInstalled,
		canInstall,
		hasUpdate,
		isRegistered,
		version,
		platform: installationState.platform,

		// Derived states
		isPWACapable: canInstall || isInstalled,
		isFullyFunctional: isRegistered && (isInstalled || canInstall),
		needsAttention: hasUpdate || (!isRegistered && canInstall)
	};
}
