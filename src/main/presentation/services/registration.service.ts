"use client";

import type { ServiceWorkerRegistrationResult, ServiceWorkerUpdateInfo } from "@/vue/types/pwa";

export class ServiceWorkerRegistrationService {
	public async register(): Promise<ServiceWorkerRegistrationResult> {
		if (!this.isServiceWorkerSupported()) {
			return {
				isSupported: false,
				isRegistered: false,
				error: "Service Workers are not supported in this browser"
			};
		}

		try {
			await navigator.serviceWorker.register("/sw.js", {
				scope: "/"
			});

			return {
				isSupported: true,
				isRegistered: true
			};
		} catch (error) {
			return {
				isSupported: true,
				isRegistered: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}

	public async checkForUpdates(): Promise<ServiceWorkerUpdateInfo> {
		if (!this.isServiceWorkerSupported()) {
			return { hasUpdate: false, canUpdate: false };
		}

		try {
			const registration = await navigator.serviceWorker.getRegistration();

			if (!registration) {
				return { hasUpdate: false, canUpdate: false };
			}

			const hasUpdate = !!(registration.waiting || registration.installing);

			return {
				hasUpdate,
				canUpdate: !!registration.waiting
			};
		} catch {
			return { hasUpdate: false, canUpdate: false };
		}
	}

	public async activateUpdate(): Promise<boolean> {
		if (!this.isServiceWorkerSupported()) {
			return false;
		}

		try {
			const registration = await navigator.serviceWorker.getRegistration();

			if (registration?.waiting) {
				const messageChannel = new MessageChannel();

				const responsePromise = new Promise<boolean>((resolve) => {
					messageChannel.port1.onmessage = (event) => {
						resolve(event.data.success === true);
					};

					setTimeout(() => {
						resolve(false);
					}, 5000);
				});

				registration.waiting.postMessage({ type: "SKIP_WAITING" }, [messageChannel.port2]);

				return await responsePromise;
			}

			return false;
		} catch {
			return false;
		}
	}

	public async getVersion(): Promise<string | null> {
		if (!this.isServiceWorkerSupported()) {
			return null;
		}

		try {
			const registration = await navigator.serviceWorker.getRegistration();

			if (registration?.active) {
				const messageChannel = new MessageChannel();

				const versionPromise = new Promise<string | null>((resolve) => {
					messageChannel.port1.onmessage = (event) => {
						resolve(event.data.version || null);
					};

					setTimeout(() => {
						resolve(null);
					}, 2000);
				});

				registration.active.postMessage({ type: "GET_VERSION" }, [messageChannel.port2]);

				return await versionPromise;
			}

			return null;
		} catch {
			return null;
		}
	}

	public setupUpdateListeners(onUpdateFound: () => void, onActivated: (version: string) => void): () => void {
		if (!this.isServiceWorkerSupported()) {
			return () => {
				// No-op - service worker not supported
			};
		}

		const handleControllerChange = () => {
			// Reload page when a new service worker takes control
			window.location.reload();
		};

		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === "SW_ACTIVATED") {
				onActivated(event.data.version);
			}
		};

		// Listen for controller changes
		navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

		// Listen for messages from the service worker
		navigator.serviceWorker.addEventListener("message", handleMessage);

		// Listen for updates on the current registration
		navigator.serviceWorker.getRegistration().then((registration) => {
			if (registration) {
				registration.addEventListener("updatefound", () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (newWorker.state === "installed") {
								if (navigator.serviceWorker.controller) {
									// Nouveau contenu disponible
									onUpdateFound();
								}
							}
						});
					}
				});
			}
		});

		// Fonction de nettoyage
		return () => {
			navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
			navigator.serviceWorker.removeEventListener("message", handleMessage);
		};
	}

	private isServiceWorkerSupported(): boolean {
		return typeof window !== "undefined" && "serviceWorker" in navigator;
	}
}
