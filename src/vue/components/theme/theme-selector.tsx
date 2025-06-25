"use client";

import { memo, Suspense, useCallback } from "react";

import type { ThemeName } from "@/vue/constants/themes";
import { useTheme } from "@/vue/hooks/useTheme";
import { cn } from "@/vue/lib/utils";
import { ThemeButton } from "./theme-button";

interface ThemeSelectorProps {
	className?: string;
}

const ThemeSelectorContent = memo<ThemeSelectorProps>(({ className }) => {
	const { theme, setTheme, themes, isLoading } = useTheme();

	const handleThemeChange = useCallback(
		(themeName: ThemeName) => {
			setTheme(themeName);
		},
		[setTheme]
	);

	if (isLoading) {
		return (
			<div className={cn("flex gap-2", className)} role="group" aria-label="Selecteur de thème">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="bg-muted h-[36px] w-[64px] animate-pulse rounded-md" aria-hidden="true" />
				))}
			</div>
		);
	}

	return (
		<div className={cn("flex gap-2", className)} role="group" aria-label="Selecteur de thème">
			{themes.map(({ name, displayName, primaryColor }) => (
				<ThemeButton
					key={name}
					name={name}
					displayName={displayName}
					color={primaryColor}
					isActive={theme === name}
					onSelect={handleThemeChange}
				/>
			))}
		</div>
	);
});

ThemeSelectorContent.displayName = "ThemeSelectorContent";

export const ThemeSelector = memo<ThemeSelectorProps>(({ className }) => (
	<Suspense
		fallback={
			<div className={cn("flex gap-2", className)} role="group" aria-label="Selecteur de thème">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="bg-muted h-[36px] w-[64px] animate-pulse rounded-md" aria-hidden="true" />
				))}
			</div>
		}
	>
		<ThemeSelectorContent className={className} />
	</Suspense>
));

ThemeSelector.displayName = "ThemeSelector";
