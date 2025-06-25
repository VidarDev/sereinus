export const THEME_STORAGE_KEY = "app-theme" as const;
export const DEFAULT_THEME = "blue" as const;

export const THEMES = [
	{
		name: "blue",
		displayName: "Blue",
		primaryColor: "#aee0ff",
		backgroundColor: "#222333",
		primaryColorDark: "#aee0ff",
		backgroundColorDark: "#222333"
	},
	{
		name: "purple",
		displayName: "Purple",
		primaryColor: "#d7a9ff",
		backgroundColor: "#222333",
		primaryColorDark: "#d7a9ff",
		backgroundColorDark: "#222333"
	},
	{
		name: "brown",
		displayName: "Brown",
		primaryColor: "#af735f",
		backgroundColor: "#222333",
		primaryColorDark: "#af735f",
		backgroundColorDark: "#222333"
	}
] as const;

export type ThemeName = (typeof THEMES)[number]["name"];

export interface Theme {
	name: ThemeName;
	displayName: string;
	primaryColor: string;
	backgroundColor: string;
	primaryColorDark: string;
	backgroundColorDark: string;
}

export interface UseThemeReturn {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
	themes: readonly Theme[];
	isLoading: boolean;
	getCurrentThemeColors: () => Theme | undefined;
	getCurrentThemeHex: () =>
		| {
				primaryColor: string;
				backgroundColor: string;
				primaryColorDark: string;
				backgroundColorDark: string;
		  }
		| undefined;
}
