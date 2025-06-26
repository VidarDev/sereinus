"use client";

import { memo } from "react";

import { ThemeSelector } from "@/vue/features/themes";
import type { ThemeName } from "../../types/settings.types";

interface ThemeSectionProps {
	currentTheme: ThemeName;
	error?: string;
	className?: string;
}

export const ThemeSection = memo<ThemeSectionProps>(({ currentTheme, error, className }) => {
	return (
		<div className={className}>
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-medium">Thème de couleur</h3>
						<p className="text-muted-foreground text-xs">
							Personnalisez l&apos;apparence de l&apos;application
						</p>
					</div>
					{currentTheme && <div className="text-muted-foreground text-xs capitalize">{currentTheme}</div>}
				</div>

				<div className="space-y-2">
					<ThemeSelector className="justify-start" />
					{error && (
						<p className="text-destructive text-xs" role="alert">
							{error}
						</p>
					)}
				</div>
			</div>
		</div>
	);
});

ThemeSection.displayName = "ThemeSection";
