"use client";

import { Circle } from "@/vue/components/SVG/circle";
import { Drop } from "@/vue/components/SVG/drop";
import { Button } from "@/vue/components/ui/button";
import { type SVGShape, useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { cn } from "@/vue/lib/utils";

interface SVGShapeSelectorProps {
	className?: string;
}

export function SVGShapeSelector({ className }: SVGShapeSelectorProps) {
	const { shape, setShape } = useBreathingSVGShape();

	const shapes: {
		id: SVGShape;
		label: string;
		component: React.ComponentType<{ className?: string; color?: string }>;
	}[] = [
		{ id: "circle", label: "Cercles", component: Circle },
		{ id: "drop", label: "Goutte", component: Drop }
	];

	return (
		<div className={cn("space-y-3", className)}>
			<h3 className="text-sm font-medium">Forme de l&apos;animation</h3>
			<div className="grid grid-cols-2 gap-3">
				{shapes.map((shapeOption) => {
					const SVGComponent = shapeOption.component;
					const isSelected = shape === shapeOption.id;

					return (
						<Button
							key={shapeOption.id}
							variant={isSelected ? "default" : "outline"}
							className={cn(
								"h-auto flex-col gap-3 p-4 transition-all",
								isSelected && "ring-primary ring-2 ring-offset-2"
							)}
							onClick={() => setShape(shapeOption.id)}
						>
							<div className="h-16 w-16">
								<SVGComponent
									color={isSelected ? "#ffffff" : "#7B68EE"}
									className="h-full w-full opacity-60"
								/>
							</div>
							<span className="text-xs">{shapeOption.label}</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
