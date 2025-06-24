"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useMemo } from "react";

import { BaseSwitcher } from "@/vue/components/theme-switcher-base";
import { useTheme } from "@/vue/providers/theme.provider";

interface ModeSwitcherProps {
	className?: string;
	showLabels?: boolean;
	size?: "sm" | "default" | "lg";
	variant?: "buttons" | "toggle";
}

export function ModeSwitcher({ className, showLabels = false, size = "sm", variant = "buttons" }: ModeSwitcherProps) {
	const { colorScheme, setColorScheme, systemScheme, isHydrated } = useTheme();

	const options = useMemo(
		() => [
			{
				value: "light" as const,
				label: "Light",
				icon: Sun,
				active: colorScheme === "light"
			},
			{
				value: "dark" as const,
				label: "Dark",
				icon: Moon,
				active: colorScheme === "dark"
			},
			{
				value: "auto" as const,
				label: `Auto`,
				icon: Monitor,
				active: colorScheme === "auto"
			}
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[colorScheme, systemScheme]
	);

	return (
		<BaseSwitcher
			options={options}
			onSelect={setColorScheme}
			className={className}
			showLabels={showLabels}
			size={size}
			variant={variant === "toggle" ? "toggle" : "palette"}
			isLoading={!isHydrated}
			aria-label="Color mode selector"
		/>
	);
}

// Hook for easier mode management
export function useModeSwitch() {
	const { colorScheme, setColorScheme, isDark, isAuto, systemScheme, hasSystemPreference } = useTheme();

	const toggleMode = () => {
		if (isAuto) {
			setColorScheme(systemScheme === "dark" ? "light" : "dark");
		} else {
			setColorScheme(isDark ? "light" : "dark");
		}
	};

	const setAutoMode = () => {
		setColorScheme("auto");
	};

	const setLightMode = () => {
		setColorScheme("light");
	};

	const setDarkMode = () => {
		setColorScheme("dark");
	};

	return {
		currentMode: colorScheme,
		isDark,
		isAuto,
		systemScheme,
		hasSystemPreference,
		toggleMode,
		setAutoMode,
		setLightMode,
		setDarkMode,
		setColorScheme
	};
}
