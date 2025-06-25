"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { BreathingProtocol } from "@/main/domain/BreathingProtocol";
import type { SessionSettings } from "@/main/domain/BreathingSession";
import type { BreathingPhase } from "@/vue/components/Breathing/breathing-svg";

export interface SessionData {
	duration: number;
	cycleCount: number;
	completedAt: Date;
}

export interface UseBreathingSessionReturn {
	// État
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

// Fonction utilitaire pour obtenir la durée d'une phase
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
	protocol: BreathingProtocol,
	initialSettings: SessionSettings = {
		hapticEnabled: true,
		soundEnabled: false,
		wakeLockEnabled: true
	}
): UseBreathingSessionReturn {
	// États
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("idle");
	const [cycleCount, setCycleCount] = useState(0);
	const [totalTime, setTotalTime] = useState(0);
	const [settings, setSettings] = useState(initialSettings);

	// Refs pour les timers
	const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
	const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
	const phaseTimeRef = useRef(0);
	const startTimeRef = useRef<Date | null>(null);

	// Phases actives selon le protocole
	const activePhases = useCallback((): BreathingPhase[] => {
		const phases: BreathingPhase[] = ["inhale"];
		if (protocol.phases.hold1 && protocol.phases.hold1 > 0) phases.push("hold1");
		phases.push("exhale");
		if (protocol.phases.hold2 && protocol.phases.hold2 > 0) phases.push("hold2");
		return phases;
	}, [protocol]);

	// Haptic feedback
	const triggerHaptic = useCallback(() => {
		if (settings.hapticEnabled && "vibrate" in navigator) {
			const patterns = {
				inhale: [100],
				hold1: [50, 50, 50],
				exhale: [150],
				hold2: [25],
				idle: [25]
			};
			navigator.vibrate(patterns[currentPhase] || [50]);
		}
	}, [settings.hapticEnabled, currentPhase]);

	// Passer à la phase suivante
	const nextPhase = useCallback(() => {
		if (!isActive || isPaused) return;

		const phases = activePhases();
		const currentIndex = phases.indexOf(currentPhase);
		const nextIndex = (currentIndex + 1) % phases.length;

		// Si on revient au début, incrémenter le cycle
		if (nextIndex === 0) {
			setCycleCount((prev) => prev + 1);
		}

		const nextPhaseType = phases[nextIndex];
		setCurrentPhase(nextPhaseType);

		// Trigger haptic feedback
		triggerHaptic();

		// Programmer la prochaine transition
		const phaseDuration = getPhaseDuration(protocol, nextPhaseType);
		phaseTimeRef.current = phaseDuration * 1000;

		phaseTimerRef.current = setTimeout(nextPhase, phaseTimeRef.current);
	}, [isActive, isPaused, currentPhase, activePhases, protocol, triggerHaptic]);

	// Démarrer la session
	const startSession = useCallback(() => {
		if (isActive) return;

		setIsActive(true);
		setIsPaused(false);
		setCycleCount(1);
		setTotalTime(0);
		setCurrentPhase("inhale");
		startTimeRef.current = new Date();

		// Démarrer le timer de phase
		const firstPhaseDuration = protocol.phases.inhale * 1000;
		phaseTimeRef.current = firstPhaseDuration;
		phaseTimerRef.current = setTimeout(nextPhase, firstPhaseDuration);

		// Démarrer le timer total
		totalTimerRef.current = setInterval(() => {
			setTotalTime((prev) => prev + 100);
		}, 100);

		// Trigger haptic au démarrage
		triggerHaptic();
	}, [isActive, protocol, nextPhase, triggerHaptic]);

	// Pause
	const pauseSession = useCallback(() => {
		if (!isActive || isPaused) return;

		setIsPaused(true);

		// Nettoyer les timers
		if (phaseTimerRef.current) {
			clearTimeout(phaseTimerRef.current);
			phaseTimerRef.current = null;
		}
		if (totalTimerRef.current) {
			clearInterval(totalTimerRef.current);
			totalTimerRef.current = null;
		}
	}, [isActive, isPaused]);

	// Reprendre
	const resumeSession = useCallback(() => {
		if (!isActive || !isPaused) return;

		setIsPaused(false);

		// Reprendre le timer de phase avec le temps restant
		phaseTimerRef.current = setTimeout(nextPhase, phaseTimeRef.current);

		// Reprendre le timer total
		totalTimerRef.current = setInterval(() => {
			setTotalTime((prev) => prev + 100);
		}, 100);
	}, [isActive, isPaused, nextPhase]);

	// Arrêter la session
	const stopSession = useCallback((): SessionData | null => {
		if (!isActive) return null;

		const sessionData: SessionData = {
			duration: totalTime,
			cycleCount,
			completedAt: new Date()
		};

		// Reset état
		setIsActive(false);
		setIsPaused(false);
		setCurrentPhase("idle");
		setCycleCount(0);
		setTotalTime(0);
		startTimeRef.current = null;

		// Nettoyer les timers
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

	// Mettre à jour les settings
	const updateSettings = useCallback((newSettings: Partial<SessionSettings>) => {
		setSettings((prev) => ({ ...prev, ...newSettings }));
	}, []);

	// Cleanup à la fin du composant
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
