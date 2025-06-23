import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { ManagePWAInstallation } from "@/main/application/usecase/ManagePWAInstallation.usecase";

Object.defineProperty(global, "window", {
	value: {
		navigator: { userAgent: "" },
		matchMedia: jest.fn()
	},
	writable: true
});

describe("ManagePWAInstallation UseCase", () => {
	let managePWAInstallation: ManagePWAInstallation;

	beforeEach(() => {
		managePWAInstallation = new ManagePWAInstallation();
		jest.clearAllMocks();
	});

	describe("getInstallationState", () => {
		test("should return default state when no special conditions", () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.navigator as any).userAgent = "Chrome/91.0";
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.matchMedia as any).mockReturnValue({ matches: false });

			// When
			const state = managePWAInstallation.getInstallationState();

			// Then
			expect(state).toEqual({
				canInstall: false,
				isInstalled: false,
				platform: "chrome",
				installMethod: "manual"
			});
		});

		test("should detect installed app via standalone mode", () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.navigator as any).userAgent = "Chrome/91.0";
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.matchMedia as any).mockImplementation((query: string) => ({
				matches: query === "(display-mode: standalone)"
			}));

			// When
			const state = managePWAInstallation.getInstallationState();

			// Then
			expect(state.isInstalled).toBe(true);
			expect(state.canInstall).toBe(false);
			expect(state.installMethod).toBe("none");
		});

		test("should detect Firefox platform", () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.navigator as any).userAgent = "Firefox/89.0";
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.matchMedia as any).mockReturnValue({ matches: false });

			// When
			const state = managePWAInstallation.getInstallationState();

			// Then
			expect(state.platform).toBe("firefox");
		});

		test("should detect Safari platform", () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.navigator as any).userAgent = "Safari/605.1.15";
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.matchMedia as any).mockReturnValue({ matches: false });

			// When
			const state = managePWAInstallation.getInstallationState();

			// Then
			expect(state.platform).toBe("safari");
			expect(state.canInstall).toBe(true);
			expect(state.installMethod).toBe("ios-safari");
		});

		test("should detect Edge platform", () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.navigator as any).userAgent = "Edg/91.0";
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global.window.matchMedia as any).mockReturnValue({ matches: false });

			// When
			const state = managePWAInstallation.getInstallationState();

			// Then
			expect(state.platform).toBe("edge");
		});
	});

	describe("installApp", () => {
		test("should return error when no deferred prompt", async () => {
			// When
			const result = await managePWAInstallation.installApp();

			// Then
			expect(result).toEqual({
				success: false,
				error: "No installation prompt available"
			});
		});

		test("should install successfully when user accepts", async () => {
			// Given
			const mockEvent = {
				// @ts-expect-error typescript does not recognize the mock
				prompt: jest.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: "accepted" })
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			managePWAInstallation.setDeferredPrompt(mockEvent as any);

			// When
			const result = await managePWAInstallation.installApp();

			// Then
			expect(result).toEqual({
				success: true,
				outcome: "accepted"
			});
			expect(mockEvent.prompt).toHaveBeenCalled();
		});

		test("should handle installation error", async () => {
			// Given
			const mockEvent = {
				// @ts-expect-error typescript does not recognize the mock
				prompt: jest.fn().mockRejectedValue(new Error("Installation failed")),
				userChoice: Promise.resolve({ outcome: "accepted" })
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			managePWAInstallation.setDeferredPrompt(mockEvent as any);

			// When
			const result = await managePWAInstallation.installApp();

			// Then
			expect(result).toEqual({
				success: false,
				error: "Installation failed"
			});
		});
	});

	describe("getInstallInstructions", () => {
		test("should return Chrome instructions", () => {
			// When
			const instructions = managePWAInstallation.getInstallInstructions("chrome");

			// Then
			expect(instructions).toContain("icône d'installation");
		});

		test("should return Firefox instructions", () => {
			// When
			const instructions = managePWAInstallation.getInstallInstructions("firefox");

			// Then
			expect(instructions).toContain("menu");
		});

		test("should return Safari instructions", () => {
			// When
			const instructions = managePWAInstallation.getInstallInstructions("safari");

			// Then
			expect(instructions).toContain("Partager");
		});

		test("should return default instructions", () => {
			// When
			const instructions = managePWAInstallation.getInstallInstructions("unknown");

			// Then
			expect(instructions).toContain("options de votre navigateur");
		});
	});

	describe("deferred prompt management", () => {
		test("should set and clear deferred prompt", () => {
			// Given
			const mockEvent = { prompt: jest.fn(), userChoice: Promise.resolve({ outcome: "accepted" }) };

			// When - Set prompt
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			managePWAInstallation.setDeferredPrompt(mockEvent as any);
			let state = managePWAInstallation.getInstallationState();

			// Then
			expect(state.canInstall).toBe(true);
			expect(state.installMethod).toBe("beforeinstallprompt");

			// When - Clear prompt
			managePWAInstallation.clearDeferredPrompt();
			state = managePWAInstallation.getInstallationState();

			// Then
			expect(state.canInstall).toBe(false);
		});
	});
});
