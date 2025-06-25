"use client";

import { useEffect, useState } from "react";

import { cn } from "@/vue/lib/utils";

type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2" | "idle";

interface SessionHeaderProps {
	isActive: boolean;
	isPaused: boolean;
	startTime: number;
	cycleCount: number;
	currentPhase: BreathingPhase;
	className?: string;
}

const getPhaseLabel = (phase: BreathingPhase): string => {
	switch (phase) {
		case "inhale":
			return "Inspirez";
		case "hold1":
			return "Retenez";
		case "exhale":
			return "Expirez";
		case "hold2":
			return "Retenez";
		case "idle":
			return "En attente";
		default:
			return "";
	}
};

export const SessionHeader: React.FC<SessionHeaderProps> = ({
	isActive,
	isPaused,
	startTime,
	cycleCount,
	currentPhase,
	className
}) => {
	const [elapsedTime, setElapsedTime] = useState(0);

	useEffect(() => {
		if (!isActive || isPaused) return;

		const interval = setInterval(() => {
			setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [isActive, isPaused, startTime]);

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	if (!isActive) return null;

	return (
		<div
			className={cn(
				"bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur",
				className
			)}
		>
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-center">
					<div className="flex items-center gap-6 text-sm">
						{/* Temps écoulé */}
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Temps :</span>
							<span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
						</div>

						{/* Séparateur */}
						<div className="bg-border h-4 w-px" />

						{/* Cycles */}
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Cycles :</span>
							<span className="font-medium">{cycleCount}</span>
						</div>

						{/* Séparateur */}
						<div className="bg-border h-4 w-px" />

						{/* Phase actuelle */}
						<div className="flex items-center gap-2">
							<div
								className={cn(
									"h-2 w-2 rounded-full",
									isPaused ? "bg-orange-500" : "animate-pulse bg-green-500"
								)}
							/>
							<span className="font-medium">{isPaused ? "En pause" : getPhaseLabel(currentPhase)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionHeader;
