"use server";

import { getInjection } from "@/di/container";

export const login = async (username: string, password: string) => {
	const authenticationController = getInjection("AuthenticationController");

	return await authenticationController.login(username, password);
};

export const registerServiceWorker = async () => {
	const pwaController = getInjection("PWAController");

	return await pwaController.registerServiceWorker();
};

export const checkServiceWorkerUpdates = async () => {
	const pwaController = getInjection("PWAController");

	return await pwaController.checkServiceWorkerUpdates();
};

export const activateServiceWorkerUpdate = async () => {
	const pwaController = getInjection("PWAController");

	return await pwaController.activateServiceWorkerUpdate();
};

export const getInstallationState = async () => {
	const pwaController = getInjection("PWAController");

	return pwaController.getInstallationState();
};

export const getInstallInstructions = async (platform: string) => {
	const pwaController = getInjection("PWAController");

	return pwaController.getInstallInstructions(platform);
};
