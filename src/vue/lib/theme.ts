export type ThemeId = "default" | "green";
export type ColorScheme = "light" | "dark" | "auto";

export interface ThemeConfig {
	id: ThemeId;
	name: string;
	metaThemeColor: {
		light: string;
		dark: string;
	};
}

export interface ThemeMode {
	manual: ColorScheme;
	auto: boolean;
	preference?: "light" | "dark";
}

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
	default: {
		id: "default",
		name: "Default",
		metaThemeColor: {
			light: "hsl(0 0% 99%)",
			dark: "hsl(0 0% 0%)"
		}
	},
	green: {
		id: "green",
		name: "Green",
		metaThemeColor: {
			light: "oklch(0.9751 0.0127 244.2507)",
			dark: "oklch(0.2077 0.0398 265.7549)"
		}
	}
} as const;

export function getThemeConfig(id: ThemeId): ThemeConfig {
	return THEME_CONFIGS[id];
}

export function getAllThemes(): ThemeConfig[] {
	return Object.values(THEME_CONFIGS);
}

export function isValidTheme(id: string): id is ThemeId {
	return id in THEME_CONFIGS;
}

export function isValidColorScheme(scheme: string): scheme is ColorScheme {
	return ["light", "dark", "auto"].includes(scheme);
}
