"use client";

import { useEffect, useState } from "react";

import { registerServiceWorker } from "@/app/actions";

export function ServiceWorkerRegistration() {
	useEffect(() => {
		if (!("serviceWorker" in navigator)) {
			return;
		}

		const handleServiceWorkerRegistration = async () => {
			try {
				const result = await registerServiceWorker();

				if (result.isRegistered) {
					const registration = await navigator.serviceWorker.getRegistration();
					if (registration) {
						setupServiceWorkerListeners(registration);
					}
				}
			} catch {
				// Silent error handling
			}
		};

		if (document.readyState === "complete") {
			handleServiceWorkerRegistration();
		} else {
			window.addEventListener("load", handleServiceWorkerRegistration);
			return () => window.removeEventListener("load", handleServiceWorkerRegistration);
		}
	}, []);

	useEffect(() => {
		if (!("serviceWorker" in navigator)) return;

		const handleControllerChange = () => {
			window.location.reload();
		};

		navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

		return () => {
			navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
		};
	}, []);

	// No HTML rendering
	return null;
}

function setupServiceWorkerListeners(registration: ServiceWorkerRegistration) {
	registration.addEventListener("updatefound", () => {
		const newWorker = registration.installing;
		if (newWorker) {
			newWorker.addEventListener("statechange", () => {
				if (newWorker.state === "installed") {
					if (navigator.serviceWorker.controller) {
						// New content available
					} else {
						// Offline content cached
					}
				}
			});
		}
	});
}

// Custom hook to use the Service Worker state
export function useServiceWorker() {
	const [isOnline, setIsOnline] = useState(true);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		// Listen to the connection state
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Check if the Service Worker is installed
		if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
			setIsInstalled(true);
		}

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return { isOnline, isInstalled };
}
