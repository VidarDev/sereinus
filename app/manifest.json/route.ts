import { NextRequest, NextResponse } from "next/server";

import { getPWAConfig } from "@/vue/lib/pwa-config";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const config = searchParams.get("config") || "default";

	const pwaConfig = getPWAConfig(config);

	const manifest = {
		name: pwaConfig.name,
		short_name: pwaConfig.shortName,
		description: pwaConfig.description,
		start_url: pwaConfig.startUrl,
		display: pwaConfig.display,
		background_color: pwaConfig.backgroundColor,
		theme_color: pwaConfig.themeColor,
		orientation: pwaConfig.orientation,
		categories: pwaConfig.categories,
		icons: pwaConfig.icons,
		screenshots: pwaConfig.screenshots,
		scope: "/",
		lang: "fr",
		dir: "ltr"
	};

	return NextResponse.json(manifest, {
		headers: {
			"Content-Type": "application/manifest+json",
			"Cache-Control": "public, max-age=0, must-revalidate"
		}
	});
}
