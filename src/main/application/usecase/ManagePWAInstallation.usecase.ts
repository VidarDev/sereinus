export interface PWAInstallationState {
	canInstall: boolean;
	isInstalled: boolean;
	platform: "chrome" | "firefox" | "safari" | "edge" | "other";
	installMethod: "beforeinstallprompt" | "manual" | "ios-safari" | "none";
}

export interface PWAInstallationResult {
	success: boolean;
	error?: string;
	outcome?: "accepted" | "dismissed";
}

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
	standalone?: boolean;
}

export class ManagePWAInstallation {
	private deferredPrompt: BeforeInstallPromptEvent | null = null;

	public getInstallationState = (): PWAInstallationState => {
		const platform = this.detectPlatform();
		const isInstalled = this.isAppInstalled();

		return {
			canInstall: this.canInstallApp(),
			isInstalled,
			platform,
			installMethod: this.getInstallMethod(platform, isInstalled)
		};
	};

	public setDeferredPrompt = (event: BeforeInstallPromptEvent): void => {
		this.deferredPrompt = event;
	};

	public clearDeferredPrompt = (): void => {
		this.deferredPrompt = null;
	};

	public installApp = async (): Promise<PWAInstallationResult> => {
		if (!this.deferredPrompt) {
			return {
				success: false,
				error: "No installation prompt available"
			};
		}

		try {
			await this.deferredPrompt.prompt();
			const { outcome } = await this.deferredPrompt.userChoice;

			this.clearDeferredPrompt();

			return {
				success: outcome === "accepted",
				outcome
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	};

	public getInstallInstructions = (platform: string): string => {
		switch (platform) {
			case "chrome":
			case "edge":
				return "Cliquez sur l'icône d'installation dans la barre d'adresse ou utilisez le bouton 'Installer' ci-dessous.";

			case "firefox":
				return "Allez dans le menu → Installer cette application.";

			case "safari":
				return "Appuyez sur le bouton Partager et sélectionnez 'Ajouter à l'écran d'accueil'.";

			default:
				return "Utilisez les options de votre navigateur pour installer cette application.";
		}
	};

	private detectPlatform(): "chrome" | "firefox" | "safari" | "edge" | "other" {
		if (typeof window === "undefined") return "other";

		const userAgent = window.navigator.userAgent.toLowerCase();

		if (userAgent.includes("edg/")) return "edge";
		if (userAgent.includes("chrome") && !userAgent.includes("edg/")) return "chrome";
		if (userAgent.includes("firefox")) return "firefox";
		if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "safari";

		return "other";
	}

	private isAppInstalled(): boolean {
		if (typeof window === "undefined") return false;

		// Standalone (PWA installed)
		if (window.matchMedia("(display-mode: standalone)").matches) {
			return true;
		}

		// iOS Safari
		if ("navigator" in window && "standalone" in window.navigator) {
			return (window.navigator as NavigatorWithStandalone).standalone === true;
		}

		// Android Chrome
		if (window.matchMedia("(display-mode: minimal-ui)").matches) {
			return true;
		}

		return false;
	}

	private canInstallApp(): boolean {
		if (typeof window === "undefined") return false;
		if (this.isAppInstalled()) return false;
		if (this.deferredPrompt) return true;

		const platform = this.detectPlatform();
		return platform === "safari";
	}

	private getInstallMethod(
		platform: string,
		isInstalled: boolean
	): "beforeinstallprompt" | "manual" | "ios-safari" | "none" {
		if (isInstalled) return "none";
		if (this.deferredPrompt) return "beforeinstallprompt";
		if (platform === "safari") return "ios-safari";

		return "manual";
	}
}
