"use client";

import { useState } from "react";
import { Calendar, Clock, Edit3, Eye, LineChart, Trash2, TrendingUp, Zap } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vue/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/vue/components/ui/dialog";
import type { SavedSessionData } from "@/vue/features/settings/types/history.types";
import { useSessionHistory } from "@/vue/hooks/useSessionHistory";
import { cn } from "@/vue/lib/utils";

interface HistorySectionProps {
	className?: string;
}

export const HistorySection = ({ className }: HistorySectionProps) => {
	const { sessions, isLoading, getStats, deleteSession, updateSessionNote } = useSessionHistory();
	const [editingSession, setEditingSession] = useState<SavedSessionData | null>(null);
	const [viewingSession, setViewingSession] = useState<SavedSessionData | null>(null);
	const [editNote, setEditNote] = useState("");

	const stats = getStats();
	const recentSessions = sessions.slice(0, 10);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("fr-FR", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit"
		}).format(date);
	};

	const formatFullDate = (date: Date) => {
		return new Intl.DateTimeFormat("fr-FR", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}).format(date);
	};

	const handleEditNote = (session: SavedSessionData) => {
		setEditingSession(session);
		setEditNote(session.note || "");
	};

	const handleViewNote = (session: SavedSessionData) => {
		setViewingSession(session);
	};

	const handleSaveNote = () => {
		if (editingSession) {
			updateSessionNote(editingSession.id, editNote);
			setEditingSession(null);
			setEditNote("");
		}
	};

	const handleDeleteSession = (sessionId: string) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) {
			deleteSession(sessionId);
		}
	};

	if (isLoading) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<LineChart className="h-5 w-5" />
						Historique des sessions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="py-8 text-center">
						<div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
						<p className="text-muted-foreground mt-2 text-sm">Chargement...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (sessions.length === 0) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<LineChart className="h-5 w-5" />
						Historique des sessions
					</CardTitle>
					<CardDescription>Aucune session trouvée</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="py-8 text-center">
						<Calendar className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
						<p className="text-muted-foreground text-sm">
							Commencez votre première session de respiration pour voir vos statistiques ici.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={cn("space-y-6", className)}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Aperçu
					</CardTitle>
					<CardDescription>Vos statistiques générales</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div className="text-center">
							<div className="text-primary text-2xl font-bold">{stats.totalSessions}</div>
							<div className="text-muted-foreground text-xs">Sessions</div>
						</div>
						<div className="text-center">
							<div className="text-primary text-2xl font-bold">{formatDuration(stats.totalDuration)}</div>
							<div className="text-muted-foreground text-xs">Temps total</div>
						</div>
						{/* <div className="text-center">
							<div className="text-primary text-2xl font-bold">
								{Math.round(stats.averageEfficiency)}%
							</div>
							<div className="text-muted-foreground text-xs">Efficacité moy.</div>
						</div>
						<div className="text-center">
							<div className="text-primary text-2xl font-bold">{stats.currentStreak}</div>
							<div className="text-muted-foreground text-xs">Série actuelle</div>
						</div> */}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Sessions récentes
					</CardTitle>
					<CardDescription>Vos 10 dernières sessions</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{recentSessions.map((session) => (
							<div
								key={session.id}
								className="border-border hover:bg-muted/50 rounded-lg border p-3 transition-colors"
							>
								<div className="mb-3 flex items-start justify-between">
									<div className="min-w-0 flex-1">
										<h3 className="text-md truncate font-medium">{session.protocolName}</h3>
										<p className="text-muted-foreground mt-1 text-sm">
											{formatDate(session.completedAt)}
										</p>
									</div>
									<div className="ml-2 flex items-center gap-1">
										{session.note && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleViewNote(session)}
												className="h-8 w-8 p-0"
											>
												<Eye className="h-3 w-3" />
											</Button>
										)}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEditNote(session)}
											className="h-8 w-8 p-0"
										>
											<Edit3 className="h-3 w-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDeleteSession(session.id)}
											className="h-8 w-8 p-0"
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="flex items-center gap-1">
										<Clock className="text-muted-foreground h-3 w-3" />
										<span className="text-muted-foreground">Durée:</span>
										<span className="font-medium">{formatDuration(session.duration)}</span>
									</div>
									<div className="flex items-center gap-1">
										<Zap className="text-muted-foreground h-3 w-3" />
										<span className="text-muted-foreground">Cycles:</span>
										<span className="font-medium">{session.cycleCount}</span>
									</div>
								</div>

								{session.note && (
									<div className="border-border mt-3 border-t pt-2">
										<p className="text-muted-foreground line-clamp-2 text-sm">
											<span className="font-medium">Note:</span> {session.note}
										</p>
									</div>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Modal details */}
			<Dialog open={!!viewingSession} onOpenChange={() => setViewingSession(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Note de session</DialogTitle>
						<DialogDescription>
							{viewingSession?.protocolName} -{" "}
							{viewingSession && formatFullDate(viewingSession.completedAt)}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="bg-muted/50 rounded-lg p-3">
							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<span className="text-muted-foreground">Durée:</span>
									<div className="font-medium">
										{viewingSession && formatDuration(viewingSession.duration)}
									</div>
								</div>
								<div>
									<span className="text-muted-foreground">Cycles:</span>
									<div className="font-medium">{viewingSession?.cycleCount}</div>
								</div>
							</div>
						</div>

						<div>
							<h4 className="mb-2 text-sm font-medium">Votre note:</h4>
							<div className="bg-background border-border min-h-[80px] rounded-md border p-3">
								<p className="text-sm whitespace-pre-wrap">
									{viewingSession?.note || "Aucune note pour cette session."}
								</p>
							</div>
						</div>

						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setViewingSession(null)} className="flex-1">
								Fermer
							</Button>
							<Button
								onClick={() => {
									setViewingSession(null);
									if (viewingSession) handleEditNote(viewingSession);
								}}
								className="flex-1"
							>
								Modifier
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Modal edit */}
			<Dialog open={!!editingSession} onOpenChange={() => setEditingSession(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Modifier la note</DialogTitle>
						<DialogDescription>
							{editingSession?.protocolName} - {editingSession && formatDate(editingSession.completedAt)}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<textarea
							value={editNote}
							onChange={(e) => setEditNote(e.target.value)}
							placeholder="Ajoutez une note à cette session..."
							className="border-border focus:ring-primary/20 min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
							maxLength={500}
						/>
						<div className="text-muted-foreground flex justify-between text-xs">
							<span>Décrivez votre ressenti pendant cette session</span>
							<span>{editNote.length}/500</span>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setEditingSession(null)} className="flex-1">
								Annuler
							</Button>
							<Button onClick={handleSaveNote} className="flex-1">
								Sauvegarder
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
