"use client";

import { memo } from "react";

import { Circle } from "@/vue/components/svg/circle";
import { Drop } from "@/vue/components/svg/drop";
import { useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { cn } from "@/vue/lib/utils";
import type { SVGShape } from "../../types/settings.types";

interface ShapeSectionProps {
	currentShape: SVGShape;
	error?: string;
	className?: string;
}

const shapes: { value: SVGShape; label: string; Icon: typeof Circle }[] = [
	{ value: "circle", label: "Cercle", Icon: Circle },
	{ value: "drop", label: "Goutte", Icon: Drop }
];

export const ShapeSection = memo<ShapeSectionProps>(({ currentShape, error, className }) => {
	const { setShape } = useBreathingSVGShape();

	return (
		<div className={className}>
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-medium">Forme d&apos;animation</h3>
						<p className="text-muted-foreground text-xs">
							Choisissez la forme pour vos exercices de respiration
						</p>
					</div>
					{currentShape && (
						<div className="text-muted-foreground text-xs capitalize">
							{currentShape === "circle" ? "Cercle" : "Goutte"}
						</div>
					)}
				</div>

				<div className="space-y-2">
					<div className="grid grid-cols-2 gap-3">
						{shapes.map(({ value, label, Icon }) => (
							<button
								key={value}
								onClick={() => setShape(value)}
								className={cn(
									"hover:bg-muted/50 flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
									currentShape === value
										? "border-primary bg-primary/5 text-primary"
										: "border-border bg-background"
								)}
							>
								<Icon className="h-8 w-8" color="currentColor" />
								<span className="text-xs font-medium">{label}</span>
							</button>
						))}
					</div>
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

ShapeSection.displayName = "ShapeSection";
