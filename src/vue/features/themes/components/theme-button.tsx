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
	<div className="relative">
		<Button
			className={cn(
				"h-10 min-w-16 transition-all duration-200",
				isActive ? "ring-primary ring-offset-background scale-110 ring-2 ring-offset-2" : "hover:scale-105",
				className
			)}
			variant="outline"
			style={{
				backgroundColor: color,
				borderColor: isActive ? color : undefined,
				borderWidth: isActive ? "2px" : "1px"
			}}
			onClick={() => {
				onSelect(name);
			}}
			aria-label={`Sélectionner le thème ${displayName}`}
			aria-pressed={isActive}
			type="button"
		/>
		{isActive && (
			<div className="bg-primary border-background absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full border-2" />
		)}
	</div>
));

ThemeButton.displayName = "ThemeButton";
