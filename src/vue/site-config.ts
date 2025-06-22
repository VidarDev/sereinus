import { THEME_PRESETS } from "./lib/theme/types";

export const SiteConfig = {
	title: "amai",
	short_name: "amai",
	description: "amai",
	categories: ["education", "learning", "training"],
	prodUrl: "https://amai.vercel.app/",
	appId: "amai",
	domain: "amai.vercel.app",
	appIcon: "/icon-192x192.png",
	brand: {
		primary: THEME_PRESETS.default.primary,
		theme_color: THEME_PRESETS.default.background_color,
		background_color: THEME_PRESETS.default.background_color
	}
};
