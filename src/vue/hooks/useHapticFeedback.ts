"use client";

import { useCallback, useRef } from "react";

import { useAudioHaptic } from "@/vue/providers/audio-haptic.provider";

export interface HapticPattern {
	pattern: number[];
	delay?: number;
}

export const HAPTIC_PATTERNS = {
	inhale: [100],
	hold: [50, 50, 50],
	exhale: [150],
	light: [25],
	success: [50, 100, 50],
	error: [200, 100, 200],
	tap: [10]
} as const;

export function useHapticFeedback() {
	const { hapticEnabled } = useAudioHaptic();
	const lastVibrationTime = useRef<number>(0);
	const minInterval = 50;

	const isHapticSupported = useCallback(() => {
		return typeof navigator !== "undefined" && "vibrate" in navigator;
	}, []);

	const vibrate = useCallback(
		(pattern: number[] | keyof typeof HAPTIC_PATTERNS) => {
			if (!hapticEnabled || !isHapticSupported()) {
				return false;
			}

			const now = Date.now();
			if (now - lastVibrationTime.current < minInterval) {
				return false;
			}

			try {
				const vibrationPattern = Array.isArray(pattern) ? pattern : HAPTIC_PATTERNS[pattern];

				if (!vibrationPattern || vibrationPattern.length === 0) {
					return false;
				}

				const result = navigator.vibrate(vibrationPattern);

				if (result) {
					lastVibrationTime.current = now;
				} else {
					console.debug("Vibration échouée - peut-être désactivée dans les paramètres système");
				}

				return result;
			} catch (error) {
				console.debug("Erreur lors de la vibration:", error);
				return false;
			}
		},
		[hapticEnabled, isHapticSupported]
	);

	const vibrateWithDelay = useCallback(
		(pattern: number[] | keyof typeof HAPTIC_PATTERNS, delay: number) => {
			setTimeout(() => {
				vibrate(pattern);
			}, delay);
		},
		[vibrate]
	);

	const stopVibration = useCallback(() => {
		if (isHapticSupported()) {
			try {
				navigator.vibrate(0);
			} catch (error) {
				console.debug("Erreur lors de l'arrêt de la vibration:", error);
			}
		}
	}, [isHapticSupported]);

	return {
		vibrate,
		vibrateWithDelay,
		stopVibration,
		isSupported: isHapticSupported(),
		isEnabled: hapticEnabled
	};
}
