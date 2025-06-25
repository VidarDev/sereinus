"use server";

import { getInjection } from "@/di/container";
import type { SessionData } from "@/vue/hooks/useBreathingSession";
import type { SVGShape } from "@/vue/hooks/useBreathingSVGShape";

interface BreathingSessionMetadata {
	protocolName: string;
	protocolId?: string;
	sessionData: SessionData;
	svgShape: SVGShape;
	note?: string;
}

// Pour l'instant, on utilise le controller Crisis existant
// Plus tard, on créera un controller spécifique pour les sessions de respiration
export const saveBreathingSession = async (duration: number, note?: string) => {
	try {
		// Utilise la signature du CrisisController existant
		const result = await getInjection("CrisisController").save("current-user", new Date(), duration);

		// Si on a une note, on fait un update séparé (comme dans le pattern existant)
		if (note && result === true) {
			return await getInjection("CrisisController").update("current-user", new Date(), note);
		}

		return result;
	} catch (error) {
		return `Erreur lors de la sauvegarde: ${(error as Error).message}`;
	}
};

// Nouvelle version enrichie pour les sessions de respiration
export const saveBreathingSessionWithMetadata = async (metadata: BreathingSessionMetadata) => {
	try {
		const { sessionData, protocolName, svgShape, note } = metadata;

		// Convertir la durée en secondes
		const durationInSeconds = Math.floor(sessionData.duration / 1000);

		// Créer une note enrichie avec les métadonnées
		const enrichedNote = createEnrichedNote({
			protocolName,
			cycleCount: sessionData.cycleCount,
			svgShape,
			completedAt: sessionData.completedAt,
			userNote: note
		});

		// Sauvegarder comme une crise avec les métadonnées
		const result = await getInjection("CrisisController").save(
			"current-user",
			sessionData.completedAt,
			durationInSeconds
		);

		// Ajouter la note enrichie si la sauvegarde a réussi
		if (result === true && enrichedNote) {
			return await getInjection("CrisisController").update("current-user", sessionData.completedAt, enrichedNote);
		}

		return result;
	} catch (error) {
		return `Erreur lors de la sauvegarde enrichie: ${(error as Error).message}`;
	}
};

// Créer une note structurée avec métadonnées
function createEnrichedNote(data: {
	protocolName: string;
	cycleCount: number;
	svgShape: SVGShape;
	completedAt: Date;
	userNote?: string;
}): string {
	const metadata = {
		type: "breathing_session",
		protocol: data.protocolName,
		cycles: data.cycleCount,
		shape: data.svgShape,
		timestamp: data.completedAt.toISOString()
	};

	let note = `🫁 Session de respiration\n`;
	note += `Protocole: ${data.protocolName}\n`;
	note += `Cycles complétés: ${data.cycleCount}\n`;
	note += `Forme: ${data.svgShape === "circle" ? "Cercle" : "Goutte"}\n`;
	note += `\n[Métadonnées: ${JSON.stringify(metadata)}]\n`;

	if (data.userNote) {
		note += `\nNote personnelle:\n${data.userNote}`;
	}

	return note;
}
