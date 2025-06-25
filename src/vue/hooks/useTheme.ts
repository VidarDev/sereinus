"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_THEME, THEME_STORAGE_KEY, type ThemeName, THEMES, type UseThemeReturn } from "@/vue/constants/themes";

export const useTheme = (): UseThemeReturn => {
	const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);
	const [isLoading, setIsLoading] = useState(true);

	const setTheme = useCallback((newTheme: ThemeName) => {
		try {
			setThemeState(newTheme);
			localStorage.setItem(THEME_STORAGE_KEY, newTheme);
			document.documentElement.setAttribute("data-theme", newTheme);
		} catch (error) {
			console.error("Failed to save theme preference:", error);
		}
	}, []);

	useEffect(() => {
		try {
			const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
			const isValidTheme = THEMES.some((t) => t.name === savedTheme);

			if (savedTheme && isValidTheme) {
				setThemeState(savedTheme);
				document.documentElement.setAttribute("data-theme", savedTheme);
			}
		} catch (error) {
			console.error("Failed to load theme preference:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		theme,
		setTheme,
		isLoading,
		themes: THEMES
	};
};
