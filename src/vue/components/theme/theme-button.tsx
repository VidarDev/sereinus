"use client";

import { memo } from "react";

import { Button } from "@/vue/components/ui/button";
import type { ThemeName } from "@/vue/constants/themes";
import { cn } from "@/vue/lib/utils";

interface ThemeButtonProps {
	name: ThemeName;
	displayName: string;
	color: string;
	isActive: boolean;
	onSelect: (name: ThemeName) => void;
	className?: string;
}

export const ThemeButton = memo<ThemeButtonProps>(({ name, displayName, color, isActive, onSelect, className }) => (
	<Button
		className={cn("min-w-16", isActive ? "scale-110" : "", className)}
		variant={isActive ? "default" : "outline"}
		style={{ backgroundColor: color }}
		onClick={() => onSelect(name)}
		aria-label={`Sélectionner le thème ${displayName}`}
		aria-pressed={isActive}
		type="button"
	/>
));

ThemeButton.displayName = "ThemeButton";
