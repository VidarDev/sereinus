"use client";

import { useCallback, useEffect, useState } from "react";

import { ServiceWorkerRegistrationService } from "@/main/presentation/services/registration.service";
import type { ServiceWorkerUpdateInfo } from "@/vue/types/pwa";

const registrationService = new ServiceWorkerRegistrationService();

export function usePWAUpdate() {
	const [updateInfo, setUpdateInfo] = useState<ServiceWorkerUpdateInfo>({
		hasUpdate: false,
		canUpdate: false
	});

	const [isUpdating, setIsUpdating] = useState(false);
	const [version, setVersion] = useState<string | null>(null);
	const [isRegistered, setIsRegistered] = useState(false);

	const checkForUpdates = useCallback(async () => {
		const info = await registrationService.checkForUpdates();
		setUpdateInfo(info);
		return info;
	}, []);

	const activateUpdate = useCallback(async (): Promise<boolean> => {
		if (isUpdating) {
			return false;
		}

		setIsUpdating(true);

		try {
			const success = await registrationService.activateUpdate();

			if (success) {
				// The page will reload automatically
				return true;
			}

			return false;
		} finally {
			setIsUpdating(false);
		}
	}, [isUpdating]);

	const getServiceWorkerVersion = useCallback(async () => {
		const swVersion = await registrationService.getVersion();
		setVersion(swVersion);
		return swVersion;
	}, []);

	const register = useCallback(async () => {
		const result = await registrationService.register();
		setIsRegistered(result.isRegistered);

		if (result.isRegistered) {
			await checkForUpdates();
			await getServiceWorkerVersion();
		}

		return result;
	}, [checkForUpdates, getServiceWorkerVersion]);

	useEffect(() => {
		let cleanup: (() => void) | null = null;

		const setupListeners = () => {
			cleanup = registrationService.setupUpdateListeners(
				// Quand une mise à jour est trouvée
				() => {
					checkForUpdates();
				},
				// Quand le Service Worker est activé
				(newVersion: string) => {
					setVersion(newVersion);
					console.log(`[PWA] Service Worker activated: v${newVersion}`);
				}
			);
		};

		// Enregistrer le Service Worker au montage
		register().then(() => {
			setupListeners();
		});

		return () => {
			if (cleanup) {
				cleanup();
			}
		};
	}, [register, checkForUpdates]);

	useEffect(() => {
		if (!isRegistered) return;

		const interval = setInterval(() => {
			checkForUpdates();
		}, 30000);

		return () => clearInterval(interval);
	}, [isRegistered, checkForUpdates]);

	return {
		// State
		updateInfo,
		isUpdating,
		version,
		isRegistered,

		// Actions
		checkForUpdates,
		activateUpdate,
		register,
		getServiceWorkerVersion,

		// Helpers
		hasUpdate: updateInfo.hasUpdate,
		canUpdate: updateInfo.canUpdate,
		needsReload: updateInfo.canUpdate && !isUpdating
	};
}
