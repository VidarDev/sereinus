"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

import { BreathingProtocol } from "@/main/domain/BreathingProtocol";
import { Badge } from "@/vue/components/ui/badge";
import { Button } from "@/vue/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vue/components/ui/card";
import { useBreathingProtocolsClean } from "@/vue/hooks/useBreathingProtocolsClean";
import { useBreathingSession } from "@/vue/hooks/useBreathingSession";
import { useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import BreathingSessionControls from "./breathing-session-controls";
import { BreathingSVG } from "./breathing-svg";
import SessionCompletionModal from "./session-completion-modal";
import SessionHeader from "./session-header";

interface BreathingExerciseProps {
	className?: string;
}

export function BreathingExercise({ className }: BreathingExerciseProps) {
	const { selectedProtocol, isLoading } = useBreathingProtocolsClean();
	const [showCompletionModal, setShowCompletionModal] = useState(false);
	const [sessionStartTime, setSessionStartTime] = useState<number>(0);
	const { shape } = useBreathingSVGShape();

	// Créer une instance BreathingProtocol pour le hook (toujours appelé)
	const sessionProtocol = selectedProtocol
		? new BreathingProtocol(
				selectedProtocol.id,
				selectedProtocol.name,
				selectedProtocol.description,
				{
					inhale: selectedProtocol.phases.inhale || 4,
					hold1: selectedProtocol.phases.hold1,
					exhale: selectedProtocol.phases.exhale || 4,
					hold2: selectedProtocol.phases.hold2
				},
				selectedProtocol.isScientificallyValidated
			)
		: new BreathingProtocol(
				"default",
				"Respiration par défaut",
				"Exercice de base",
				{ inhale: 4, exhale: 4 },
				false
			);

	// Toujours appeler le hook pour respecter les règles React
	const sessionHook = useBreathingSession(sessionProtocol);

	const {
		isActive,
		isPaused,
		currentPhase,
		cycleCount,
		totalTime,
		settings,
		startSession,
		pauseSession,
		resumeSession,
		stopSession,
		updateSettings
	} = sessionHook;

	const handleStart = () => {
		if (!selectedProtocol) return;
		setSessionStartTime(Date.now());
		startSession();
	};

	const handleStop = () => {
		const sessionData = stopSession();
		if (sessionData) {
			setShowCompletionModal(true);
		}
	};

	const handleToggleHaptic = () => {
		updateSettings({ hapticEnabled: !settings.hapticEnabled });
	};

	const handleToggleSound = () => {
		updateSettings({ soundEnabled: !settings.soundEnabled });
	};

	const getPhaseInstruction = () => {
		switch (currentPhase) {
			case "inhale":
				return "Inspirez";
			case "hold1":
				return "Retenez";
			case "exhale":
				return "Expirez";
			case "hold2":
				return "Retenez";
			default:
				return "";
		}
	};

	const formatTime = (milliseconds: number): string => {
		const seconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	if (isLoading) {
		return (
			<Card className={className}>
				<CardContent className="flex items-center justify-center p-8">
					<div className="space-y-2 text-center">
						<div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
						<p className="text-muted-foreground text-sm">Chargement des programmes...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!selectedProtocol) {
		return (
			<Card className={className}>
				<CardHeader className="text-center">
					<CardTitle className="flex items-center justify-center gap-2">
						<Settings className="h-5 w-5" />
						Aucun Programme Sélectionné
					</CardTitle>
					<CardDescription>
						Choisissez un programme de respiration pour commencer votre parcours thérapeutique
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 text-center">
					<div className="space-y-3">
						<p className="text-muted-foreground text-sm">
							Configurez votre programme personnalisé selon vos objectifs : gestion de l&apos;anxiété,
							relaxation, méditation ou boost d&apos;énergie.
						</p>
						<Button asChild size="lg" className="w-full">
							<Link href="/app/settings/breathing-program">
								<Settings className="mr-2 h-4 w-4" />
								Choisir un Programme
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Phase d'accueil - session non démarrée
	if (!isActive && totalTime === 0) {
		return (
			<div className={`flex flex-1 flex-col items-center justify-center space-y-8 p-6 ${className}`}>
				<div className="space-y-4 text-center">
					<div className="mb-2 flex items-center justify-center gap-2">
						<h1 className="text-3xl font-bold">{selectedProtocol.name}</h1>
						{selectedProtocol.isScientificallyValidated && <Badge variant="secondary">Validé</Badge>}
					</div>
					<p className="text-muted-foreground max-w-md text-lg">{selectedProtocol.description}</p>
					<div className="text-muted-foreground space-y-1 text-sm">
						<p>
							<strong>Rythme :</strong> {selectedProtocol.phases.inhale}s inspiration
						</p>
						{selectedProtocol.phases.hold1 && <p>{selectedProtocol.phases.hold1}s rétention</p>}
						<p>{selectedProtocol.phases.exhale}s expiration</p>
						{selectedProtocol.phases.hold2 && <p>{selectedProtocol.phases.hold2}s pause</p>}
						<p>
							<strong>Durée par cycle :</strong> {selectedProtocol.totalCycleDuration}s
						</p>
					</div>
				</div>

				<BreathingSVG
					phase="idle"
					isActive={false}
					shape={shape}
					size={280}
					onClick={handleStart}
					className="animate-pulse cursor-pointer transition-transform hover:scale-105"
				/>

				<div className="space-y-4 text-center">
					<p className="text-muted-foreground">Cliquez sur la forme pour commencer votre exercice</p>
					<Button variant="outline" asChild>
						<Link href="/app/settings/breathing-program">
							<Settings className="mr-2 h-4 w-4" />
							Changer de Programme
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Session active avec animations complètes
	return (
		<div className={`flex flex-1 flex-col ${className}`}>
			{/* Header avec informations session */}
			<SessionHeader
				isActive={isActive}
				isPaused={isPaused}
				startTime={sessionStartTime}
				cycleCount={cycleCount}
				currentPhase={currentPhase}
			/>

			{/* SVG principal avec animations */}
			<div className="flex flex-1 items-center justify-center p-8">
				<div className="space-y-6 text-center">
					<BreathingSVG phase={currentPhase} isActive={isActive && !isPaused} shape={shape} size={320} />

					<div className="space-y-2">
						<p className="text-3xl font-semibold capitalize">{getPhaseInstruction()}</p>
						<p className="text-muted-foreground text-lg">
							Cycle {cycleCount} • {formatTime(totalTime)}
						</p>
						<div className="text-muted-foreground text-sm">
							{selectedProtocol.name} • {selectedProtocol.phases.inhale}
							{selectedProtocol.phases.hold1 ? `-${selectedProtocol.phases.hold1}` : ""}-
							{selectedProtocol.phases.exhale}
							{selectedProtocol.phases.hold2 ? `-${selectedProtocol.phases.hold2}` : ""}
						</div>
					</div>
				</div>
			</div>

			{/* Contrôles */}
			<BreathingSessionControls
				isActive={isActive}
				isPaused={isPaused}
				hapticEnabled={settings.hapticEnabled}
				soundEnabled={settings.soundEnabled}
				onPause={pauseSession}
				onResume={resumeSession}
				onStop={handleStop}
				onToggleHaptic={handleToggleHaptic}
				onToggleSound={handleToggleSound}
			/>

			{/* Modal de fin */}
			{showCompletionModal && (
				<SessionCompletionModal
					isOpen={showCompletionModal}
					onClose={() => setShowCompletionModal(false)}
					sessionDuration={Math.floor(totalTime / 1000)}
					protocolName={selectedProtocol.name}
					cycleCount={cycleCount}
				/>
			)}
		</div>
	);
}
