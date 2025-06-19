"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { themeManager } from "@/vue/lib/theme-manager";

interface ThemeProviderProps {
	children: React.ReactNode;
	autoTheme?: boolean;
}

export function ThemeProvider({ children, autoTheme = true }: ThemeProviderProps) {
	const pathname = usePathname();

	useEffect(() => {
		themeManager.initialize();
	}, []);

	useEffect(() => {
		if (autoTheme && pathname) {
			themeManager.applyThemeForRoute(pathname);
		}
	}, [pathname, autoTheme]);

	return <>{children}</>;
}
