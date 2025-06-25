"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/vue/components/ui/button";
import { useBreathingProtocolsClean } from "@/vue/hooks/useBreathingProtocolsClean";
import { useBreathingSession } from "@/vue/hooks/useBreathingSession";
import { useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { useSessionHistory } from "@/vue/hooks/useSessionHistory";
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
	const { saveSession } = useSessionHistory();

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

		const totalCycleDuration = selectedProtocolViewModel.totalCycleDuration * 1000;
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

	const handleSaveSession = useCallback(
		async (note?: string) => {
			if (completionData) {
				await saveSession(completionData, note);
				setShowCompletionModal(false);
				setCompletionData(null);
			}
		},
		[completionData, saveSession]
	);

	const handleStop = useCallback(() => {
		const sessionTimeAtStop = totalTime;
		const sessionCyclesAtStop = cycleCount;

		const sessionData = stopSession();

		if (sessionData && sessionTimeAtStop >= 10000) {
			const completionData: SessionCompletionData = {
				sessionData,
				metrics: {
					efficiency:
						sessionCyclesAtStop > 0
							? Math.min((sessionCyclesAtStop / Math.floor(sessionTimeAtStop / 16000)) * 100, 100)
							: 0,
					averageCycleTime: sessionCyclesAtStop > 0 ? sessionTimeAtStop / sessionCyclesAtStop : 16000,
					completionRate: 100,
					totalDuration: `${Math.floor(sessionTimeAtStop / 60000)}m ${Math.floor((sessionTimeAtStop % 60000) / 1000)}s`,
					cyclesPerMinute: sessionTimeAtStop > 0 ? sessionCyclesAtStop / (sessionTimeAtStop / 60000) : 0
				},
				protocolName: selectedProtocolViewModel?.name || "Session",
				protocolId: selectedProtocolViewModel?.id || "unknown"
			};

			setCompletionData(completionData);
			setShowCompletionModal(true);
		}
	}, [stopSession, totalTime, cycleCount, selectedProtocolViewModel, setCompletionData, setShowCompletionModal]);

	if (!selectedProtocolViewModel) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center text-center">
				<div>
					<h3 className="mb-2 text-lg font-semibold">Aucun protocole sélectionné</h3>
					<p className="text-muted-foreground">
						Veuillez sélectionner un protocole de respiration dans les paramètres.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("relative min-h-screen", className)}>
			{isActive && (
				<motion.div
					className="bg-background fixed top-0 right-0 left-0 z-10"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
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

			<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center px-4">
				<SessionAnimation
					phase={currentPhase}
					isActive={isActive}
					shape={shape}
					size={500}
					{...(isActive ? {} : { onClick: startSession })}
				/>
			</div>

			{!isActive && (
				<div className="fixed bottom-8 left-1/2 flex w-full -translate-x-1/2 items-center gap-3 px-4">
					<Button onClick={startSession} size="lg" className="h-12 flex-1 px-8 text-lg font-medium">
						Lancer
					</Button>
					<Button size="lg" variant="outline" asChild className="h-12 w-12 p-0">
						<Link href="/app/settings">
							<Settings className="h-5 w-5" />
						</Link>
					</Button>
				</div>
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
