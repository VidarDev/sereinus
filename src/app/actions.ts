"use server";

import { getInjection } from "@/di/container";

export async function registerServiceWorker() {
	const pwaController = getInjection("PWAController");
	return await pwaController.registerServiceWorker();
}

export async function checkServiceWorkerUpdates() {
	const pwaController = getInjection("PWAController");
	return await pwaController.checkServiceWorkerUpdates();
}

export async function activateServiceWorkerUpdate() {
	const pwaController = getInjection("PWAController");
	return await pwaController.activateServiceWorkerUpdate();
}

export async function getInstallationState() {
	const pwaController = getInjection("PWAController");
	return pwaController.getInstallationState();
}

export async function installApp() {
	const pwaController = getInjection("PWAController");
	return await pwaController.installApp();
}

export async function getInstallInstructions(platform: string) {
	const pwaController = getInjection("PWAController");
	return pwaController.getInstallInstructions(platform);
}
