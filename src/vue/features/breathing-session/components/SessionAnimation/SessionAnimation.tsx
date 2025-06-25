"use client";

import { memo, useEffect, useState } from "react";

import { Circle } from "@/vue/components/svg/circle";
import { Drop } from "@/vue/components/svg/drop";
import { cn } from "@/vue/lib/utils";
import type { BreathingPhase, SessionAnimationProps } from "../../types/session.types";

const SHAPE_COMPONENTS = {
	circle: Circle,
	drop: Drop
} as const;

const PHASE_CONFIG = {
	inhale: {
		scale: 1.25,
		color: "#3B82F6",
		duration: 4000,
		instruction: "Inspirez profondément"
	},
	hold1: {
		scale: 1.25,
		color: "#F59E0B",
		duration: 500,
		instruction: "Retenez votre respiration"
	},
	exhale: {
		scale: 0.75,
		color: "#10B981",
		duration: 6000,
		instruction: "Expirez lentement"
	},
	hold2: {
		scale: 0.75,
		color: "#8B5CF6",
		duration: 500,
		instruction: "Restez détendu"
	},
	idle: {
		scale: 1.0,
		color: "#6B7280",
		duration: 1000,
		instruction: "Prêt à commencer"
	}
};

export const SessionAnimation = memo<SessionAnimationProps>(
	({ phase, isActive, shape, size = 200, onClick, className }) => {
		const [currentPhase, setCurrentPhase] = useState<BreathingPhase>(phase);
		const ShapeComponent = SHAPE_COMPONENTS[shape];
		const hasInteraction = Boolean(onClick);
		const phaseConfig = PHASE_CONFIG[currentPhase];

		useEffect(() => {
			if (phase !== currentPhase) {
				setCurrentPhase(phase);
			}
		}, [phase, currentPhase]);

		const shouldPulse = !isActive && currentPhase === "idle";

		const maxScreenSize =
			typeof window !== "undefined" ? Math.min(window.innerWidth, window.innerHeight) * 0.8 : size;

		const effectiveSize = Math.min(size, maxScreenSize);

		const transformStyle = {
			transform: `scale(${phaseConfig.scale})`,
			transition: `transform ${phaseConfig.duration}ms ease-in-out`,
			filter: isActive ? `drop-shadow(0 0 20px ${phaseConfig.color}40)` : "none"
		};

		return (
			<div
				className={cn(
					"relative flex w-full max-w-full flex-col items-center justify-center space-y-4",
					hasInteraction &&
						"focus:ring-primary cursor-pointer rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none",
					className
				)}
				style={{ maxWidth: effectiveSize, height: effectiveSize + 80 }}
				onClick={onClick}
				role={hasInteraction ? "button" : undefined}
				tabIndex={hasInteraction ? 0 : undefined}
				aria-label={hasInteraction ? "Démarrer la session de respiration" : undefined}
				onKeyDown={
					hasInteraction
						? (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onClick?.();
								}
							}
						: undefined
				}
			>
				<div
					className={cn(
						"relative flex items-center justify-center",
						shouldPulse && "animate-pulse",
						hasInteraction && "transition-transform duration-200 hover:scale-105 active:scale-95"
					)}
					style={{
						width: effectiveSize * 0.8,
						height: effectiveSize * 0.8,
						maxWidth: "100%",
						...transformStyle
					}}
				>
					<ShapeComponent
						className={cn(
							"h-full max-h-full w-full max-w-full transition-all duration-500",
							isActive ? "opacity-100" : "opacity-60"
						)}
						color={phaseConfig.color}
					/>

					{isActive && currentPhase !== "idle" && (
						<div
							className={cn(
								"pointer-events-none absolute inset-0 rounded-full",
								currentPhase === "inhale" || currentPhase === "exhale"
									? "animate-pulse duration-2000"
									: ""
							)}
						/>
					)}
				</div>

				<div className="flex min-h-[80px] w-full max-w-full flex-col justify-center space-y-3 text-center">
					{isActive && (
						<>
							<div className="flex justify-center">
								<div
									className={cn(
										"w-fit rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
										"bg-background/80 border shadow-sm backdrop-blur-sm"
									)}
									style={{
										borderColor: phaseConfig.color + "40",
										color: phaseConfig.color
									}}
								>
									{phaseConfig.instruction}
								</div>
							</div>

							{(currentPhase === "inhale" || currentPhase === "exhale") && (
								<div className="flex justify-center">
									<div className="flex space-x-1">
										{[...Array(3)].map((_, i) => (
											<div
												key={i}
												className={cn(
													"h-2 w-2 rounded-full transition-all duration-500",
													i === 0
														? "animate-pulse"
														: i === 1
															? "animate-pulse delay-200"
															: "animate-pulse delay-400"
												)}
												style={{
													backgroundColor: phaseConfig.color,
													opacity: 0.6 + i * 0.2
												}}
											/>
										))}
									</div>
								</div>
							)}
						</>
					)}

					{hasInteraction && !isActive && (
						<div className="animate-in fade-in text-center delay-1000 duration-500">
							<p className="text-muted-foreground mb-2 text-sm">{phaseConfig.instruction}</p>
							<p className="text-muted-foreground text-xs">Cliquez pour commencer</p>
						</div>
					)}
				</div>
			</div>
		);
	}
);

SessionAnimation.displayName = "SessionAnimation";
