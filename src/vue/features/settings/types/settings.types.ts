import type { ThemeName } from "@/vue/constants/themes";
import type { SVGShape } from "@/vue/hooks/useBreathingSVGShape";

export interface SettingsState {
	theme: ThemeName;
	shape: SVGShape;
	preferences: UserPreferences;
}

export interface UserPreferences {
	hapticEnabled: boolean;
	soundEnabled: boolean;
	wakeLockEnabled: boolean;
	autoSave: boolean;
	language: string;
}

export interface SettingsFormData {
	theme?: ThemeName;
	shape?: SVGShape;
	preferences?: Partial<UserPreferences>;
}

export interface SettingsValidationErrors {
	theme?: string;
	shape?: string;
	preferences?: Record<string, string>;
}

export interface SettingsHookReturn {
	settings: SettingsState;
	isLoading: boolean;
	isValid: boolean;
	errors: SettingsValidationErrors;
	updateSettings: (data: SettingsFormData) => Promise<void>;
	resetSettings: () => Promise<void>;
	exportSettings: () => string;
	importSettings: (data: string) => Promise<boolean>;
}

export type { SVGShape, ThemeName };
