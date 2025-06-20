"use client";

import { useCallback, useMemo } from "react";

import { Button } from "@/vue/components/ui/button";
import { type ThemePreset } from "@/vue/lib/theme/types";
import { getFormattedThemeName } from "@/vue/lib/theme/utils";
import { cn } from "@/vue/lib/utils";
import { useTheme } from "@/vue/providers/theme.provider";

interface ThemeSwitcherProps {
	className?: string;
	showLabel?: boolean;
	size?: "sm" | "default" | "lg";
}

export function ThemeSwitcher({ className, showLabel = true, size = "sm" }: ThemeSwitcherProps) {
	const { currentTheme, presets, applyTheme, isHydrated } = useTheme();

	const handleThemeChange = useCallback(
		(preset: ThemePreset) => {
			applyTheme(preset);
		},
		[applyTheme]
	);

	const themeOptions = useMemo(() => {
		return Object.entries(presets).map(([preset, colors]) => {
			const themePreset = preset as ThemePreset;
			const isActive = currentTheme === preset;

			return {
				preset: themePreset,
				colors,
				isActive,
				label: getFormattedThemeName(preset)
			};
		});
	}, [presets, currentTheme]);

	if (!isHydrated) {
		return (
			<div className={cn("flex flex-wrap gap-2", className)}>
				{Object.keys(presets).map((preset) => (
					<Button
						key={preset}
						variant="outline"
						size={size}
						disabled
						className="relative overflow-hidden opacity-50"
					>
						<span className="capitalize">{getFormattedThemeName(preset)}</span>
					</Button>
				))}
			</div>
		);
	}

	return (
		<div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label="Theme selector">
			{themeOptions.map(({ preset, isActive, label }) => (
				<Button
					key={preset}
					variant={isActive ? "default" : "outline"}
					size={size}
					onClick={() => handleThemeChange(preset)}
					aria-pressed={isActive}
					aria-label={`Switch to ${label} theme`}
				>
					<span className="relative z-10">{showLabel ? label : ""}</span>
				</Button>
			))}
		</div>
	);
}
