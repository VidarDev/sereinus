"use client";

import Link from "next/link";
import { Brain, CheckCircle, ChevronLeft, Clock, Heart, Loader2, Moon, Smile, Target, Zap } from "lucide-react";

import { Badge } from "@/vue/components/ui/badge";
import { Button } from "@/vue/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vue/components/ui/card";
import { type BreathingProtocolViewModel, useBreathingProtocolsClean } from "@/vue/hooks/useBreathingProtocolsClean";

const CATEGORY_ICONS = {
	ACUTE_ANXIETY: Heart,
	RELAXATION: Smile,
	MEDITATION: Brain,
	BEGINNER: Heart,
	DAILY_PRACTICE: Zap,
	ENERGY: Zap,
	SLEEP: Moon
};

const CATEGORY_LABELS = {
	ACUTE_ANXIETY: "Gestion Anxiété",
	RELAXATION: "Relaxation",
	MEDITATION: "Méditation",
	BEGINNER: "Débutant",
	DAILY_PRACTICE: "Pratique Quotidienne",
	ENERGY: "Boost Énergie",
	SLEEP: "Aide au Sommeil"
};

const CATEGORY_DESCRIPTIONS = {
	ACUTE_ANXIETY: "Techniques rapides pour calmer l'anxiété et le stress",
	RELAXATION: "Exercices pour la détente profonde et la récupération",
	MEDITATION: "Pratiques pour la concentration et la pleine conscience",
	BEGINNER: "Exercices simples pour débuter en douceur",
	DAILY_PRACTICE: "Routines quotidiennes pour maintenir l'équilibre",
	ENERGY: "Techniques énergisantes pour dynamiser le corps",
	SLEEP: "Préparation au sommeil et relaxation nocturne"
};

export default function BreathingProgramPage() {
	const { selectedProtocol, isLoading, error, recommendations, setProtocol } = useBreathingProtocolsClean();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Chargement des programmes...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Card className="max-w-md">
					<CardHeader>
						<CardTitle className="text-destructive">Erreur</CardTitle>
						<CardDescription>{error}</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	const renderProtocolCard = (protocol: BreathingProtocolViewModel, isSelected = false) => (
		<Card
			key={protocol.id}
			className={`cursor-pointer transition-all hover:shadow-md ${
				isSelected ? "ring-primary bg-primary/5 ring-2" : ""
			}`}
			onClick={() => setProtocol(protocol)}
		>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">{protocol.name}</CardTitle>
					<div className="flex items-center gap-2">
						{isSelected && <CheckCircle className="text-primary h-4 w-4" />}
					</div>
				</div>
				<CardDescription className="text-sm">{protocol.description}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-2">
					<div className="text-muted-foreground flex items-center gap-4 text-xs">
						<div className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							<span>{protocol.totalCycleDuration}s/cycle</span>
						</div>
						<div className="flex items-center gap-1">
							<Target className="h-3 w-3" />
							<span>
								{protocol.phases.inhale}
								{protocol.phases.hold1 ? `-${protocol.phases.hold1}` : ""}-{protocol.phases.exhale}
								{protocol.phases.hold2 ? `-${protocol.phases.hold2}` : ""}
							</span>
						</div>
					</div>
					<div className="text-muted-foreground text-xs">
						<strong>Rythme:</strong>
						{protocol.phases.inhale && ` Inspiration ${protocol.phases.inhale}s`}
						{protocol.phases.hold1 && ` • Rétention ${protocol.phases.hold1}s`}
						{protocol.phases.exhale && ` • Expiration ${protocol.phases.exhale}s`}
						{protocol.phases.hold2 && ` • Pause ${protocol.phases.hold2}s`}
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="flex w-full flex-1 flex-col gap-6 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/app/settings" className="h-8 w-8">
							<ChevronLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-xl font-semibold">Programme de Respiration</h1>
						<p className="text-muted-foreground text-sm">Choisissez votre parcours thérapeutique</p>
					</div>
				</div>
			</div>

			{selectedProtocol && (
				<Card className="border-primary bg-primary/5">
					<CardHeader>
						<CardTitle className="text-primary flex items-center gap-2">
							<CheckCircle className="h-5 w-5" />
							Programme Actuel
						</CardTitle>
						<CardDescription>Ce programme sera utilisé dans vos sessions de respiration</CardDescription>
					</CardHeader>
					<CardContent>{renderProtocolCard(selectedProtocol, true)}</CardContent>
				</Card>
			)}

			<div className="space-y-6">
				<h2 className="text-lg font-semibold">Choisir un Objectif</h2>

				{Object.entries(recommendations).map(([category, protocols]) => {
					const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
					const label = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS];
					const description = CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS];

					return (
						<Card key={category}>
							<CardHeader>
								<div className="flex items-center gap-3">
									{Icon && <Icon className="text-primary h-6 w-6" />}
									<div className="flex-1">
										<CardTitle className="text-base">{label}</CardTitle>
										<CardDescription>{description}</CardDescription>
									</div>
									<Badge variant="outline">{protocols.length} programmes</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid gap-3 md:grid-cols-2">
									{protocols.map((protocol) =>
										renderProtocolCard(protocol, selectedProtocol?.id === protocol.id)
									)}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="flex gap-3">
				<Button asChild className="flex-1">
					<Link href="/app">Commencer une Session</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/app/settings">Retour</Link>
				</Button>
			</div>
		</div>
	);
}
