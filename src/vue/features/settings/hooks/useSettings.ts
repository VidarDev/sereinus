"use client";

import { useCallback, useEffect, useState } from "react";

import { useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { useTheme } from "@/vue/hooks/useTheme";
import { useAudioHaptic } from "@/vue/providers/audio-haptic.provider";
import { SiteConfig } from "@/vue/site-config";
import type {
	SettingsFormData,
	SettingsHookReturn,
	SettingsState,
	SettingsValidationErrors,
	UserPreferences
} from "../types/settings.types";

const DEFAULT_PREFERENCES: UserPreferences = {
	hapticEnabled: true,
	soundEnabled: false,
	wakeLockEnabled: true,
	autoSave: true,
	language: "fr"
};

const SETTINGS_STORAGE_KEY = `${SiteConfig.appId}-settings`;

export const useSettings = (): SettingsHookReturn => {
	const { theme, setTheme, isLoading: themeLoading } = useTheme();
	const { shape, setShape } = useBreathingSVGShape();
	const { soundEnabled, hapticEnabled, setSoundEnabled, setHapticEnabled } = useAudioHaptic();

	const [preferences, setPreferences] = useState<UserPreferences>({
		...DEFAULT_PREFERENCES,
		hapticEnabled,
		soundEnabled
	});
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState<SettingsValidationErrors>({});

	useEffect(() => {
		setPreferences((prev) => ({
			...prev,
			hapticEnabled,
			soundEnabled
		}));
	}, [hapticEnabled, soundEnabled]);

	useEffect(() => {
		const handleSettingsChange = (e: CustomEvent) => {
			const { hapticEnabled: newHaptic, soundEnabled: newSound } = e.detail;
			setPreferences((prev) => ({
				...prev,
				...(newHaptic !== undefined && { hapticEnabled: newHaptic }),
				...(newSound !== undefined && { soundEnabled: newSound })
			}));
		};

		window.addEventListener("settings-changed", handleSettingsChange as EventListener);
		return () => window.removeEventListener("settings-changed", handleSettingsChange as EventListener);
	}, []);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				setPreferences((prev) => ({ ...prev, ...parsed }));
			}
		} catch (error) {
			console.error("Failed to load preferences:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const savePreferences = useCallback((newPreferences: UserPreferences) => {
		try {
			localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newPreferences));
			setPreferences(newPreferences);
		} catch (error) {
			console.error("Failed to save preferences:", error);
			throw error;
		}
	}, []);

	const validateSettings = useCallback((data: SettingsFormData): SettingsValidationErrors => {
		const validationErrors: SettingsValidationErrors = {};

		if (data.theme && !["blue", "purple", "brown"].includes(data.theme)) {
			validationErrors.theme = "Thème invalide";
		}

		if (data.shape && !["circle", "drop"].includes(data.shape)) {
			validationErrors.shape = "Forme invalide";
		}

		return validationErrors;
	}, []);

	const updateSettings = useCallback(
		async (data: SettingsFormData) => {
			try {
				const validationErrors = validateSettings(data);
				if (Object.keys(validationErrors).length > 0) {
					setErrors(validationErrors);
					throw new Error("Validation failed");
				}

				setErrors({});

				// Mettre à jour chaque partie
				if (data.theme) {
					setTheme(data.theme);
				}

				if (data.shape) {
					setShape(data.shape);
				}

				if (data.preferences) {
					const newPreferences = { ...preferences, ...data.preferences };
					savePreferences(newPreferences);

					if (data.preferences.soundEnabled !== undefined) {
						setSoundEnabled(data.preferences.soundEnabled);
					}
					if (data.preferences.hapticEnabled !== undefined) {
						setHapticEnabled(data.preferences.hapticEnabled);
					}

					window.dispatchEvent(
						new CustomEvent("settings-changed", {
							detail: {
								hapticEnabled: data.preferences.hapticEnabled,
								soundEnabled: data.preferences.soundEnabled
							}
						})
					);
				}
			} catch (error) {
				console.error("Error saving settings:", error);
				throw error;
			}
		},
		[preferences, setTheme, setShape, savePreferences, validateSettings, setSoundEnabled, setHapticEnabled]
	);

	const resetSettings = useCallback(async () => {
		try {
			setTheme("blue");
			setShape("circle");
			savePreferences(DEFAULT_PREFERENCES);
			setErrors({});
		} catch (error) {
			console.error("Error resetting settings:", error);
			throw error;
		}
	}, [setTheme, setShape, savePreferences]);

	const exportSettings = useCallback((): string => {
		const settingsData = {
			theme,
			shape,
			preferences,
			exportDate: new Date().toISOString()
		};
		return JSON.stringify(settingsData, null, 2);
	}, [theme, shape, preferences]);

	const importSettings = useCallback(
		async (data: string): Promise<boolean> => {
			try {
				const parsed = JSON.parse(data);

				if (parsed.theme) setTheme(parsed.theme);
				if (parsed.shape) setShape(parsed.shape);
				if (parsed.preferences) savePreferences(parsed.preferences);

				return true;
			} catch {
				return false;
			}
		},
		[setTheme, setShape, savePreferences]
	);

	const settings: SettingsState = {
		theme,
		shape,
		preferences
	};

	return {
		settings,
		isLoading: isLoading || themeLoading,
		isValid: Object.keys(errors).length === 0,
		errors,
		updateSettings,
		resetSettings,
		exportSettings,
		importSettings
	};
};
