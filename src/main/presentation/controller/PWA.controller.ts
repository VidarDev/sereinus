import {
	ManagePWAInstallation,
	type PWAInstallationResult,
	type PWAInstallationState
} from "@/main/application/usecase/ManagePWAInstallation.usecase";
import {
	RegisterServiceWorker,
	type ServiceWorkerRegistrationResult,
	type ServiceWorkerUpdateInfo
} from "@/main/application/usecase/RegisterServiceWorker.usecase";

export class PWAController {
	private readonly registerServiceWorkerUseCase: RegisterServiceWorker;
	private readonly managePWAInstallationUseCase: ManagePWAInstallation;

	constructor(registerServiceWorker: RegisterServiceWorker, managePWAInstallation: ManagePWAInstallation) {
		this.registerServiceWorkerUseCase = registerServiceWorker;
		this.managePWAInstallationUseCase = managePWAInstallation;
	}

	// Service Worker methods
	public async registerServiceWorker(): Promise<ServiceWorkerRegistrationResult> {
		return this.registerServiceWorkerUseCase.execute();
	}

	public async checkServiceWorkerUpdates(): Promise<ServiceWorkerUpdateInfo> {
		return this.registerServiceWorkerUseCase.checkForUpdates();
	}

	public async activateServiceWorkerUpdate(): Promise<boolean> {
		return this.registerServiceWorkerUseCase.activateUpdate();
	}

	// PWA Installation methods
	public getInstallationState(): PWAInstallationState {
		return this.managePWAInstallationUseCase.getInstallationState();
	}

	public setDeferredPrompt(event: Event): void {
		if (this.isBeforeInstallPromptEvent(event)) {
			this.managePWAInstallationUseCase.setDeferredPrompt(event);
		}
	}

	public clearDeferredPrompt(): void {
		this.managePWAInstallationUseCase.clearDeferredPrompt();
	}

	public async installApp(): Promise<PWAInstallationResult> {
		return this.managePWAInstallationUseCase.installApp();
	}

	public getInstallInstructions(platform: string): string {
		return this.managePWAInstallationUseCase.getInstallInstructions(platform);
	}

	private isBeforeInstallPromptEvent(event: Event): event is BeforeInstallPromptEvent {
		return "prompt" in event && "userChoice" in event;
	}
}

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
