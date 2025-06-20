"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useRouteTheme as useRouteThemeProvider } from "@/vue/providers/theme.provider";

export function useAutoRouteTheme(): void {
	const pathname = usePathname();
	const { applyThemeForRoute } = useRouteThemeProvider();

	useEffect(() => {
		if (pathname) {
			applyThemeForRoute(pathname);
		}
	}, [pathname, applyThemeForRoute]);
}

export function useManualRouteTheme(): {
	applyThemeForRoute: (pathname: string) => void;
} {
	const { applyThemeForRoute } = useRouteThemeProvider();

	return { applyThemeForRoute };
}
