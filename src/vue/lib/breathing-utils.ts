import type { SVGShape } from "@/vue/hooks/useBreathingSVGShape";

// Interface pour les métadonnées de session
export interface BreathingSessionNoteMetadata {
	type: string;
	protocol: string;
	cycles: number;
	shape: SVGShape;
	timestamp: string;
}

// Fonction utilitaire pour extraire les métadonnées d'une note
export function parseBreathingSessionNote(note: string): {
	isBreathingSession: boolean;
	metadata?: BreathingSessionNoteMetadata;
	userNote?: string;
} {
	try {
		const metadataMatch = note.match(/\[Métadonnées: (.*?)\]/);
		if (!metadataMatch) {
			return { isBreathingSession: false };
		}

		const metadata = JSON.parse(metadataMatch[1]) as BreathingSessionNoteMetadata;
		const userNoteIndex = note.indexOf("Note personnelle:\n");
		const userNote = userNoteIndex !== -1 ? note.substring(userNoteIndex + 18) : undefined;

		return {
			isBreathingSession: metadata.type === "breathing_session",
			metadata,
			userNote
		};
	} catch {
		return { isBreathingSession: false };
	}
}
