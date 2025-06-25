"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/vue/components/ui/button";
import { Card } from "@/vue/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/vue/components/ui/dialog";
import type { SessionData } from "@/vue/hooks/useBreathingSession";
import { useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { saveBreathingSession, saveBreathingSessionWithMetadata } from "./actions";

interface SessionCompletionModalProps {
	isOpen: boolean;
	onClose: () => void;
	sessionDuration: number; // en secondes (legacy)
	protocolName: string;
	cycleCount: number;
	// Nouvelles props pour la version enrichie
	sessionData?: SessionData;
	protocolId?: string;
}

export const SessionCompletionModal: React.FC<SessionCompletionModalProps> = ({
	isOpen,
	onClose,
	sessionDuration,
	protocolName,
	cycleCount,
	sessionData,
	protocolId
}) => {
	const [note, setNote] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const { shape } = useBreathingSVGShape();

	const formatDuration = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	const handleSave = async () => {
		setIsSaving(true);

		try {
			let result;

			// Utiliser la nouvelle fonction enrichie si on a sessionData
			if (sessionData) {
				result = await saveBreathingSessionWithMetadata({
					protocolName,
					protocolId,
					sessionData,
					svgShape: shape,
					note: note.trim() || undefined
				});
			} else {
				// Fallback vers l'ancienne méthode
				result = await saveBreathingSession(sessionDuration, note.trim() || undefined);
			}

			if (result === true) {
				toast.success("Session de respiration enregistrée !");
				onClose();
			} else {
				toast.error(typeof result === "string" ? result : "Erreur lors de l'enregistrement");
			}
		} catch (error) {
			toast.error("Erreur lors de l'enregistrement");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleSkip = async () => {
		setIsSaving(true);

		try {
			let result;

			// Utiliser la nouvelle fonction enrichie si on a sessionData
			if (sessionData) {
				result = await saveBreathingSessionWithMetadata({
					protocolName,
					protocolId,
					sessionData,
					svgShape: shape,
					note: undefined
				});
			} else {
				// Fallback vers l'ancienne méthode
				result = await saveBreathingSession(sessionDuration, undefined);
			}

			if (result === true) {
				toast.success("Session de respiration enregistrée !");
				onClose();
			} else {
				toast.error(typeof result === "string" ? result : "Erreur lors de l'enregistrement");
			}
		} catch (error) {
			toast.error("Erreur lors de l'enregistrement");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	// Utiliser sessionDuration ou calculer depuis sessionData
	const displayDuration = sessionData ? Math.floor(sessionData.duration / 1000) : sessionDuration;

	// Utiliser cycleCount passé en prop ou depuis sessionData
	const displayCycles = sessionData?.cycleCount || cycleCount;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<span className="text-green-600">✓</span>
						Session terminée !
					</DialogTitle>
					<DialogDescription>
						Félicitations ! Vous avez terminé votre exercice de respiration.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Résumé de la session */}
					<Card className="bg-muted/50 p-4">
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Protocole :</span>
								<span className="font-medium">{protocolName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Durée :</span>
								<span className="font-medium">{formatDuration(displayDuration)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Cycles :</span>
								<span className="font-medium">{displayCycles}</span>
							</div>
							{sessionData && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Forme :</span>
									<span className="font-medium">{shape === "circle" ? "Cercle" : "Goutte"}</span>
								</div>
							)}
						</div>
					</Card>

					{/* Zone de saisie de note */}
					<div className="space-y-2">
						<label htmlFor="session-note" className="text-sm font-medium">
							Ajouter une note (optionnel)
						</label>
						<textarea
							id="session-note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Comment vous sentez-vous après cet exercice ? Cette note vous aidera à suivre vos progrès..."
							className="border-input bg-background focus:ring-ring min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
							maxLength={500}
						/>
						<div className="text-muted-foreground text-right text-xs">{note.length}/500 caractères</div>
					</div>

					{/* Boutons d'action */}
					<div className="flex gap-2 pt-2">
						<Button onClick={handleSkip} variant="outline" disabled={isSaving} className="flex-1">
							Enregistrer sans note
						</Button>
						<Button onClick={handleSave} disabled={isSaving} className="flex-1">
							{isSaving ? "Enregistrement..." : "Enregistrer"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SessionCompletionModal;
