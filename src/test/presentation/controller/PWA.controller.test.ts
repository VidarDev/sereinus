import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { ManagePWAInstallation } from "@/main/application/usecase/ManagePWAInstallation.usecase";
import { RegisterServiceWorker } from "@/main/application/usecase/RegisterServiceWorker.usecase";
import { PWAController } from "@/main/presentation/controller/PWA.controller";

describe("PWA Controller", () => {
	let pwaController: PWAController;
	let mockRegisterServiceWorker: jest.Mocked<RegisterServiceWorker>;
	let mockManagePWAInstallation: jest.Mocked<ManagePWAInstallation>;

	beforeEach(() => {
		// Mock RegisterServiceWorker
		mockRegisterServiceWorker = {
			execute: jest.fn(),
			checkForUpdates: jest.fn(),
			activateUpdate: jest.fn()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any;

		// Mock ManagePWAInstallation
		mockManagePWAInstallation = {
			getInstallationState: jest.fn(),
			setDeferredPrompt: jest.fn(),
			clearDeferredPrompt: jest.fn(),
			installApp: jest.fn(),
			getInstallInstructions: jest.fn()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any;

		pwaController = new PWAController(mockRegisterServiceWorker, mockManagePWAInstallation);
	});

	describe("Service Worker methods", () => {
		test("should register service worker", async () => {
			// Given
			const expectedResult = {
				isSupported: true,
				isRegistered: true
			};
			mockRegisterServiceWorker.execute.mockResolvedValue(expectedResult);

			// When
			const result = await pwaController.registerServiceWorker();

			// Then
			expect(result).toEqual(expectedResult);
			expect(mockRegisterServiceWorker.execute).toHaveBeenCalled();
		});

		test("should check for service worker updates", async () => {
			// Given
			const expectedResult = {
				hasUpdate: true,
				canUpdate: true
			};
			mockRegisterServiceWorker.checkForUpdates.mockResolvedValue(expectedResult);

			// When
			const result = await pwaController.checkServiceWorkerUpdates();

			// Then
			expect(result).toEqual(expectedResult);
			expect(mockRegisterServiceWorker.checkForUpdates).toHaveBeenCalled();
		});

		test("should activate service worker update", async () => {
			// Given
			mockRegisterServiceWorker.activateUpdate.mockResolvedValue(true);

			// When
			const result = await pwaController.activateServiceWorkerUpdate();

			// Then
			expect(result).toBe(true);
			expect(mockRegisterServiceWorker.activateUpdate).toHaveBeenCalled();
		});
	});

	describe("PWA Installation methods", () => {
		test("should get installation state", () => {
			// Given
			const expectedState = {
				canInstall: true,
				isInstalled: false,
				platform: "chrome" as const,
				installMethod: "beforeinstallprompt" as const
			};
			mockManagePWAInstallation.getInstallationState.mockReturnValue(expectedState);

			// When
			const result = pwaController.getInstallationState();

			// Then
			expect(result).toEqual(expectedState);
			expect(mockManagePWAInstallation.getInstallationState).toHaveBeenCalled();
		});

		test("should set deferred prompt when event is valid BeforeInstallPromptEvent", () => {
			// Given
			const mockEvent = {
				prompt: jest.fn(),
				userChoice: Promise.resolve({ outcome: "accepted" as const })
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any;

			// When
			pwaController.setDeferredPrompt(mockEvent);

			// Then
			expect(mockManagePWAInstallation.setDeferredPrompt).toHaveBeenCalledWith(mockEvent);
		});

		test("should not set deferred prompt when event is not BeforeInstallPromptEvent", () => {
			// Given
			const mockEvent = new Event("click");

			// When
			pwaController.setDeferredPrompt(mockEvent);

			// Then
			expect(mockManagePWAInstallation.setDeferredPrompt).not.toHaveBeenCalled();
		});

		test("should clear deferred prompt", () => {
			// When
			pwaController.clearDeferredPrompt();

			// Then
			expect(mockManagePWAInstallation.clearDeferredPrompt).toHaveBeenCalled();
		});

		test("should install app", async () => {
			// Given
			const expectedResult = {
				success: true,
				outcome: "accepted" as const
			};
			mockManagePWAInstallation.installApp.mockResolvedValue(expectedResult);

			// When
			const result = await pwaController.installApp();

			// Then
			expect(result).toEqual(expectedResult);
			expect(mockManagePWAInstallation.installApp).toHaveBeenCalled();
		});

		test("should get install instructions", () => {
			// Given
			const platform = "chrome";
			const expectedInstructions =
				"Cliquez sur l'icône d'installation dans la barre d'adresse ou utilisez le bouton 'Installer' ci-dessous.";
			mockManagePWAInstallation.getInstallInstructions.mockReturnValue(expectedInstructions);

			// When
			const result = pwaController.getInstallInstructions(platform);

			// Then
			expect(result).toBe(expectedInstructions);
			expect(mockManagePWAInstallation.getInstallInstructions).toHaveBeenCalledWith(platform);
		});
	});

	describe("Private methods", () => {
		test("should identify BeforeInstallPromptEvent correctly", () => {
			// Given
			const validEvent = {
				prompt: jest.fn(),
				userChoice: Promise.resolve({ outcome: "accepted" as const })
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any;

			const invalidEvent = new Event("click");

			// When & Then - Test avec un événement valide
			pwaController.setDeferredPrompt(validEvent);
			expect(mockManagePWAInstallation.setDeferredPrompt).toHaveBeenCalledWith(validEvent);

			// Reset mock
			mockManagePWAInstallation.setDeferredPrompt.mockClear();

			// When & Then - Test avec un événement invalide
			pwaController.setDeferredPrompt(invalidEvent);
			expect(mockManagePWAInstallation.setDeferredPrompt).not.toHaveBeenCalled();
		});
	});
});
