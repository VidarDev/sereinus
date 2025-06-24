"use client";

import type {
	BeforeInstallPromptEvent,
	NavigatorWithStandalone,
	Platform,
	PWAInstallationResult,
	PWAInstallationState
} from "@/vue/types/pwa";

export class PWAInstallationService {
	private static instance: PWAInstallationService | null = null;
	private deferredPrompt: BeforeInstallPromptEvent | null = null;
	private readonly storageKey = "pwa-installation-state";
	private readonly storageVersion = "1.1";
	private isInitialized = false;
	private initializationPromise: Promise<void> | null = null;

	public static getInstance(): PWAInstallationService {
		if (!PWAInstallationService.instance) {
			PWAInstallationService.instance = new PWAInstallationService();
		}
		return PWAInstallationService.instance;
	}

	private constructor() {
		this.ensureInitialization();
	}

	private async ensureInitialization(): Promise<void> {
		if (this.isInitialized) return;

		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		this.initializationPromise = this.initialize();
		return this.initializationPromise;
	}

	private async initialize(): Promise<void> {
		if (typeof window === "undefined") return;

		// Setup early event listener to catch beforeinstallprompt if it fires during initialization
		this.setupEarlyEventListener();

		// Delayed detection for missed events
		this.setupDeferredDetection();

		this.isInitialized = true;
	}

	private setupEarlyEventListener(): void {
		const handleBeforeInstallPrompt = (event: Event) => {
			event.preventDefault();
			const promptEvent = event as BeforeInstallPromptEvent;
			this.setDeferredPrompt(promptEvent);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt, { once: true });
	}

	private setupDeferredDetection(): void {
		const maxRetries = 3;
		let retryCount = 0;

		const checkDeferredState = () => {
			if (this.deferredPrompt || retryCount >= maxRetries) return;

			retryCount++;
			const delay = 1000 * retryCount;

			setTimeout(() => {
				// Re-check if a deferred prompt is available
				const persistedState = this.loadPersistedState();
				if (persistedState?.installMethod === "beforeinstallprompt" && !this.deferredPrompt) {
					checkDeferredState();
				}
			}, delay);
		};

		// Start deferred checking after a short delay
		setTimeout(checkDeferredState, 500);
	}

	public async getInstallationState(): Promise<PWAInstallationState> {
		await this.ensureInitialization();

		const platform = this.detectPlatform();
		const isInstalled = this.isAppInstalled();

		// If already installed, return immediately
		if (isInstalled) {
			const installedState = {
				canInstall: false,
				isInstalled: true,
				platform,
				installMethod: "none" as const
			};
			this.savePersistedState(installedState);
			return installedState;
		}

		const persistedState = this.loadPersistedState();
		if (persistedState && this.isPersistedStateValid(persistedState, platform)) {
			// Refresh the installation capability
			const canInstall = this.canInstallApp() || this.shouldAllowInstallFromPersisted(persistedState);

			const currentState = {
				...persistedState,
				isInstalled: false,
				canInstall,
				platform,
				installMethod: this.getInstallMethod(platform, false, canInstall)
			};

			this.savePersistedState(currentState);
			return currentState;
		}

		const canInstall = this.canInstallApp();
		const currentState = {
			canInstall,
			isInstalled: false,
			platform,
			installMethod: this.getInstallMethod(platform, false, canInstall)
		};

		this.savePersistedState(currentState);
		return currentState;
	}

	public setDeferredPrompt(event: BeforeInstallPromptEvent): void {
		this.deferredPrompt = event;
		this.updateStateWithDeferredPrompt();
	}

	public clearDeferredPrompt(): void {
		this.deferredPrompt = null;
		this.updateStateAfterPromptUsed();
	}

	public async installApp(): Promise<PWAInstallationResult> {
		await this.ensureInitialization();

		const platform = this.detectPlatform();

		// Safari requires manual installation
		if (platform === "safari") {
			return this.handleSafariInstallation();
		}

		if (!this.deferredPrompt) {
			return {
				success: false,
				error: "Aucune invitation d'installation disponible. Veuillez actualiser la page."
			};
		}

		try {
			await this.deferredPrompt.prompt();
			const { outcome } = await this.deferredPrompt.userChoice;

			this.clearDeferredPrompt();

			if (outcome === "accepted") {
				this.updateStateAfterSuccessfulInstall();
			}

			return {
				success: outcome === "accepted",
				outcome
			};
		} catch (error) {
			console.error("[PWA] Installation failed:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Erreur d'installation inconnue"
			};
		}
	}

	private handleSafariInstallation(): PWAInstallationResult {
		const instructions = this.getInstallInstructions("safari");

		return {
			success: true,
			error: `Installation manuelle requise: ${instructions}`
		};
	}

	private async updateStateWithDeferredPrompt(): Promise<void> {
		const currentState = await this.getInstallationState();
		currentState.canInstall = true;
		currentState.installMethod = "beforeinstallprompt";
		this.savePersistedState(currentState);
	}

	private async updateStateAfterPromptUsed(): Promise<void> {
		const currentState = await this.getInstallationState();
		// Don't immediately mark as can't install, the event might fire again
		currentState.installMethod = this.getInstallMethod(currentState.platform, false, false);
		this.savePersistedState(currentState);
	}

	private updateStateAfterSuccessfulInstall(): void {
		const platform = this.detectPlatform();
		const installedState = {
			canInstall: false,
			isInstalled: true,
			platform,
			installMethod: "none" as const
		};
		this.savePersistedState(installedState);
	}

	public getInstallInstructions(platform: Platform): string {
		switch (platform) {
			case "chrome":
			case "edge":
				return "Cliquez sur l'icône d'installation dans la barre d'adresse ou utilisez le bouton 'Installer' ci-dessous.";

			case "firefox":
				return "Allez dans le menu → Installer cette application.";

			case "safari":
				return "Appuyez sur le bouton Partager (⤴) et sélectionnez 'Ajouter à l'écran d'accueil'.";

			default:
				return "Utilisez les options de votre navigateur pour installer cette application.";
		}
	}

	public hasDeferredPrompt(): boolean {
		return this.deferredPrompt !== null;
	}

	private isPersistedStateValid(persistedState: PWAInstallationState, currentPlatform: Platform): boolean {
		if (persistedState.platform !== currentPlatform) {
			return false;
		}

		if (this.isAppInstalled()) {
			return false;
		}

		return true;
	}

	private shouldAllowInstallFromPersisted(persistedState: PWAInstallationState): boolean {
		return (
			persistedState.canInstall &&
			(persistedState.installMethod === "beforeinstallprompt" || persistedState.installMethod === "ios-safari") &&
			!this.isAppInstalled() &&
			this.isRecentState(persistedState)
		);
	}

	private isRecentState(state: PWAInstallationState & { timestamp?: number }): boolean {
		if (!state.timestamp) return false;

		const maxAge = 2 * 60 * 60 * 1000; // 2 hours
		return Date.now() - state.timestamp < maxAge;
	}

	private canInstallApp(): boolean {
		if (typeof window === "undefined") {
			return false;
		}

		if (this.isAppInstalled()) {
			return false;
		}

		if (this.deferredPrompt) {
			return true;
		}

		const platform = this.detectPlatform();

		// Safari on iOS can always "install" (add to home screen)
		if (platform === "safari") {
			return this.isSafariIOSCapable();
		}

		return false;
	}

	private isSafariIOSCapable(): boolean {
		if (typeof window === "undefined") return false;

		const userAgent = window.navigator.userAgent.toLowerCase();
		const isIOS = /iphone|ipad|ipod/.test(userAgent);
		const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

		return isIOS && isSafari;
	}

	private detectPlatform(): Platform {
		if (typeof window === "undefined") {
			return "other";
		}

		const userAgent = window.navigator.userAgent.toLowerCase();

		if (userAgent.includes("edg/")) {
			return "edge";
		} else if (userAgent.includes("chrome") && !userAgent.includes("edg/")) {
			return "chrome";
		} else if (userAgent.includes("firefox")) {
			return "firefox";
		} else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
			return "safari";
		}

		return "other";
	}

	private isAppInstalled(): boolean {
		if (typeof window === "undefined") {
			return false;
		}

		// Standalone mode (PWA installed)
		if (window.matchMedia("(display-mode: standalone)").matches) {
			return true;
		}

		// iOS Safari
		if ("standalone" in window.navigator) {
			return (window.navigator as NavigatorWithStandalone).standalone === true;
		}

		// Android Chrome minimal-ui
		if (window.matchMedia("(display-mode: minimal-ui)").matches) {
			return true;
		}

		// Fullscreen mode
		if (window.matchMedia("(display-mode: fullscreen)").matches) {
			return true;
		}

		return false;
	}

	private getInstallMethod(
		platform: Platform,
		isInstalled: boolean,
		canInstall?: boolean
	): "beforeinstallprompt" | "manual" | "ios-safari" | "none" {
		if (isInstalled) return "none";
		if (this.deferredPrompt) return "beforeinstallprompt";
		if (platform === "safari" && this.isSafariIOSCapable()) return "ios-safari";
		if ((platform === "chrome" || platform === "edge") && canInstall) return "manual";
		return "manual";
	}

	private savePersistedState(state: PWAInstallationState): void {
		if (typeof window === "undefined") return;

		try {
			const stateWithMetadata = {
				...state,
				timestamp: Date.now(),
				version: this.storageVersion
			};
			localStorage.setItem(this.storageKey, JSON.stringify(stateWithMetadata));
		} catch (error) {
			console.warn("[PWA] Failed to save state:", error);
		}
	}

	private loadPersistedState(): PWAInstallationState | null {
		if (typeof window === "undefined") return null;

		try {
			const saved = localStorage.getItem(this.storageKey);
			if (!saved) return null;

			const parsed = JSON.parse(saved);

			if (parsed.version !== this.storageVersion) {
				localStorage.removeItem(this.storageKey);
				return null;
			}

			const maxAge = 6 * 60 * 60 * 1000;
			if (parsed.timestamp && Date.now() - parsed.timestamp > maxAge) {
				localStorage.removeItem(this.storageKey);
				return null;
			}
			const { ...cleanState } = parsed;
			return cleanState;
		} catch (error) {
			console.warn("[PWA] Failed to load state:", error);
			try {
				localStorage.removeItem(this.storageKey);
			} catch (clearError) {
				console.warn("[PWA] Failed to clear corrupted state:", clearError);
			}
			return null;
		}
	}
}
