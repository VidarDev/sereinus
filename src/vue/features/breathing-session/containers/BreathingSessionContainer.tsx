"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/vue/components/ui/button";
import { useBackgroundMusic } from "@/vue/hooks/useBackgroundMusic";
import { useBreathingProtocolsClean } from "@/vue/hooks/useBreathingProtocols";
import { useBreathingSession } from "@/vue/hooks/useBreathingSession";
import { useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { useSessionHistoryClean } from "@/vue/hooks/useSessionHistory";
import { cn } from "@/vue/lib/utils";
import { useAudioHaptic } from "@/vue/providers/audio-haptic.provider";
import { SessionAnimation } from "../components/SessionAnimation/SessionAnimation";
import { SessionCompletionModal } from "../components/SessionCompletionModal/SessionCompletionModal";
import { SessionControls } from "../components/SessionControls/SessionControls";
import type { BreathingSessionContainerProps, SessionCompletionData } from "../types/session.types";

export const BreathingSessionContainer = ({ className }: BreathingSessionContainerProps) => {
	const { selectedProtocol: selectedProtocolViewModel } = useBreathingProtocolsClean();
	const { shape } = useBreathingSVGShape();

	const {
		isActive,
		isPaused,
		currentPhase,
		cycleCount,
		totalTime,
		startSession,
		pauseSession,
		resumeSession,
		stopSession
		// @ts-expect-error - is not typed correctly
	} = useBreathingSession(selectedProtocolViewModel);

	const { soundEnabled, hapticEnabled, toggleSound, toggleHaptic } = useAudioHaptic();
	const { saveSession } = useSessionHistoryClean();

	const {
		play: startMusic,
		pause: pauseMusic,
		stop: stopMusic,
		isPlaying: isMusicPlaying,
		volume: musicVolume
	} = useBackgroundMusic();

	const [showCompletionModal, setShowCompletionModal] = useState(false);
	const [completionData, setCompletionData] = useState<SessionCompletionData | null>(null);

	const sessionMetrics = useMemo(() => {
		if (!selectedProtocolViewModel || totalTime === 0) {
			return {
				efficiency: 0,
				averageCycleTime: 0,
				completionRate: 0,
				totalDuration: "0s",
				cyclesPerMinute: 0
			};
		}

		const totalCycleDuration = selectedProtocolViewModel.pattern.reduce((sum, phase) => sum + phase, 0) * 1000;
		const expectedCycles = Math.floor(totalTime / totalCycleDuration);
		const efficiency = expectedCycles > 0 ? Math.min((cycleCount / expectedCycles) * 100, 100) : 0;
		const averageCycleTime = cycleCount > 0 ? totalTime / cycleCount : totalCycleDuration;
		const completionRate = expectedCycles > 0 ? (cycleCount / expectedCycles) * 100 : 0;

		const minutes = Math.floor(totalTime / 60000);
		const seconds = Math.floor((totalTime % 60000) / 1000);
		const totalDuration = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

		const cyclesPerMinute = totalTime > 0 ? cycleCount / (totalTime / 60000) : 0;

		return {
			efficiency,
			averageCycleTime,
			completionRate,
			totalDuration,
			cyclesPerMinute
		};
	}, [selectedProtocolViewModel, totalTime, cycleCount]);

	useEffect(() => {
		if (isActive && !isPaused && soundEnabled && !isMusicPlaying) {
			startMusic();
		} else if (isPaused && isMusicPlaying) {
			pauseMusic();
		} else if (!isActive && isMusicPlaying) {
			stopMusic();
		} else if (!soundEnabled && isMusicPlaying) {
			stopMusic();
		}
	}, [isActive, isPaused, soundEnabled, startMusic, stopMusic, pauseMusic, isMusicPlaying, musicVolume]);

	const handleSaveSession = useCallback(
		async (note?: string) => {
			if (!completionData || !selectedProtocolViewModel) return;

			try {
				await saveSession({
					duration: Math.floor(completionData.sessionData.duration / 1000), // Convertir en secondes
					protocolId: completionData.protocolId,
					protocolName: completionData.protocolName,
					cycleCount: completionData.sessionData.cycleCount,
					efficiency: completionData.metrics.efficiency,
					averageCycleTime: completionData.metrics.averageCycleTime,
					note: note?.trim()
				});
				setShowCompletionModal(false);
				setCompletionData(null);
			} catch (error) {
				console.error("Erreur lors de la sauvegarde:", error);
			}
		},
		[completionData, selectedProtocolViewModel, saveSession]
	);

	const handleStop = useCallback(() => {
		const sessionData = stopSession();
		if (sessionData && selectedProtocolViewModel) {
			const completion: SessionCompletionData = {
				sessionData,
				protocolId: selectedProtocolViewModel.id,
				protocolName: selectedProtocolViewModel.name,
				metrics: {
					efficiency: sessionMetrics.efficiency,
					averageCycleTime: sessionMetrics.averageCycleTime,
					completionRate: sessionMetrics.completionRate,
					totalDuration: sessionMetrics.totalDuration,
					cyclesPerMinute: sessionMetrics.cyclesPerMinute
				}
			};

			setCompletionData(completion);
			setShowCompletionModal(true);
		}
	}, [stopSession, selectedProtocolViewModel, sessionMetrics]);

	if (!selectedProtocolViewModel) {
		return (
			<div className="flex h-screen items-center justify-center overflow-hidden">
				<p className="text-muted-foreground">Aucun protocole sélectionné</p>
			</div>
		);
	}

	return (
		<div className={cn("relative flex h-screen flex-col overflow-hidden", className)}>
			{isActive && (
				<motion.div
					className="bg-background safe-area-inset-top fixed top-0 right-0 left-0 z-10"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
				>
					<div className="container mx-auto px-4 py-4">
						<div className="space-y-2 text-center">
							<motion.h1
								className="text-muted-foreground text-sm font-medium"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4, delay: 0.1 }}
							>
								{selectedProtocolViewModel.name}
							</motion.h1>
							<div className="space-y-1">
								<motion.div
									className="bg-primary text-primary-foreground my-4 inline-flex items-center rounded-full px-4 py-2 text-lg font-semibold"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
								>
									{sessionMetrics.totalDuration}
								</motion.div>
								<div className="flex items-center justify-center gap-2">
									<motion.div
										className="text-muted-foreground text-base font-medium"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.4, delay: 0.3 }}
									>
										Cycle {cycleCount}
									</motion.div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			)}

			<div className="flex flex-1 items-center justify-center px-4">
				<SessionAnimation
					phase={currentPhase}
					isActive={isActive}
					shape={shape}
					size={500}
					{...(isActive ? {} : { onClick: startSession })}
				/>
			</div>

			{!isActive && (
				<motion.div
					className="fixed bottom-8 left-1/2 flex w-full -translate-x-1/2 items-center gap-3 px-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
				>
					<motion.div
						className="flex-1"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
					>
						<Button onClick={startSession} size="lg" className="h-12 w-full px-8 text-lg font-medium">
							Lancer
						</Button>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
					>
						<Button size="lg" variant="outline" asChild className="h-12 w-12 p-0">
							<Link href="/app/settings">
								<Settings className="h-5 w-5" />
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			)}

			{isActive && (
				<SessionControls
					isActive={isActive}
					isPaused={isPaused}
					hapticEnabled={hapticEnabled}
					soundEnabled={soundEnabled}
					onPause={pauseSession}
					onResume={resumeSession}
					onStop={handleStop}
					onToggleHaptic={toggleHaptic}
					onToggleSound={toggleSound}
				/>
			)}

			{completionData && (
				<SessionCompletionModal
					isOpen={showCompletionModal}
					onClose={() => {
						setShowCompletionModal(false);
					}}
					completionData={completionData}
					onSave={handleSaveSession}
				/>
			)}
		</div>
	);
};

BreathingSessionContainer.displayName = "BreathingSessionContainer";
