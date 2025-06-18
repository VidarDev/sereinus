export interface PWAConfig {
	name: string;
	shortName: string;
	description: string;
	themeColor: string;
	backgroundColor: string;
	icons: {
		src: string;
		sizes: string;
		type: string;
		purpose?: "any" | "maskable" | "monochrome";
	}[];
	startUrl: string;
	display: "standalone" | "fullscreen" | "minimal-ui" | "browser";
	orientation?: "portrait" | "landscape" | "any";
	categories?: string[];
	screenshots?: {
		src: string;
		sizes: string;
		type: string;
		form_factor?: "narrow" | "wide";
	}[];
	iconFolder?: string;
}

const generateIcons = (iconFolder: string): PWAConfig["icons"] => {
	return [
		{
			src: `/icons/${iconFolder}/icon-192x192.png`,
			sizes: "192x192",
			type: "image/png",
			purpose: "any" as const
		},
		{
			src: `/icons/${iconFolder}/icon-512x512.png`,
			sizes: "512x512",
			type: "image/png",
			purpose: "any" as const
		},
		{
			src: `/icons/${iconFolder}/icon-maskable-192x192.png`,
			sizes: "192x192",
			type: "image/png",
			purpose: "maskable" as const
		},
		{
			src: `/icons/${iconFolder}/icon-maskable-512x512.png`,
			sizes: "512x512",
			type: "image/png",
			purpose: "maskable" as const
		}
	];
};

const BASE_CONFIG: Omit<
	PWAConfig,
	"name" | "shortName" | "description" | "categories" | "icons" | "screenshots" | "iconFolder"
> = {
	themeColor: "#ffffff",
	backgroundColor: "#000000",
	startUrl: "/",
	display: "standalone",
	orientation: "portrait"
};

const PWA_CONFIGS: Record<string, PWAConfig> = {
	default: {
		...BASE_CONFIG,
		name: "Sereinus",
		shortName: "Sereinus",
		description: "Application web progressive Sereinus",
		categories: ["productivity", "lifestyle", "wellness"],
		icons: generateIcons("default"),
		iconFolder: "default"
	},
	privacy: {
		...BASE_CONFIG,
		name: "Calculatrice Pro",
		shortName: "CalcPro",
		description: "Calculatrice professionnelle avec fonctionnalités avancées",
		categories: ["utilities", "productivity"],
		icons: generateIcons("privacy"),
		iconFolder: "privacy"
	}
};

export function getPWAConfig(configName = "default"): PWAConfig {
	return PWA_CONFIGS[configName] || PWA_CONFIGS.default;
}

export function getCurrentPWAConfig(): PWAConfig {
	const configName = process.env.NEXT_PUBLIC_PWA_CONFIG || "default";
	return getPWAConfig(configName);
}
