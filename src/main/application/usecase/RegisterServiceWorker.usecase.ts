export interface ServiceWorkerRegistrationResult {
	isSupported: boolean;
	isRegistered: boolean;
	error?: string;
}

export interface ServiceWorkerUpdateInfo {
	hasUpdate: boolean;
	canUpdate: boolean;
}

export class RegisterServiceWorker {
	public execute = async (): Promise<ServiceWorkerRegistrationResult> => {
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
	};

	public checkForUpdates = async (): Promise<ServiceWorkerUpdateInfo> => {
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
	};

	public activateUpdate = async (): Promise<boolean> => {
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
	};

	private isServiceWorkerSupported(): boolean {
		return typeof window !== "undefined" && "serviceWorker" in navigator;
	}
}
