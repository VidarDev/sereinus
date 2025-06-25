"use client";

import { useMemo } from "react";
import { Palette, Sparkles } from "lucide-react";

import { BaseSwitcher } from "@/vue/components/theme-switcher-base";
import type { ThemeConfig } from "@/vue/lib/theme";
import { useAvailableThemes, useTheme } from "@/vue/providers/theme.provider";

interface ColorSwitcherProps {
	className?: string;
	showLabels?: boolean;
	size?: "sm" | "default" | "lg";
	variant?: "buttons" | "palette";
}

const THEME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	blue: Palette,
	purple: Sparkles,
	brown: Palette
};

export function ColorSwitcher({ className, showLabels = false, size = "sm", variant = "buttons" }: ColorSwitcherProps) {
	const { theme, setTheme, isHydrated } = useTheme();
	const availableThemes = useAvailableThemes();

	const options = useMemo(
		() =>
			availableThemes.map((themeConfig: ThemeConfig) => ({
				value: themeConfig.id,
				label: themeConfig.name,
				icon: THEME_ICONS[themeConfig.id] || Palette,
				active: theme === themeConfig.id
			})),
		[availableThemes, theme]
	);

	return (
		<BaseSwitcher
			options={options}
			onSelect={setTheme}
			className={className}
			showLabels={showLabels}
			size={size}
			variant={variant}
			isLoading={!isHydrated}
			aria-label="Color theme selector"
		>
			{variant === "palette" && !showLabels && (
				<div
					className="border-background absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border"
					style={{
						backgroundColor: availableThemes.find((t) => t.id === theme)?.metaThemeColor.light
					}}
				/>
			)}
		</BaseSwitcher>
	);
}

// Hook for easier color theme management
export function useColorSwitch() {
	const { theme, setTheme, themeConfig } = useTheme();
	const availableThemes = useAvailableThemes();

	const switchToNext = () => {
		const currentIndex = availableThemes.findIndex((t) => t.id === theme);
		const nextIndex = (currentIndex + 1) % availableThemes.length;
		setTheme(availableThemes[nextIndex].id);
	};

	const switchToPrevious = () => {
		const currentIndex = availableThemes.findIndex((t) => t.id === theme);
		const prevIndex = currentIndex === 0 ? availableThemes.length - 1 : currentIndex - 1;
		setTheme(availableThemes[prevIndex].id);
	};

	return {
		currentTheme: theme,
		currentThemeConfig: themeConfig,
		availableThemes,
		setTheme,
		switchToNext,
		switchToPrevious
	};
}
