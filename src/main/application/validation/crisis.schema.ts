import { z } from "zod";

export const CrisisInputSchema = z.object({
	datetime: z.date({
		required_error: "La date est requise",
		invalid_type_error: "Format de date invalide"
	}),
	duration: z
		.number({
			required_error: "La durée est requise",
			invalid_type_error: "La durée doit être un nombre"
		})
		.min(0, "La durée ne peut pas être négative")
		.max(300000, "La durée ne peut pas dépasser 5 minutes (300 secondes)"),
	note: z
		.string()
		.max(2000, "La note ne peut pas dépasser 2000 caractères")
		.optional()
		.refine((val) => {
			if (!val) return true;
			const maliciousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /data:text\/html/i];
			return !maliciousPatterns.some((pattern) => pattern.test(val));
		}, "Contenu de note invalide détecté")
});

export const CrisisUpdateSchema = z.object({
	datetime: z.date({
		required_error: "La date est requise",
		invalid_type_error: "Format de date invalide"
	}),
	note: z
		.string()
		.max(2000, "La note ne peut pas dépasser 2000 caractères")
		.min(1, "La note ne peut pas être vide")
		.refine((val) => {
			const maliciousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /data:text\/html/i];
			return !maliciousPatterns.some((pattern) => pattern.test(val));
		}, "Contenu de note invalide détecté")
});

export const UserIdSchema = z
	.string({
		required_error: "L'ID utilisateur est requis",
		invalid_type_error: "L'ID utilisateur doit être une chaîne"
	})
	.min(1, "L'ID utilisateur ne peut pas être vide")
	.max(100, "L'ID utilisateur trop long")
	.regex(/^[a-zA-Z0-9_-]+$/, "L'ID utilisateur contient des caractères invalides");

export const BreathingSessionInputSchema = z.object({
	protocolId: z.string().min(1, "L'ID du protocole est requis"),
	duration: z.number().min(0).max(300000),
	cycleCount: z.number().min(1, "Au moins un cycle requis"),
	settings: z.object({
		hapticEnabled: z.boolean(),
		soundEnabled: z.boolean(),
		wakeLockEnabled: z.boolean()
	}),
	completedAt: z.date(),
	userNote: z.string().max(1000).optional()
});

export type CrisisInput = z.infer<typeof CrisisInputSchema>;
export type CrisisUpdate = z.infer<typeof CrisisUpdateSchema>;
export type ValidUserId = z.infer<typeof UserIdSchema>;
export type BreathingSessionInput = z.infer<typeof BreathingSessionInputSchema>;

export class ValidationError extends Error {
	public readonly errors: z.ZodError;

	constructor(zodError: z.ZodError) {
		const message = zodError.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
		super(`Validation failed: ${message}`);
		this.name = "ValidationError";
		this.errors = zodError;
	}
}

export function validateCrisisInput(data: unknown): CrisisInput {
	const result = CrisisInputSchema.safeParse(data);
	if (!result.success) {
		throw new ValidationError(result.error);
	}
	return result.data;
}

export function validateCrisisUpdate(data: unknown): CrisisUpdate {
	const result = CrisisUpdateSchema.safeParse(data);
	if (!result.success) {
		throw new ValidationError(result.error);
	}
	return result.data;
}

export function validateUserId(data: unknown): ValidUserId {
	const result = UserIdSchema.safeParse(data);
	if (!result.success) {
		throw new ValidationError(result.error);
	}
	return result.data;
}

export function validateBreathingSessionInput(data: unknown): BreathingSessionInput {
	const result = BreathingSessionInputSchema.safeParse(data);
	if (!result.success) {
		throw new ValidationError(result.error);
	}
	return result.data;
}
