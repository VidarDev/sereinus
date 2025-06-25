"use client";

import { motion } from "framer-motion";
import { Pause, Play, Square, Vibrate, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { cn } from "@/vue/lib/utils";

interface BreathingSessionControlsProps {
	isActive: boolean;
	isPaused: boolean;
	hapticEnabled: boolean;
	soundEnabled: boolean;
	onPause: () => void;
	onResume: () => void;
	onStop: () => void;
	onToggleHaptic: () => void;
	onToggleSound: () => void;
	className?: string;
}

export const BreathingSessionControls: React.FC<BreathingSessionControlsProps> = ({
	isActive,
	isPaused,
	hapticEnabled,
	soundEnabled,
	onPause,
	onResume,
	onStop,
	onToggleHaptic,
	onToggleSound,
	className
}) => {
	if (!isActive) {
		return null;
	}

	return (
		<motion.div
			className={cn(
				"fixed bottom-6 left-1/2 -translate-x-1/2 transform",
				"bg-card/95 supports-[backdrop-filter]:bg-card/80 backdrop-blur-sm",
				"border-border/50 ring-border/20 border shadow-lg ring-1",
				"rounded-2xl p-4",
				"flex items-center gap-4",
				className
			)}
			initial={{ opacity: 0, y: 100, scale: 0.8 }}
			animate={{
				opacity: 1,
				y: 0,
				scale: 1,
				transition: {
					type: "spring",
					stiffness: 400,
					damping: 25,
					mass: 0.8
				}
			}}
			exit={{
				opacity: 0,
				y: 100,
				scale: 0.8,
				transition: {
					duration: 0.2,
					ease: "easeInOut"
				}
			}}
		>
			<motion.div
				className="flex items-center gap-2"
				initial={{ x: -20, opacity: 0 }}
				animate={{
					x: 0,
					opacity: 1,
					transition: { delay: 0.1, duration: 0.3 }
				}}
			>
				{!isPaused ? (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
					>
						<Button
							onClick={onPause}
							variant="outline"
							size="sm"
							className="hover:bg-muted/50 gap-2 transition-colors"
							aria-label="Mettre en pause"
						>
							<Pause className="h-4 w-4" />
							Pause
						</Button>
					</motion.div>
				) : (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
					>
						<Button
							onClick={onResume}
							variant="default"
							size="sm"
							className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 transition-colors"
							aria-label="Reprendre"
						>
							<Play className="h-4 w-4" />
							Reprendre
						</Button>
					</motion.div>
				)}

				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
				>
					<Button
						onClick={onStop}
						variant="destructive"
						size="sm"
						className="bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2 transition-colors"
						aria-label="Arrêter la session"
					>
						<Square className="h-4 w-4" />
						Arrêter
					</Button>
				</motion.div>
			</motion.div>

			{/* Séparateur */}
			<motion.div
				className="bg-border h-6 w-px"
				initial={{ scaleY: 0, opacity: 0 }}
				animate={{
					scaleY: 1,
					opacity: 1,
					transition: { delay: 0.4, duration: 0.3 }
				}}
			/>

			{/* Contrôles des paramètres */}
			<motion.div
				className="flex items-center gap-2"
				initial={{ x: 20, opacity: 0 }}
				animate={{
					x: 0,
					opacity: 1,
					transition: { delay: 0.5, duration: 0.3 }
				}}
			>
				<motion.div
					initial={{ scale: 0, rotate: -90 }}
					animate={{
						scale: 1,
						rotate: 0,
						transition: { delay: 0.6, type: "spring", stiffness: 300 }
					}}
				>
					<Button
						onClick={onToggleHaptic}
						variant={hapticEnabled ? "default" : "outline"}
						size="sm"
						className={cn(
							"gap-2 transition-all duration-200",
							hapticEnabled
								? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
								: "hover:bg-muted/50 border-border"
						)}
						aria-label={`${hapticEnabled ? "Désactiver" : "Activer"} les vibrations`}
					>
						<Vibrate className="h-4 w-4" />
						<span className="sr-only">Vibrations</span>
					</Button>
				</motion.div>

				<motion.div
					initial={{ scale: 0, rotate: 90 }}
					animate={{
						scale: 1,
						rotate: 0,
						transition: { delay: 0.7, type: "spring", stiffness: 300 }
					}}
				>
					<Button
						onClick={onToggleSound}
						variant={soundEnabled ? "default" : "outline"}
						size="sm"
						className={cn(
							"gap-2 transition-all duration-200",
							soundEnabled
								? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
								: "hover:bg-muted/50 border-border"
						)}
						aria-label={`${soundEnabled ? "Désactiver" : "Activer"} le son`}
					>
						{soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
						<span className="sr-only">Son</span>
					</Button>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default BreathingSessionControls;
