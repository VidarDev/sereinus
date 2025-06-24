"use client";

import type { ServiceWorkerRegistrationResult, ServiceWorkerUpdateInfo } from "@/vue/types/pwa";

export class ServiceWorkerRegistrationService {
	private static instance: ServiceWorkerRegistrationService | null = null;
	private registration: ServiceWorkerRegistration | null = null;
	private updateListeners = new Set<() => void>();
	private activationListeners = new Set<(version: string) => void>();

	// Singleton pattern
	public static getInstance(): ServiceWorkerRegistrationService {
		if (!ServiceWorkerRegistrationService.instance) {
			ServiceWorkerRegistrationService.instance = new ServiceWorkerRegistrationService();
		}
		return ServiceWorkerRegistrationService.instance;
	}

	private constructor() {
		// Private constructor pour forcer le singleton
	}

	public async register(): Promise<ServiceWorkerRegistrationResult> {
		if (!("serviceWorker" in navigator)) {
			return {
				isSupported: false,
				isRegistered: false,
				error: "Service Workers not supported"
			};
		}

		try {
			this.registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

			this.setupRegistrationListeners();

			return {
				isSupported: true,
				isRegistered: true
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			console.error("Service Worker registration failed:", errorMessage);

			return {
				isSupported: true,
				isRegistered: false,
				error: errorMessage
			};
		}
	}

	public async checkForUpdates(): Promise<ServiceWorkerUpdateInfo> {
		if (!this.registration) {
			return {
				hasUpdate: false,
				canUpdate: false
			};
		}

		try {
			await this.registration.update();

			const hasWaiting = !!this.registration.waiting;
			const hasInstalling = !!this.registration.installing;

			return {
				hasUpdate: hasWaiting || hasInstalling,
				canUpdate: hasWaiting
			};
		} catch (error) {
			console.error("Failed to check for updates:", error);
			return {
				hasUpdate: false,
				canUpdate: false
			};
		}
	}

	public async activateUpdate(): Promise<boolean> {
		if (!this.registration?.waiting) {
			return false;
		}

		try {
			const messageChannel = new MessageChannel();

			const responsePromise = new Promise<boolean>((resolve) => {
				messageChannel.port1.onmessage = (event) => {
					resolve(event.data.success === true);
				};

				setTimeout(() => resolve(false), 5000);
			});

			this.registration.waiting.postMessage({ type: "SKIP_WAITING" }, [messageChannel.port2]);

			const success = await responsePromise;
			if (success) {
				// The reload will be done automatically via the event listener
				return true;
			}

			return false;
		} catch (error) {
			console.error("Failed to activate update:", error);
			return false;
		}
	}

	public async getVersion(): Promise<string | null> {
		if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
			return null;
		}

		try {
			const messageChannel = new MessageChannel();

			const versionPromise = new Promise<string | null>((resolve) => {
				messageChannel.port1.onmessage = (event) => {
					resolve(event.data.version || null);
				};

				setTimeout(() => resolve(null), 2000);
			});

			navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" }, [messageChannel.port2]);

			return await versionPromise;
		} catch (error) {
			console.error("Failed to get Service Worker version:", error);
			return null;
		}
	}

	public setupUpdateListeners(onUpdate: () => void, onActivation: (version: string) => void): () => void {
		this.updateListeners.add(onUpdate);
		this.activationListeners.add(onActivation);

		const handleControllerChange = async () => {
			const version = await this.getVersion();
			if (version) {
				this.activationListeners.forEach((listener) => listener(version));
			}
			// Reload page to use the new version
			window.location.reload();
		};

		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
		}

		// Cleanup function
		return () => {
			this.updateListeners.delete(onUpdate);
			this.activationListeners.delete(onActivation);

			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
			}
		};
	}

	public getRegistration(): ServiceWorkerRegistration | null {
		return this.registration;
	}

	private setupRegistrationListeners(): void {
		if (!this.registration) return;

		this.registration.addEventListener("updatefound", () => {
			const newWorker = this.registration?.installing;
			if (!newWorker) return;

			newWorker.addEventListener("statechange", () => {
				if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
					// New version available
					this.updateListeners.forEach((listener) => listener());
				}
			});
		});
	}
}
