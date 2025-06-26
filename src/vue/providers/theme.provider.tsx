"use client";

import { createContext, ReactNode, useContext } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

import type { UseThemeReturn } from "@/vue/constants/themes";
import { useTheme as useThemeHook } from "@/vue/hooks/useTheme";

const ThemeContext = createContext<UseThemeReturn | undefined>(undefined);

interface ThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const themeState = useThemeHook();

	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="dark"
			disableTransitionOnChange={false}
			storageKey="next-theme"
		>
			<ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
		</NextThemeProvider>
	);
}

export function useTheme(): UseThemeReturn {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}
