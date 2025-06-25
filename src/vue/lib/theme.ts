export type ThemeId = "blue" | "purple" | "brown";
export type ColorScheme = "light" | "dark" | "auto";

export interface ThemeConfig {
	id: ThemeId;
	name: string;
	metaThemeColor: {
		light: string;
		primary: string;
		dark: string;
		primaryDark: string;
	};
}

export interface ThemeMode {
	manual: ColorScheme;
	auto: boolean;
	preference?: "light" | "dark";
}

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
	blue: {
		id: "blue",
		name: "Blue",
		metaThemeColor: {
			light: "#f1f1f1",
			primary: "#aee0ff",
			dark: "#222333",
			primaryDark: "#aee0ff"
		}
	},
	purple: {
		id: "purple",
		name: "Purple",
		metaThemeColor: {
			light: "#f1f1f1",
			primary: "#d7a9ff",
			dark: "#222333",
			primaryDark: "#d7a9ff"
		}
	},
	brown: {
		id: "brown",
		name: "Brown",
		metaThemeColor: {
			light: "#f1f1f1",
			primary: "#af735f",
			dark: "#222333",
			primaryDark: "#af735f"
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
