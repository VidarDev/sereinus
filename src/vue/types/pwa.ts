export type Platform = "chrome" | "firefox" | "safari" | "edge" | "other";

export interface PWAInstallationState {
	canInstall: boolean;
	isInstalled: boolean;
	platform: Platform;
	installMethod: "beforeinstallprompt" | "manual" | "ios-safari" | "none";
}

export interface PWAInstallationResult {
	success: boolean;
	error?: string;
	outcome?: "accepted" | "dismissed";
}

export interface ServiceWorkerRegistrationResult {
	isSupported: boolean;
	isRegistered: boolean;
	error?: string;
}

export interface ServiceWorkerUpdateInfo {
	hasUpdate: boolean;
	canUpdate: boolean;
}

export interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface NavigatorWithStandalone extends Navigator {
	standalone?: boolean;
}

export interface PWAStatus {
	isOnline: boolean;
	isInstalled: boolean;
	canInstall: boolean;
	hasUpdate: boolean;
	isRegistered: boolean;
	platform: Platform;
}

export interface ServiceWorkerMessage {
	type: string;
	version?: string;
	success?: boolean;
}
