"use client";

import { useState } from "react";
import { Award, Clock, Target, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/vue/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/vue/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/vue/components/ui/dialog";
import type { SessionCompletionModalProps } from "../../types/session.types";

export const SessionCompletionModal = ({ isOpen, onClose, completionData, onSave }: SessionCompletionModalProps) => {
	const [note, setNote] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const { sessionData, metrics, protocolName } = completionData;

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await onSave(note.trim() || undefined);
			toast.success("La session a été sauvegardée avec succès");
			onClose();
		} catch (error) {
			console.error("Erreur lors de la sauvegarde:", error);
			toast.error("Une erreur est survenue lors de la sauvegarde de votre session.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md" disableAutoFocus>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Award className="text-primary h-5 w-5" />
						Session terminée !
					</DialogTitle>
					<DialogDescription>Félicitations ! Voici un résumé de votre session.</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-muted-foreground text-sm font-medium">{protocolName}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-4 gap-4">
								<div className="flex flex-col items-center space-y-1 text-center">
									<Clock className="text-muted-foreground h-4 w-4" />
									<span className="text-muted-foreground text-xs">Durée</span>
									<span className="text-sm font-semibold">{metrics.totalDuration}</span>
								</div>

								<div className="flex flex-col items-center space-y-1 text-center">
									<Zap className="text-muted-foreground h-4 w-4" />
									<span className="text-muted-foreground text-xs">Cycles</span>
									<span className="text-sm font-semibold">{sessionData.cycleCount}</span>
								</div>

								<div className="flex flex-col items-center space-y-1 text-center">
									<TrendingUp className="text-muted-foreground h-4 w-4" />
									<span className="text-muted-foreground text-xs">Rythme</span>
									<span className="text-sm font-semibold">
										{metrics.cyclesPerMinute.toFixed(1)}/min
									</span>
								</div>

								<div className="flex flex-col items-center space-y-1 text-center">
									<Target className="text-muted-foreground h-4 w-4" />
									<span className="text-muted-foreground text-xs">Moyenne</span>
									<span className="text-sm font-semibold">
										{Math.round(metrics.averageCycleTime / 1000)}s
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="space-y-2">
						<label className="text-sm font-medium">Note personnelle (optionnelle)</label>
						<textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Comment vous êtes-vous senti pendant cette session ?"
							className="border-border focus:ring-primary/20 mt-2 min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
							maxLength={500}
						/>
						<div className="text-muted-foreground flex justify-between text-xs">
							<span>Décrivez votre ressenti, votre état d&apos;esprit...</span>
							<span>{note.length}/500</span>
						</div>
					</div>

					<div className="flex gap-2">
						<Button variant="outline" onClick={onClose} className="flex-1" disabled={isSaving}>
							Ignorer
						</Button>
						<Button onClick={handleSave} className="flex-1" disabled={isSaving}>
							{isSaving ? "Sauvegarde..." : "Sauvegarder"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
