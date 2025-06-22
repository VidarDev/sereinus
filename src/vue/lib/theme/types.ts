export interface ThemeColors {
	primary: string;
	background: string;
	background_color: string;
}

export const THEME_PRESETS = {
	default: {
		primary: "oklch(0 0 0)",
		background: "oklch(0.99 0 0)",
		background_color: "oklch(0.99 0 0)"
	},
	green: {
		primary: "oklch(0.7227 0.192 149.5793)",
		background: "oklch(0.9751 0.0127 244.2507)",
		background_color: "oklch(0.9751 0.0127 244.2507)"
	}
} as const;

export type ThemePreset = keyof typeof THEME_PRESETS;

export const THEME_ROUTES: Record<string, ThemePreset> = {
	"/": "default"
} as const;

export const THEME_STORAGE_KEY = "amai-theme" as const;

export interface ThemeChangeEventDetail {
	preset: ThemePreset | "custom";
	colors: ThemeColors;
}

export const THEME_META_TAGS = {
	THEME_COLOR: "theme-color",
	APPLE_STATUS_BAR: "apple-mobile-web-app-status-bar-style",
	MS_NAV_BUTTON: "msapplication-navbutton-color"
} as const;
