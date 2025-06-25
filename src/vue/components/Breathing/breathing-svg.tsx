"use client";

import { Circle } from "@/vue/components/SVG/circle";
import { Drop } from "@/vue/components/SVG/drop";
import type { SVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { cn } from "@/vue/lib/utils";

export type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2" | "idle";

interface BreathingSVGProps {
	phase: BreathingPhase;
	isActive: boolean;
	shape?: SVGShape;
	className?: string;
	onClick?: () => void;
	size?: number;
}

const phaseConfig = {
	inhale: {
		color: "#7B68EE",
		scale: "scale-110",
		opacity: "opacity-90",
		animation: "animate-pulse"
	},
	hold1: {
		color: "#FFB74D",
		scale: "scale-110",
		opacity: "opacity-80",
		animation: ""
	},
	exhale: {
		color: "#4ECDC4",
		scale: "scale-90",
		opacity: "opacity-70",
		animation: ""
	},
	hold2: {
		color: "#FFB74D",
		scale: "scale-90",
		opacity: "opacity-60",
		animation: ""
	},
	idle: {
		color: "#d6e6f2",
		scale: "scale-100",
		opacity: "opacity-50",
		animation: ""
	}
} as const;

export function BreathingSVG({ phase, isActive, shape = "circle", className, onClick, size = 320 }: BreathingSVGProps) {
	const config = phaseConfig[phase];
	const SVGComponent = shape === "drop" ? Drop : Circle;

	const getAnimationClasses = () => {
		if (!isActive && phase !== "idle") return "opacity-60";

		const baseClasses = `${config.scale} ${config.opacity} ${config.animation}`;
		return baseClasses;
	};

	return (
		<div
			className={cn(
				"flex items-center justify-center transition-all duration-1000 ease-in-out",
				onClick && "cursor-pointer hover:scale-105",
				className
			)}
			onClick={onClick}
			style={{ width: size, height: size }}
		>
			<SVGComponent
				color={config.color}
				className={cn("transition-all duration-1000 ease-in-out", getAnimationClasses())}
			/>
		</div>
	);
}
