"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
	THEME_PRESETS,
	THEME_ROUTES,
	THEME_STORAGE_KEY,
	type ThemeChangeEventDetail,
	type ThemeColors,
	type ThemePreset
} from "@/vue/lib/theme/types";
import {
	applyThemeProperties,
	isValidThemePreset,
	setThemeDataAttribute,
	updatePWAMetaTags
} from "@/vue/lib/theme/utils";

interface ThemeContextValue {
	currentTheme: ThemePreset;
	presets: typeof THEME_PRESETS;
	applyTheme: (preset: ThemePreset) => void;
	applyCustomTheme: (colors: ThemeColors) => void;
	isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
	children: ReactNode;
	defaultTheme?: ThemePreset;
}

export function ThemeProvider({ children, defaultTheme = "default" }: ThemeProviderProps) {
	const [currentTheme, setCurrentTheme] = useState<ThemePreset>(defaultTheme);
	const [isHydrated, setIsHydrated] = useState(false);

	// Apply theme to DOM with complete setup
	const applyThemeToDOM = useCallback((preset: ThemePreset | "custom", colors: ThemeColors) => {
		if (typeof window === "undefined") return;

		// Apply all theme-related DOM changes
		setThemeDataAttribute(preset);
		applyThemeProperties(colors);
		updatePWAMetaTags(colors);

		// Dispatch custom event for components that need it
		const eventDetail: ThemeChangeEventDetail = { preset, colors };
		window.dispatchEvent(
			new CustomEvent("themeChanged", {
				detail: eventDetail
			})
		);
	}, []);

	const applyTheme = useCallback(
		(preset: ThemePreset) => {
			const colors = THEME_PRESETS[preset];
			setCurrentTheme(preset);
			applyThemeToDOM(preset, colors);

			if (typeof window !== "undefined") {
				localStorage.setItem(THEME_STORAGE_KEY, preset);
			}
		},
		[applyThemeToDOM]
	);

	const applyCustomTheme = useCallback(
		(colors: ThemeColors) => {
			setCurrentTheme("default");
			applyThemeToDOM("custom", colors);
		},
		[applyThemeToDOM]
	);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const currentDataTheme = document.documentElement.getAttribute("data-theme");
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as string | null;

		let initialTheme: ThemePreset;

		if (currentDataTheme && isValidThemePreset(currentDataTheme, THEME_PRESETS)) {
			// Theme was already applied by inline script, just sync state
			initialTheme = currentDataTheme as ThemePreset;
			setCurrentTheme(initialTheme);
		} else if (savedTheme && isValidThemePreset(savedTheme, THEME_PRESETS)) {
			// Apply saved theme if not already applied
			initialTheme = savedTheme;
			applyTheme(initialTheme);
		} else {
			// Apply default theme
			initialTheme = defaultTheme;
			applyTheme(initialTheme);
		}

		setIsHydrated(true);
	}, [applyTheme, defaultTheme]);

	const contextValue = useMemo(
		(): ThemeContextValue => ({
			currentTheme,
			presets: THEME_PRESETS,
			applyTheme,
			applyCustomTheme,
			isHydrated
		}),
		[currentTheme, applyTheme, applyCustomTheme, isHydrated]
	);

	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
		</NextThemesProvider>
	);
}

// Custom hook to use theme context
export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}

// Hook for route-based theme application
export function useRouteTheme(): {
	applyThemeForRoute: (pathname: string) => void;
} {
	const { applyTheme } = useTheme();

	const applyThemeForRoute = useCallback(
		(pathname: string) => {
			const themeForRoute = THEME_ROUTES[pathname] || "default";
			applyTheme(themeForRoute);
		},
		[applyTheme]
	);

	return { applyThemeForRoute };
}
