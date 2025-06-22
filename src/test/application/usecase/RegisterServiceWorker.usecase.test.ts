import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { RegisterServiceWorker } from "@/main/application/usecase/RegisterServiceWorker.usecase";

// Mock du ServiceWorkerRegistration
interface MockServiceWorkerRegistration {
	waiting?: ServiceWorker;
	installing?: ServiceWorker;
}

// Mock du ServiceWorker
interface MockServiceWorker {
	postMessage: jest.Mock;
}

describe("RegisterServiceWorker UseCase", () => {
	let registerServiceWorker: RegisterServiceWorker;
	let mockServiceWorkerRegistration: MockServiceWorkerRegistration;
	let mockServiceWorker: MockServiceWorker;

	beforeEach(() => {
		registerServiceWorker = new RegisterServiceWorker();

		mockServiceWorker = {
			postMessage: jest.fn()
		};

		mockServiceWorkerRegistration = {};

		// Mock navigator.serviceWorker
		Object.defineProperty(global, "navigator", {
			value: {
				serviceWorker: {
					register: jest.fn(),
					getRegistration: jest.fn()
				}
			},
			writable: true
		});

		// Mock window
		Object.defineProperty(global, "window", {
			value: {},
			writable: true
		});

		// Mock MessageChannel
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).MessageChannel = jest.fn().mockImplementation(() => ({
			port1: { onmessage: null },
			port2: {}
		}));
	});

	describe("execute", () => {
		test("should return not supported when service workers are not supported", async () => {
			// Given
			Object.defineProperty(global, "window", { value: undefined, writable: true });

			// When
			const result = await registerServiceWorker.execute();

			// Then
			expect(result).toEqual({
				isSupported: false,
				isRegistered: false,
				error: "Service Workers are not supported in this browser"
			});
		});

		test("should register service worker successfully", async () => {
			// Given
			const mockRegister = jest.fn().mockResolvedValue(mockServiceWorkerRegistration as unknown as never);
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { register: mockRegister },
				writable: true
			});

			// When
			const result = await registerServiceWorker.execute();

			// Then
			expect(result).toEqual({
				isSupported: true,
				isRegistered: true
			});
			expect(mockRegister).toHaveBeenCalledWith("/sw.js", { scope: "/" });
		});

		test("should handle registration error", async () => {
			// Given
			// @ts-expect-error typescript does not recognize the mock
			const mockRegister = jest.fn().mockRejectedValue(new Error("Registration failed"));
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { register: mockRegister },
				writable: true
			});

			// When
			const result = await registerServiceWorker.execute();

			// Then
			expect(result).toEqual({
				isSupported: true,
				isRegistered: false,
				error: "Registration failed"
			});
		});

		test("should handle unknown error", async () => {
			// Given
			// @ts-expect-error typescript does not recognize the mock
			const mockRegister = jest.fn().mockRejectedValue("Unknown error");
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { register: mockRegister },
				writable: true
			});

			// When
			const result = await registerServiceWorker.execute();

			// Then
			expect(result).toEqual({
				isSupported: true,
				isRegistered: false,
				error: "Unknown error"
			});
		});
	});

	describe("checkForUpdates", () => {
		test("should return no updates when service workers are not supported", async () => {
			// Given
			Object.defineProperty(global, "window", { value: undefined, writable: true });

			// When
			const result = await registerServiceWorker.checkForUpdates();

			// Then
			expect(result).toEqual({
				hasUpdate: false,
				canUpdate: false
			});
		});

		test("should return no updates when no registration exists", async () => {
			// Given
			// @ts-expect-error typescript does not recognize the mock
			const mockGetRegistration = jest.fn().mockResolvedValue(undefined);
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// When
			const result = await registerServiceWorker.checkForUpdates();

			// Then
			expect(result).toEqual({
				hasUpdate: false,
				canUpdate: false
			});
		});

		test("should detect update when service worker is waiting", async () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			mockServiceWorkerRegistration.waiting = mockServiceWorker as any;
			const mockGetRegistration = jest.fn().mockResolvedValue(mockServiceWorkerRegistration as unknown as never);
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// When
			const result = await registerServiceWorker.checkForUpdates();

			// Then
			expect(result).toEqual({
				hasUpdate: true,
				canUpdate: true
			});
		});

		test("should detect update when service worker is installing", async () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			mockServiceWorkerRegistration.installing = mockServiceWorker as any;
			const mockGetRegistration = jest.fn().mockResolvedValue(mockServiceWorkerRegistration as unknown as never);
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// When
			const result = await registerServiceWorker.checkForUpdates();

			// Then
			expect(result).toEqual({
				hasUpdate: true,
				canUpdate: false
			});
		});

		test("should handle error during check", async () => {
			// Given
			// @ts-expect-error typescript does not recognize the mock
			const mockGetRegistration = jest.fn().mockRejectedValue(new Error("Check failed"));
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// When
			const result = await registerServiceWorker.checkForUpdates();

			// Then
			expect(result).toEqual({
				hasUpdate: false,
				canUpdate: false
			});
		});
	});

	describe("activateUpdate", () => {
		test("should return false when service workers are not supported", async () => {
			// Given
			Object.defineProperty(global, "window", { value: undefined, writable: true });

			// When
			const result = await registerServiceWorker.activateUpdate();

			// Then
			expect(result).toBe(false);
		});

		test("should return false when no waiting service worker", async () => {
			// Given
			const mockGetRegistration = jest.fn().mockResolvedValue(mockServiceWorkerRegistration as unknown as never);
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// When
			const result = await registerServiceWorker.activateUpdate();

			// Then
			expect(result).toBe(false);
		});

		test("should activate update successfully", async () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			mockServiceWorkerRegistration.waiting = mockServiceWorker as any;
			const mockGetRegistration = jest.fn().mockResolvedValue(mockServiceWorkerRegistration as unknown as never);
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// Mock MessageChannel to simulate successful response
			const mockPort1 = { onmessage: null };
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(global as any).MessageChannel = jest.fn().mockImplementation(() => ({
				port1: mockPort1,
				port2: {}
			}));

			// When
			const resultPromise = registerServiceWorker.activateUpdate();

			// Simulate successful message response
			setTimeout(() => {
				if (mockPort1.onmessage) {
					// @ts-expect-error typescript does not recognize the mock
					mockPort1.onmessage({ data: { success: true } });
				}
			}, 10);

			const result = await resultPromise;

			// Then
			expect(result).toBe(true);
			expect(mockServiceWorker.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" }, expect.any(Array));
		});

		test("should handle timeout during activation", async () => {
			// Given
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			mockServiceWorkerRegistration.waiting = mockServiceWorker as any;
			const mockGetRegistration = jest.fn().mockResolvedValue(mockServiceWorkerRegistration as unknown as never);
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// Mock setTimeout to resolve immediately (simulate timeout)
			jest.spyOn(global, "setTimeout").mockImplementation((callback: () => void) => {
				callback();
				return 1 as unknown as NodeJS.Timeout;
			});

			// When
			const result = await registerServiceWorker.activateUpdate();

			// Then
			expect(result).toBe(false);
		});

		test("should handle error during activation", async () => {
			// Given
			// @ts-expect-error typescript does not recognize the mock
			const mockGetRegistration = jest.fn().mockRejectedValue(new Error("Activation failed"));
			Object.defineProperty(global.navigator, "serviceWorker", {
				value: { getRegistration: mockGetRegistration },
				writable: true
			});

			// When
			const result = await registerServiceWorker.activateUpdate();

			// Then
			expect(result).toBe(false);
		});
	});
});
