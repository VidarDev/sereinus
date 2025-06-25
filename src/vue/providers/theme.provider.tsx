"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";

import { metaTagsService } from "@/main/presentation/services/meta-tags.service";
import { useColorScheme } from "@/vue/hooks/useColorScheme";
import { useThemeTransition } from "@/vue/hooks/useThemeTransition";
import { getAllThemes, getThemeConfig, isValidTheme, ThemeConfig, ThemeId } from "@/vue/lib/theme";

interface CustomThemeContextType {
	// Current theme
	theme: ThemeId;
	setTheme: (theme: ThemeId) => void;
	themeConfig: ThemeConfig;

	// Dark/Light mode
	colorScheme: "light" | "dark" | "auto";
	setColorScheme: (scheme: "light" | "dark" | "auto") => void;
	isDark: boolean;
	isAuto: boolean;

	// State
	isHydrated: boolean;

	// System
	systemScheme: "light" | "dark" | "no-preference";
	hasSystemPreference: boolean;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "custom-theme";

function CustomThemeProviderInner({
	children,
	defaultTheme = "blue"
}: {
	children: ReactNode;
	defaultTheme?: ThemeId;
}) {
	const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
	const [isHydrated, setIsHydrated] = useState(false);
	const { resolvedTheme, setTheme: setNextTheme } = useNextTheme();
	const colorScheme = useColorScheme();
	const transition = useThemeTransition();

	const isDark = resolvedTheme === "dark";
	const currentMode = isDark ? "dark" : "light";

	const themeConfig = useMemo(() => getThemeConfig(theme), [theme]);

	// Load saved theme on mount with proper hydration
	useEffect(() => {
		if (typeof window === "undefined") return;

		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		if (savedTheme && isValidTheme(savedTheme)) {
			setThemeState(savedTheme);
		}

		setIsHydrated(true);
	}, []);

	// Handle theme changes with optimized updates
	useEffect(() => {
		if (!isHydrated) return;

		// Update DOM attribute
		document.documentElement.setAttribute("data-theme", theme);

		// Update meta tags via service
		metaTagsService.updateThemeMetaTags(themeConfig, isDark);

		// Persist to storage
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme, isDark, isHydrated, themeConfig]);

	// Sync color scheme with next-themes
	useEffect(() => {
		if (!colorScheme.isAuto || !colorScheme.hasSystemPreference) return;

		setNextTheme(colorScheme.scheme === "dark" ? "dark" : "light");
	}, [colorScheme.scheme, colorScheme.isAuto, colorScheme.hasSystemPreference, setNextTheme]);

	const setTheme = useCallback(
		(newTheme: ThemeId) => {
			if (!isValidTheme(newTheme)) return;

			const oldTheme = theme;
			setThemeState(newTheme);

			if (oldTheme !== newTheme) {
				const fromConfig = getThemeConfig(oldTheme);
				const toConfig = getThemeConfig(newTheme);

				transition.transitionTo(fromConfig, toConfig, currentMode, currentMode).catch(() => {
					console.warn("Theme transition failed, continuing without animation");
				});
			}
		},
		[theme, currentMode, transition]
	);

	const setColorScheme = useCallback(
		(scheme: "light" | "dark" | "auto") => {
			if (scheme === "auto") {
				colorScheme.setAutoMode(true);
				if (colorScheme.hasSystemPreference) {
					setNextTheme("system");
				}
			} else {
				colorScheme.setManualScheme(scheme);
				setNextTheme(scheme);
			}
		},
		[colorScheme, setNextTheme]
	);

	// Memoize context value to prevent unnecessary re-renders
	const value = useMemo<CustomThemeContextType>(
		() => ({
			// Current theme
			theme,
			setTheme,
			themeConfig,

			// Dark/Light mode
			colorScheme: colorScheme.isAuto ? "auto" : (currentMode as "light" | "dark"),
			setColorScheme,
			isDark,
			isAuto: colorScheme.isAuto,

			// State
			isHydrated,

			// System
			systemScheme: colorScheme.scheme,
			hasSystemPreference: colorScheme.hasSystemPreference
		}),
		[
			theme,
			setTheme,
			themeConfig,
			colorScheme.isAuto,
			colorScheme.scheme,
			colorScheme.hasSystemPreference,
			setColorScheme,
			isDark,
			currentMode,
			isHydrated
		]
	);

	return <CustomThemeContext.Provider value={value}>{children}</CustomThemeContext.Provider>;
}

interface ThemeProviderProps {
	children: ReactNode;
	defaultTheme?: ThemeId;
}

export function ThemeProvider({ children, defaultTheme = "blue" }: ThemeProviderProps) {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange={false}
			storageKey="next-theme"
		>
			<CustomThemeProviderInner defaultTheme={defaultTheme}>{children}</CustomThemeProviderInner>
		</NextThemeProvider>
	);
}

// Main theme hook
export function useTheme() {
	const context = useContext(CustomThemeContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}

// Additional utility hooks
export function useThemeConfig() {
	const { themeConfig } = useTheme();
	return themeConfig;
}

export function useAvailableThemes() {
	return useMemo(() => getAllThemes(), []);
}
