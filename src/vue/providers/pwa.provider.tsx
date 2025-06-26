"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";

import type { Platform, PWAInstallationResult } from "@/vue/features/pwa/types/pwa";
import { usePWAInstall } from "@/vue/hooks/usePWAInstall";
import { usePWAStatus } from "@/vue/hooks/usePWAStatus";
import { usePWAUpdate } from "@/vue/hooks/usePWAUpdate";

export interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAState {
	// Installation state
	isOnline: boolean;
	isInstalled: boolean;
	canInstall: boolean;
	platform: Platform;
	isInstalling: boolean;
	isLoadingInstall: boolean;
	requiresManualInstall: boolean;
	canUsePrompt: boolean;

	// Update state
	hasUpdate: boolean;
	isRegistered: boolean;
	isUpdating: boolean;
	isRegistering: boolean;
	hasRegistrationError: boolean;
	canRetryRegistration: boolean;
	isFullyOperational: boolean;
	serviceWorkerState: "registered" | "registering" | "not-registered";
	version: string | null;
	registrationError: string | null;

	// Derived state
	isPWACapable: boolean;
	needsAttention: boolean;
	isOfflineReady: boolean;
	overallState: "loading" | "ready" | "error" | "installing" | "updating";
}

interface PWAContextValue extends PWAState {
	installApp: () => Promise<PWAInstallationResult>;
	activateUpdate: () => Promise<boolean>;
	retryRegistration: () => Promise<void>;
	refreshInstallState: () => Promise<void>;
	getInstallInstructions: () => string;
}

const PWAContext = createContext<PWAContextValue | null>(null);

interface PWAProviderProps {
	children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
	const installationHook = usePWAInstall();
	const statusHook = usePWAStatus();
	const updateHook = usePWAUpdate();

	// Memoized context value to prevent unnecessary re-renders
	const contextValue: PWAContextValue = useMemo(() => {
		// Derive overall state
		const getOverallState = (): PWAState["overallState"] => {
			if (installationHook.isLoading || updateHook.isRegistering) return "loading";
			if (installationHook.isInstalling) return "installing";
			if (updateHook.isUpdating) return "updating";
			if (updateHook.hasRegistrationError && !updateHook.isRegistered) return "error";
			return "ready";
		};

		// Check if PWA needs attention
		const needsAttention =
			updateHook.hasUpdate ||
			(!updateHook.isRegistered && installationHook.canInstall) ||
			updateHook.hasRegistrationError;

		return {
			// Installation state
			isOnline: statusHook.isOnline,
			isInstalled: installationHook.isInstalled,
			canInstall: installationHook.canInstall,
			platform: installationHook.platform,
			isInstalling: installationHook.isInstalling,
			isLoadingInstall: installationHook.isLoading,
			requiresManualInstall: installationHook.requiresManualInstall,
			canUsePrompt: installationHook.canUsePrompt,

			// Update state
			hasUpdate: updateHook.hasUpdate,
			isRegistered: updateHook.isRegistered,
			isUpdating: updateHook.isUpdating,
			isRegistering: updateHook.isRegistering,
			hasRegistrationError: updateHook.hasRegistrationError,
			canRetryRegistration: updateHook.canRetryRegistration,
			isFullyOperational: updateHook.isFullyOperational,
			serviceWorkerState: updateHook.serviceWorkerState as "registered" | "registering" | "not-registered",
			version: updateHook.version,
			registrationError: updateHook.registrationError,

			// Derived state
			isPWACapable: installationHook.isPWACapable,
			needsAttention,
			isOfflineReady: updateHook.isRegistered && installationHook.isInstalled,
			overallState: getOverallState(),

			// Actions
			installApp: async (): Promise<PWAInstallationResult> => {
				const result = await installationHook.installApp();

				// Provide user feedback for Safari manual installation
				if (installationHook.platform === "safari" && installationHook.requiresManualInstall) {
					console.log("[PWA Provider] Safari manual installation required");
				}

				return result;
			},

			activateUpdate: async (): Promise<boolean> => {
				return updateHook.activateUpdate();
			},

			retryRegistration: async (): Promise<void> => {
				await updateHook.retryRegistration();
			},

			refreshInstallState: async (): Promise<void> => {
				await installationHook.updateInstallationState();
			},

			getInstallInstructions: (): string => {
				return installationHook.getInstallInstructions();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// Installation hook dependencies
		installationHook.isInstalled,
		installationHook.canInstall,
		installationHook.platform,
		installationHook.isInstalling,
		installationHook.isLoading,
		installationHook.requiresManualInstall,
		installationHook.canUsePrompt,
		installationHook.isPWACapable,
		installationHook.installApp,
		installationHook.updateInstallationState,
		installationHook.getInstallInstructions,

		// Status hook dependencies
		statusHook.isOnline,

		// Update hook dependencies
		updateHook.hasUpdate,
		updateHook.isRegistered,
		updateHook.isUpdating,
		updateHook.isRegistering,
		updateHook.hasRegistrationError,
		updateHook.canRetryRegistration,
		updateHook.isFullyOperational,
		updateHook.serviceWorkerState,
		updateHook.version,
		updateHook.registrationError,
		updateHook.activateUpdate,
		updateHook.retryRegistration
	]);

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
