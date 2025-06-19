import type { MetadataRoute } from "next";

import { SiteConfig } from "@/vue/site-config";

export default function manifest(): MetadataRoute.Manifest {
	return {
		theme_color: SiteConfig.brand.theme_color,
		background_color: SiteConfig.brand.background_color,
		start_url: "/",
		display: "standalone",
		orientation: "portrait",
		name: SiteConfig.title,
		short_name: SiteConfig.short_name,
		description: SiteConfig.description,
		categories: SiteConfig.categories,
		icons: [
			{
				"src": "/web-app-manifest-192x192.png",
				"sizes": "192x192",
				"type": "image/png",
				"purpose": "maskable"
			},
			{
				"src": "/web-app-manifest-512x512.png",
				"sizes": "512x512",
				"type": "image/png",
				"purpose": "maskable"
			}
		]
	};
}
