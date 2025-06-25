"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

interface AudioHapticState {
	soundEnabled: boolean;
	hapticEnabled: boolean;
}

interface AudioHapticContextType extends AudioHapticState {
	toggleSound: () => void;
	toggleHaptic: () => void;
	setSoundEnabled: (enabled: boolean) => void;
	setHapticEnabled: (enabled: boolean) => void;
}

const AudioHapticContext = createContext<AudioHapticContextType | undefined>(undefined);

const STORAGE_KEY = "app-settings";

const DEFAULT_SETTINGS: AudioHapticState = {
	soundEnabled: true,
	hapticEnabled: typeof navigator !== "undefined" && "vibrate" in navigator
};

interface AudioHapticProviderProps {
	children: ReactNode;
}

export function AudioHapticProvider({ children }: AudioHapticProviderProps) {
	const [settings, setSettings] = useState<AudioHapticState>(DEFAULT_SETTINGS);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (parsed.hapticEnabled !== undefined || parsed.soundEnabled !== undefined) {
					setSettings((prev) => ({
						...prev,
						hapticEnabled: parsed.hapticEnabled ?? prev.hapticEnabled,
						soundEnabled: parsed.soundEnabled ?? prev.soundEnabled
					}));
				}
			}
		} catch (error) {
			console.warn("Erreur lors du chargement des paramètres audio/haptique:", error);
		}
	}, []);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			const existingSettings = stored ? JSON.parse(stored) : {};
			const updatedSettings = {
				...existingSettings,
				hapticEnabled: settings.hapticEnabled,
				soundEnabled: settings.soundEnabled
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
		} catch (error) {
			console.warn("Erreur lors de la sauvegarde des paramètres audio/haptique:", error);
		}
	}, [settings]);

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === STORAGE_KEY && e.newValue) {
				try {
					const parsed = JSON.parse(e.newValue);
					if (parsed.hapticEnabled !== undefined || parsed.soundEnabled !== undefined) {
						setSettings((prev) => ({
							...prev,
							hapticEnabled: parsed.hapticEnabled ?? prev.hapticEnabled,
							soundEnabled: parsed.soundEnabled ?? prev.soundEnabled
						}));
					}
				} catch (error) {
					console.warn("Erreur lors de la synchronisation des paramètres:", error);
				}
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	useEffect(() => {
		const handleSettingsChange = (e: CustomEvent) => {
			const { hapticEnabled, soundEnabled } = e.detail;
			if (hapticEnabled !== undefined || soundEnabled !== undefined) {
				setSettings((prev) => ({
					...prev,
					hapticEnabled: hapticEnabled ?? prev.hapticEnabled,
					soundEnabled: soundEnabled ?? prev.soundEnabled
				}));
			}
		};

		window.addEventListener("settings-changed", handleSettingsChange as EventListener);
		return () => window.removeEventListener("settings-changed", handleSettingsChange as EventListener);
	}, []);

	const toggleSound = () => {
		setSettings((prev) => {
			const newSoundEnabled = !prev.soundEnabled;
			// Trigger the synchronization event
			setTimeout(() => {
				window.dispatchEvent(
					new CustomEvent("settings-changed", {
						detail: { soundEnabled: newSoundEnabled }
					})
				);
			}, 0);
			return { ...prev, soundEnabled: newSoundEnabled };
		});
	};

	const toggleHaptic = () => {
		setSettings((prev) => {
			const newHapticEnabled = !prev.hapticEnabled;
			// Trigger the synchronization event
			setTimeout(() => {
				window.dispatchEvent(
					new CustomEvent("settings-changed", {
						detail: { hapticEnabled: newHapticEnabled }
					})
				);
			}, 0);
			return { ...prev, hapticEnabled: newHapticEnabled };
		});
	};

	const setSoundEnabled = (enabled: boolean) => {
		setSettings((prev) => ({ ...prev, soundEnabled: enabled }));
	};

	const setHapticEnabled = (enabled: boolean) => {
		setSettings((prev) => ({ ...prev, hapticEnabled: enabled }));
	};

	const value: AudioHapticContextType = {
		...settings,
		toggleSound,
		toggleHaptic,
		setSoundEnabled,
		setHapticEnabled
	};

	return <AudioHapticContext.Provider value={value}>{children}</AudioHapticContext.Provider>;
}

export function useAudioHaptic() {
	const context = useContext(AudioHapticContext);
	if (context === undefined) {
		throw new Error("useAudioHaptic must be used within an AudioHapticProvider");
	}
	return context;
}
