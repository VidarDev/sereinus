"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEYS = {
	MODE: "theme-mode",
	AUTO: "theme-auto"
} as const;

function getInitialColorScheme(): "light" | "dark" | "no-preference" {
	if (typeof window === "undefined") return "no-preference";

	const stored = localStorage.getItem(STORAGE_KEYS.MODE);
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	return mediaQuery.matches ? "dark" : "light";
}

function getInitialAutoMode(): boolean {
	if (typeof window === "undefined") return true;

	const stored = localStorage.getItem(STORAGE_KEYS.AUTO);
	return stored ? JSON.parse(stored) : true;
}

export function useColorScheme() {
	const [scheme, setScheme] = useState<"light" | "dark" | "no-preference">(() =>
		typeof window === "undefined" ? "no-preference" : getInitialColorScheme()
	);

	const [isAuto, setIsAuto] = useState(() => getInitialAutoMode());

	useEffect(() => {
		if (!isAuto || typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			setScheme(e.matches ? "dark" : "light");
		};

		setScheme(mediaQuery.matches ? "dark" : "light");

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [isAuto]);

	const setAutoMode = useCallback((auto: boolean) => {
		setIsAuto(auto);
		localStorage.setItem(STORAGE_KEYS.AUTO, JSON.stringify(auto));

		if (auto && typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			setScheme(mediaQuery.matches ? "dark" : "light");
		}
	}, []);

	const setManualScheme = useCallback((newScheme: "light" | "dark") => {
		setIsAuto(false);
		setScheme(newScheme);
		localStorage.setItem(STORAGE_KEYS.AUTO, "false");
		localStorage.setItem(STORAGE_KEYS.MODE, newScheme);
	}, []);

	return {
		scheme,
		isAuto,
		setAutoMode,
		setManualScheme,
		hasSystemPreference: scheme !== "no-preference"
	};
}
