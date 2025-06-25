"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PWAStatus } from "@/vue/features/pwa/types/pwa";
import { usePWAInstall } from "@/vue/hooks/usePWAInstall";
import { usePWAUpdate } from "@/vue/hooks/usePWAUpdate";

export function usePWAStatus() {
	const [isOnline, setIsOnline] = useState(true);

	const { installationState, canInstall, isInstalled } = usePWAInstall();
	const { hasUpdate, isRegistered, version } = usePWAUpdate();

	const updateOnlineStatus = useCallback(() => {
		const online = navigator.onLine;
		setIsOnline(online);

		try {
			localStorage.setItem(
				"pwa-network-status",
				JSON.stringify({
					isOnline: online,
					lastCheck: Date.now()
				})
			);
		} catch (error) {
			console.warn("Failed to save network status:", error);
		}
	}, []);

	useEffect(() => {
		// Initial state
		updateOnlineStatus();

		const handleOnline = () => {
			setIsOnline(true);
			updateOnlineStatus();
		};

		const handleOffline = () => {
			setIsOnline(false);
			updateOnlineStatus();
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [updateOnlineStatus]);

	const pwaStatus: PWAStatus = useMemo(
		() => ({
			isOnline,
			isInstalled,
			canInstall,
			hasUpdate,
			isRegistered,
			platform: installationState.platform
		}),
		[isOnline, isInstalled, canInstall, hasUpdate, isRegistered, installationState.platform]
	);

	const derivedStates = useMemo(
		() => ({
			isPWACapable: canInstall || isInstalled,
			isFullyFunctional: isRegistered && (isInstalled || canInstall),
			needsAttention: hasUpdate || (!isRegistered && canInstall),
			isOfflineReady: isRegistered && isInstalled
		}),
		[canInstall, isInstalled, isRegistered, hasUpdate]
	);

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

		// Derived states (memoized)
		...derivedStates,

		// Actions
		updateOnlineStatus
	};
}
