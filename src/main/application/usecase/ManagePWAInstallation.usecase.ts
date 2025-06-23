type Platform = "chrome" | "firefox" | "safari" | "edge" | "other";

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

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
	standalone?: boolean;
}

export class ManagePWAInstallation {
	private deferredPrompt: BeforeInstallPromptEvent | null = null;

	public getInstallationState(): PWAInstallationState {
		const platform = this.detectPlatform();
		const isInstalled = this.isAppInstalled();

		return {
			canInstall: this.canInstallApp(),
			isInstalled,
			platform,
			installMethod: this.getInstallMethod(platform, isInstalled)
		};
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

		return platform === "safari";
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

		// Standalone (PWA installed)
		if (window.matchMedia("(display-mode: standalone)").matches) {
			return true;
		}

		// iOS Safari
		if ("standalone" in window.navigator) {
			return (window.navigator as NavigatorWithStandalone).standalone as boolean;
		}

		// Android Chrome
		return window.matchMedia("(display-mode: minimal-ui)").matches;
	}

	public setDeferredPrompt(event: BeforeInstallPromptEvent): void {
		this.deferredPrompt = event;
	}

	public clearDeferredPrompt(): void {
		this.deferredPrompt = null;
	}

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
