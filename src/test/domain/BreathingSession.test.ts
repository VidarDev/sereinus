import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { BreathingProtocol } from "@/main/domain/BreathingProtocol";
import { BreathingSession, SessionSettings } from "@/main/domain/BreathingSession";
import { Clock } from "@/main/domain/services/clock.interface";
import { UUIDGenerator } from "@/main/domain/services/uuid-generator.interface";

const createTestProtocol = (): BreathingProtocol => {
	return new BreathingProtocol(
		"test-protocol",
		"Test Protocol",
		"A protocol for testing",
		{ inhale: 4, exhale: 4 },
		true
	);
};

const createTestSettings = (): SessionSettings => {
	return {
		hapticEnabled: true,
		soundEnabled: true,
		wakeLockEnabled: false
	};
};

describe("BreathingSession", () => {
	let protocol: BreathingProtocol;
	let settings: SessionSettings;
	let mockUUIDGenerator: jest.Mocked<UUIDGenerator>;
	let mockClock: jest.Mocked<Clock>;

	beforeEach(() => {
		protocol = createTestProtocol();
		settings = createTestSettings();

		mockUUIDGenerator = {
			generate: jest.fn(() => "test-session-id-123")
		};

		mockClock = {
			now: jest.fn(() => new Date("2024-01-01T12:00:00Z"))
		};
	});

	describe("Constructor", () => {
		it("should create a session with injected dependencies", () => {
			const session = new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);

			expect(session.id).toBe("test-session-id-123");
			expect(session.protocol).toBe(protocol);
			expect(session.settings).toBe(settings);
			expect(session.currentPhase).toBe("idle");
			expect(session.isActive).toBe(false);
			expect(session.isPaused).toBe(false);
			expect(session.cycleCount).toBe(0);
		});

		it("should call uuidGenerator.generate() once", () => {
			new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);

			expect(mockUUIDGenerator.generate).toHaveBeenCalledTimes(1);
		});

		it("should call clock.now() once for startTime", () => {
			new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);

			expect(mockClock.now).toHaveBeenCalledTimes(1);
		});
	});

	describe("Session Control", () => {
		let session: BreathingSession;

		beforeEach(() => {
			session = new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);
		});

		it("should start session correctly", () => {
			session.start();

			expect(session.isActive).toBe(true);
			expect(session.isPaused).toBe(false);
			expect(session.currentPhase).toBe("inhale");
		});

		it("should not allow starting already active session", () => {
			session.start();

			expect(() => session.start()).toThrow("Session is already active");
		});

		it("should pause active session", () => {
			session.start();
			session.pause();

			expect(session.isActive).toBe(true);
			expect(session.isPaused).toBe(true);
		});

		it("should not allow pausing inactive session", () => {
			expect(() => session.pause()).toThrow("Cannot pause: session not active or already paused");
		});

		it("should resume paused session", () => {
			session.start();
			session.pause();
			session.resume();

			expect(session.isActive).toBe(true);
			expect(session.isPaused).toBe(false);
		});

		it("should not allow resuming non-paused session", () => {
			session.start();

			expect(() => session.resume()).toThrow("Cannot resume: session not active or not paused");
		});

		it("should stop session correctly", () => {
			const stopTime = new Date("2024-01-01T12:05:00Z");
			mockClock.now.mockReturnValueOnce(stopTime);

			session.start();
			session.stop();

			expect(session.isActive).toBe(false);
			expect(session.isPaused).toBe(false);
			expect(session.currentPhase).toBe("idle");
			expect(session.endTime).toBe(stopTime);
		});
	});

	describe("Phase Management", () => {
		let session: BreathingSession;

		beforeEach(() => {
			session = new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);
			session.start();
		});

		it("should progress through phases correctly", () => {
			expect(session.currentPhase).toBe("inhale");

			session.nextPhase();
			expect(session.currentPhase).toBe("exhale");

			session.nextPhase();
			expect(session.currentPhase).toBe("inhale");
			expect(session.cycleCount).toBe(1);
		});

		it("should not progress phases when inactive", () => {
			session.stop();
			const initialPhase = session.currentPhase;

			session.nextPhase();

			expect(session.currentPhase).toBe(initialPhase);
		});

		it("should not progress phases when paused", () => {
			session.pause();
			const initialPhase = session.currentPhase;

			session.nextPhase();

			expect(session.currentPhase).toBe(initialPhase);
		});
	});

	describe("Duration Calculation", () => {
		let session: BreathingSession;

		beforeEach(() => {
			mockClock.now.mockClear();
			session = new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);
		});

		it("should calculate duration correctly for active session", () => {
			const startTime = new Date("2024-01-01T12:00:00Z");
			mockClock.now.mockReturnValueOnce(startTime);

			session = new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);

			const currentTime = new Date("2024-01-01T12:05:00Z");
			mockClock.now.mockReturnValue(currentTime);

			const duration = session.duration;

			expect(duration).toBe(5 * 60 * 1000);
		});

		it("should calculate duration correctly for stopped session", () => {
			const startTime = new Date("2024-01-01T12:00:00Z");
			mockClock.now.mockReturnValueOnce(startTime);

			session = new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);

			const stopTime = new Date("2024-01-01T12:03:00Z");
			mockClock.now.mockReturnValueOnce(stopTime);

			session.start();
			session.stop();

			const duration = session.duration;

			expect(duration).toBe(3 * 60 * 1000);
		});
	});

	describe("Settings Management", () => {
		let session: BreathingSession;

		beforeEach(() => {
			session = new BreathingSession(protocol, settings, mockUUIDGenerator, mockClock);
		});

		it("should return updated settings", () => {
			const newSettings = session.updateSettings({ hapticEnabled: false });

			expect(newSettings.hapticEnabled).toBe(false);
			expect(newSettings.soundEnabled).toBe(true);
			expect(newSettings.wakeLockEnabled).toBe(false);
		});

		it("should handle partial settings update", () => {
			const newSettings = session.updateSettings({ soundEnabled: false });

			expect(newSettings.hapticEnabled).toBe(true);
			expect(newSettings.soundEnabled).toBe(false);
			expect(newSettings.wakeLockEnabled).toBe(false);
		});
	});

	describe("Protocol with Hold Phases", () => {
		let protocolWithHolds: BreathingProtocol;
		let session: BreathingSession;

		beforeEach(() => {
			protocolWithHolds = new BreathingProtocol(
				"test-protocol-holds",
				"Test Protocol with Holds",
				"A protocol with hold phases",
				{ inhale: 4, hold1: 2, exhale: 6, hold2: 1 },
				true
			);
			session = new BreathingSession(protocolWithHolds, settings, mockUUIDGenerator, mockClock);
			session.start();
		});

		it("should include all active phases", () => {
			expect(session.currentPhase).toBe("inhale");

			session.nextPhase();
			expect(session.currentPhase).toBe("hold1");

			session.nextPhase();
			expect(session.currentPhase).toBe("exhale");

			session.nextPhase();
			expect(session.currentPhase).toBe("hold2");

			session.nextPhase();
			expect(session.currentPhase).toBe("inhale");
			expect(session.cycleCount).toBe(1);
		});
	});
});
