import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateUID(): string {
	return crypto.randomUUID();
}

export function saveToLocalStorage<T>(key: string, data: T): boolean {
	try {
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	} catch (error) {
		console.error("Erreur lors de la sauvegarde en localStorage:", error);
		return false;
	}
}

export function getFromLocalStorage<T>(key: string): T | null {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.error("Erreur lors de la lecture du localStorage:", error);
		return null;
	}
}
