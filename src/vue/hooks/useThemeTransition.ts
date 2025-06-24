"use client";

import { useCallback, useState } from "react";

import { metaTagsService } from "@/main/presentation/services/meta-tags.service";
import type { ThemeConfig } from "@/vue/lib/theme";

interface TransitionOptions {
	skipTransition?: boolean;
	duration?: number;
}

export function useThemeTransition() {
	const [isTransitioning, setIsTransitioning] = useState(false);

	const transitionTo = useCallback(
		async (
			fromTheme: ThemeConfig,
			toTheme: ThemeConfig,
			fromMode: "light" | "dark",
			toMode: "light" | "dark",
			options: TransitionOptions = {}
		) => {
			const { skipTransition = false, duration = 150 } = options;

			setIsTransitioning(true);

			try {
				metaTagsService.updateThemeMetaTags(toTheme, toMode === "dark");

				if (!skipTransition && fromTheme.id !== toTheme.id) {
					document.documentElement.style.setProperty("--theme-transition-duration", `${duration}ms`);
					document.documentElement.classList.add("theme-transitioning");

					await new Promise((resolve) => setTimeout(resolve, duration));

					document.documentElement.classList.remove("theme-transitioning");
				}
			} catch (error) {
				console.warn("Theme transition failed:", error);
				// Fallback
				metaTagsService.updateThemeMetaTags(toTheme, toMode === "dark");
			} finally {
				setIsTransitioning(false);
			}
		},
		[]
	);

	return {
		transitionTo,
		isTransitioning
	};
}
