import { THEME_PRESETS } from "./lib/theme/types";

export const SiteConfig = {
	title: "Sereinus",
	short_name: "Sereinus",
	description: "Sereinus",
	categories: ["education", "learning", "training"],
	prodUrl: "https://sereinus.vercel.app/",
	appId: "sereinus",
	domain: "sereinus.vercel.app",
	appIcon: "/icon-192x192.png",
	brand: {
		primary: THEME_PRESETS.default.primary,
		theme_color: THEME_PRESETS.default.background_color,
		background_color: THEME_PRESETS.default.background_color
	}
};
