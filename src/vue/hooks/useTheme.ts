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

			window.dispatchEvent(
				new CustomEvent("theme-changed", {
					detail: { theme: newTheme }
				})
			);
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
				const currentDataTheme = document.documentElement.getAttribute("data-theme");
				if (currentDataTheme !== savedTheme) {
					document.documentElement.setAttribute("data-theme", savedTheme);
				}
			} else {
				document.documentElement.setAttribute("data-theme", DEFAULT_THEME);
			}
		} catch (error) {
			console.error("Failed to load theme preference:", error);
			document.documentElement.setAttribute("data-theme", DEFAULT_THEME);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		const handleThemeChange = (e: CustomEvent) => {
			const { theme: newTheme } = e.detail;
			if (newTheme && newTheme !== theme) {
				setThemeState(newTheme);
			}
		};

		window.addEventListener("theme-changed", handleThemeChange as EventListener);
		return () => window.removeEventListener("theme-changed", handleThemeChange as EventListener);
	}, [theme]);

	const getCurrentThemeColors = useCallback(() => {
		return THEMES.find((t) => t.name === theme);
	}, [theme]);

	const getCurrentThemeHex = useCallback(() => {
		const currentTheme = getCurrentThemeColors();
		if (!currentTheme) return undefined;

		return {
			primaryColor: currentTheme.primaryColor,
			backgroundColor: currentTheme.backgroundColor,
			primaryColorDark: currentTheme.primaryColorDark,
			backgroundColorDark: currentTheme.backgroundColorDark
		};
	}, [getCurrentThemeColors]);

	return {
		theme,
		setTheme,
		isLoading,
		themes: THEMES,
		getCurrentThemeColors,
		getCurrentThemeHex
	};
};
