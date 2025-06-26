"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { BreathingProtocol } from "@/main/domain/BreathingProtocol";
import type { SessionSettings } from "@/main/domain/BreathingSession";
import type { BreathingPhase } from "@/vue/features/breathing-session/types/session.types";
import { useHapticFeedback } from "./useHapticFeedback";

export interface SessionData {
	duration: number;
	cycleCount: number;
	completedAt: Date;
}

export interface UseBreathingSessionReturn {
	// State
	isActive: boolean;
	isPaused: boolean;
	currentPhase: BreathingPhase;
	cycleCount: number;
	totalTime: number;
	settings: SessionSettings;

	// Actions
	startSession: () => void;
	pauseSession: () => void;
	resumeSession: () => void;
	stopSession: () => SessionData | null;
	updateSettings: (newSettings: Partial<SessionSettings>) => void;
}

function getPhaseDuration(protocol: BreathingProtocol, phase: BreathingPhase): number {
	switch (phase) {
		case "inhale":
			return protocol.phases.inhale;
		case "hold1":
			return protocol.phases.hold1 || 0;
		case "exhale":
			return protocol.phases.exhale;
		case "hold2":
			return protocol.phases.hold2 || 0;
		case "idle":
			return 0;
		default:
			return 0;
	}
}

export function useBreathingSession(
	protocol: BreathingProtocol | null,
	initialSettings: SessionSettings = {
		hapticEnabled: true,
		soundEnabled: false,
		wakeLockEnabled: true
	}
): UseBreathingSessionReturn {
	// States
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("idle");
	const [cycleCount, setCycleCount] = useState(0);
	const [totalTime, setTotalTime] = useState(0);
	const [settings, setSettings] = useState(initialSettings);

	// Hooks
	const { vibrate } = useHapticFeedback();

	// Refs
	const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
	const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
	const phaseTimeRef = useRef(0);
	const startTimeRef = useRef<Date | null>(null);

	// Active phases
	const activePhases = useCallback((): BreathingPhase[] => {
		const phases: BreathingPhase[] = ["inhale"];
		if (protocol?.phases.hold1 && protocol.phases.hold1 > 0) phases.push("hold1");
		phases.push("exhale");
		if (protocol?.phases.hold2 && protocol.phases.hold2 > 0) phases.push("hold2");
		return phases;
	}, [protocol]);

	// Haptic feedback
	const triggerHaptic = useCallback(() => {
		if (settings.hapticEnabled) {
			const patterns = {
				inhale: "inhale" as const,
				hold1: "hold" as const,
				exhale: "exhale" as const,
				hold2: "light" as const,
				idle: "light" as const
			};
			vibrate(patterns[currentPhase] || "tap");
		}
	}, [settings.hapticEnabled, currentPhase, vibrate]);

	const nextPhase = useCallback(() => {
		if (!isActive || isPaused) return;

		const phases = activePhases();
		const currentIndex = phases.indexOf(currentPhase);

		if (currentIndex === -1) {
			console.error("Current phase not found in active phases!");
			return;
		}

		const nextIndex = (currentIndex + 1) % phases.length;
		const nextPhaseType = phases[nextIndex];

		if (!nextPhaseType) {
			console.error("Next phase is undefined!");
			return;
		}

		if (nextIndex === 0) {
			setCycleCount((prev) => prev + 1);
		}

		setCurrentPhase(nextPhaseType);

		triggerHaptic();
	}, [isActive, isPaused, currentPhase, activePhases, triggerHaptic]);

	const startSession = useCallback(() => {
		if (isActive) return;

		setIsActive(true);
		setIsPaused(false);
		setCycleCount(1);
		setTotalTime(0);
		setCurrentPhase("inhale");
		startTimeRef.current = new Date();

		totalTimerRef.current = setInterval(() => {
			setTotalTime((prev) => prev + 100);
		}, 100);

		triggerHaptic();
	}, [isActive, triggerHaptic]);

	const pauseSession = useCallback(() => {
		if (!isActive || isPaused) return;

		setIsPaused(true);

		if (phaseTimerRef.current) {
			clearTimeout(phaseTimerRef.current);
			phaseTimerRef.current = null;
		}
		if (totalTimerRef.current) {
			clearInterval(totalTimerRef.current);
			totalTimerRef.current = null;
		}
	}, [isActive, isPaused]);

	const resumeSession = useCallback(() => {
		if (!isActive || !isPaused) return;

		setIsPaused(false);

		phaseTimerRef.current = setTimeout(nextPhase, phaseTimeRef.current);

		totalTimerRef.current = setInterval(() => {
			setTotalTime((prev) => prev + 100);
		}, 100);
	}, [isActive, isPaused, nextPhase]);

	const stopSession = useCallback((): SessionData | null => {
		if (!isActive) return null;

		const sessionData: SessionData = {
			duration: totalTime,
			cycleCount,
			completedAt: new Date()
		};

		setIsActive(false);
		setIsPaused(false);
		setCurrentPhase("idle");
		setCycleCount(0);
		setTotalTime(0);
		startTimeRef.current = null;

		if (phaseTimerRef.current) {
			clearTimeout(phaseTimerRef.current);
			phaseTimerRef.current = null;
		}
		if (totalTimerRef.current) {
			clearInterval(totalTimerRef.current);
			totalTimerRef.current = null;
		}

		return sessionData;
	}, [isActive, totalTime, cycleCount]);

	const updateSettings = useCallback((newSettings: Partial<SessionSettings>) => {
		setSettings((prev) => ({ ...prev, ...newSettings }));
	}, []);

	useEffect(() => {
		if (!isActive || isPaused || !protocol) return;

		const phaseDuration = getPhaseDuration(protocol, currentPhase);

		if (phaseDuration > 0) {
			phaseTimerRef.current = setTimeout(() => {
				const phases = activePhases();
				const currentIndex = phases.indexOf(currentPhase);

				if (currentIndex === -1) return;

				const nextIndex = (currentIndex + 1) % phases.length;
				const nextPhaseType = phases[nextIndex];

				if (!nextPhaseType) return;

				if (nextIndex === 0 && currentPhase !== "idle") {
					setCycleCount((prev) => prev + 1);
				}

				setCurrentPhase(nextPhaseType);

				if (settings.hapticEnabled) {
					const patterns = {
						inhale: "inhale" as const,
						hold1: "hold" as const,
						exhale: "exhale" as const,
						hold2: "light" as const,
						idle: "light" as const
					};
					vibrate(patterns[nextPhaseType] || "tap");
				}
			}, phaseDuration * 1000);
		}

		return () => {
			if (phaseTimerRef.current) {
				clearTimeout(phaseTimerRef.current);
				phaseTimerRef.current = null;
			}
		};
	}, [isActive, isPaused, currentPhase, protocol, settings.hapticEnabled, activePhases, vibrate]);

	useEffect(() => {
		return () => {
			if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
			if (totalTimerRef.current) clearInterval(totalTimerRef.current);
		};
	}, []);

	return {
		isActive,
		isPaused,
		currentPhase,
		cycleCount,
		totalTime,
		settings,
		startSession,
		pauseSession,
		resumeSession,
		stopSession,
		updateSettings
	};
}
