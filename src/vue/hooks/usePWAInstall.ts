"use client";

import { useCallback, useEffect, useState } from "react";

import { PWAInstallationService } from "@/main/presentation/services/installation.service";
import type { BeforeInstallPromptEvent, PWAInstallationResult, PWAInstallationState } from "@/vue/types/pwa";

const installationService = new PWAInstallationService();

export function usePWAInstall() {
	const [installationState, setInstallationState] = useState<PWAInstallationState>({
		canInstall: false,
		isInstalled: false,
		platform: "other",
		installMethod: "none"
	});

	const [isInstalling, setIsInstalling] = useState(false);

	const updateInstallationState = useCallback(() => {
		const state = installationService.getInstallationState();
		setInstallationState(state);
	}, []);

	useEffect(() => {
		const handleBeforeInstallPrompt = (event: Event) => {
			event.preventDefault();
			installationService.setDeferredPrompt(event as BeforeInstallPromptEvent);
			updateInstallationState();
		};

		const handleAppInstalled = () => {
			installationService.clearDeferredPrompt();
			updateInstallationState();
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		updateInstallationState();

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, [updateInstallationState]);

	const installApp = useCallback(async (): Promise<PWAInstallationResult> => {
		if (isInstalling) {
			return { success: false, error: "Installation already in progress" };
		}

		setIsInstalling(true);

		try {
			const result = await installationService.installApp();

			if (result.success) {
				updateInstallationState();
			}

			return result;
		} finally {
			setIsInstalling(false);
		}
	}, [isInstalling, updateInstallationState]);

	const getInstallInstructions = useCallback(() => {
		return installationService.getInstallInstructions(installationState.platform);
	}, [installationState.platform]);

	return {
		// State
		installationState,
		isInstalling,

		// Actions
		installApp,
		getInstallInstructions,

		// Helpers
		canInstall: installationState.canInstall,
		isInstalled: installationState.isInstalled,
		platform: installationState.platform,
		installMethod: installationState.installMethod
	};
}
