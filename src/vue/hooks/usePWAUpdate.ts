"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ServiceWorkerRegistrationService } from "@/main/presentation/services/registration-pwa.service";
import type { ServiceWorkerUpdateInfo } from "@/vue/features/pwa/types/pwa";

const registrationService = ServiceWorkerRegistrationService.getInstance();

export function usePWAUpdate() {
	const [updateInfo, setUpdateInfo] = useState<ServiceWorkerUpdateInfo>({
		hasUpdate: false,
		canUpdate: false
	});

	const [isUpdating, setIsUpdating] = useState(false);
	const [version, setVersion] = useState<string | null>(null);
	const [isRegistered, setIsRegistered] = useState(false);
	const [registrationError, setRegistrationError] = useState<string | null>(null);
	const [isRegistering, setIsRegistering] = useState(false);

	const checkForUpdates = useCallback(async () => {
		if (!isRegistered) {
			return { hasUpdate: false, canUpdate: false };
		}

		try {
			const info = await registrationService.checkForUpdates();
			setUpdateInfo(info);
			return info;
		} catch (error) {
			console.error("[PWA Update] Failed to check for updates:", error);
			return { hasUpdate: false, canUpdate: false };
		}
	}, [isRegistered]);

	const activateUpdate = useCallback(async (): Promise<boolean> => {
		if (isUpdating) {
			return false;
		}

		if (!updateInfo.canUpdate) {
			return false;
		}

		setIsUpdating(true);

		try {
			const success = await registrationService.activateUpdate();

			if (success) {
				// The page will reload automatically
				return true;
			} else {
				console.warn("[PWA Update] Update activation failed");
				return false;
			}
		} catch (error) {
			console.error("[PWA Update] Update activation error:", error);
			return false;
		} finally {
			setIsUpdating(false);
		}
	}, [isUpdating, updateInfo.canUpdate]);

	const getServiceWorkerVersion = useCallback(async () => {
		try {
			const swVersion = await registrationService.getVersion();
			setVersion(swVersion);
			return swVersion;
		} catch (error) {
			console.error("[PWA Update] Failed to get version:", error);
			return null;
		}
	}, []);

	const register = useCallback(async () => {
		if (isRegistering) {
			return { isSupported: true, isRegistered: false };
		}

		setIsRegistering(true);
		setRegistrationError(null);

		try {
			const result = await registrationService.register();

			if (result.isRegistered) {
				setIsRegistered(true);

				await getServiceWorkerVersion();
				await checkForUpdates();
			} else {
				setRegistrationError(result.error || "Registration failed");
				console.error("[PWA Update] Service worker registration failed:", result.error);
			}

			return result;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown registration error";
			setRegistrationError(errorMessage);
			console.error("[PWA Update] Service worker registration error:", error);

			return {
				isSupported: true,
				isRegistered: false,
				error: errorMessage
			};
		} finally {
			setIsRegistering(false);
		}
	}, [isRegistering, checkForUpdates, getServiceWorkerVersion]);

	const retryRegistration = useCallback(async () => {
		setIsRegistered(false);
		setRegistrationError(null);
		return register();
	}, [register]);

	// Main initialization effect
	useEffect(() => {
		let cleanup: (() => void) | null = null;
		let isComponentMounted = true;

		const setupListeners = () => {
			cleanup = registrationService.setupUpdateListeners(
				// When an update is found
				() => {
					if (isComponentMounted) {
						checkForUpdates();
					}
				},
				// When the Service Worker is activated
				(newVersion: string) => {
					if (isComponentMounted) {
						setVersion(newVersion);
					}
				}
			);
		};

		const initializeServiceWorker = async () => {
			try {
				const result = await register();

				if (result.isRegistered && isComponentMounted) {
					setupListeners();
				} else if (!result.isSupported && isComponentMounted) {
					console.error("[PWA Update] Service Workers not supported");
				}
			} catch (error) {
				console.error("[PWA Update] Failed to initialize service worker:", error);
			}
		};

		initializeServiceWorker();

		return () => {
			isComponentMounted = false;
			if (cleanup) {
				cleanup();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Periodic update check effect
	useEffect(() => {
		if (!isRegistered) return;

		const interval = setInterval(() => {
			checkForUpdates();
		}, 30000);

		return () => {
			clearInterval(interval);
		};
	}, [isRegistered, checkForUpdates]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && isRegistered) {
				checkForUpdates();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [isRegistered, checkForUpdates]);

	// Memoized values
	const memoizedValues = useMemo(
		() => ({
			hasUpdate: updateInfo.hasUpdate,
			canUpdate: updateInfo.canUpdate,
			needsReload: updateInfo.canUpdate && !isUpdating,
			hasRegistrationError: !!registrationError,
			canRetryRegistration: !isRegistered && !isRegistering,
			isFullyOperational: isRegistered && !registrationError,
			serviceWorkerState: isRegistered ? "registered" : isRegistering ? "registering" : "not-registered"
		}),
		[updateInfo, isUpdating, registrationError, isRegistered, isRegistering]
	);

	return {
		// State
		updateInfo,
		isUpdating,
		version,
		isRegistered,
		isRegistering,
		registrationError,

		// Actions
		checkForUpdates,
		activateUpdate,
		register,
		retryRegistration,
		getServiceWorkerVersion,

		// Memoized helpers
		...memoizedValues
	};
}
