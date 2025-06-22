import { THEME_META_TAGS, THEME_PRESETS, type ThemeColors, type ThemePreset } from "./types";

export function updatePWAMetaTags(colors: ThemeColors): void {
	if (typeof window === "undefined") return;

	const updateMetaTag = (name: string, content: string) => {
		let meta = document.querySelector(`meta[name="${name}"]`);
		if (!meta) {
			meta = document.createElement("meta");
			meta.setAttribute("name", name);
			document.head.appendChild(meta);
		}
		meta.setAttribute("content", content);
	};

	updateMetaTag(THEME_META_TAGS.THEME_COLOR, colors.background_color);
	updateMetaTag(THEME_META_TAGS.APPLE_STATUS_BAR, "default");
	updateMetaTag(THEME_META_TAGS.MS_NAV_BUTTON, colors.background_color);
}

export function applyThemeProperties(colors: ThemeColors): void {
	if (typeof window === "undefined") return;

	const root = document.documentElement;

	root.style.setProperty("--theme-primary", colors.primary);
	root.style.setProperty("--theme-color", colors.primary);
	root.style.setProperty("--theme-background", colors.background);
}

export function setThemeDataAttribute(preset: ThemePreset | "custom"): void {
	if (typeof window === "undefined") return;

	document.documentElement.setAttribute("data-theme", preset);
}

export function getFormattedThemeName(preset: string): string {
	return preset.charAt(0).toUpperCase() + preset.slice(1);
}

export function isValidThemePreset(preset: string, availablePresets: Record<string, unknown>): preset is ThemePreset {
	return preset in availablePresets;
}

export function generateThemeScript(): string {
	return `
		(function() {
			try {
				var theme = localStorage.getItem('amai-theme') || 'default';
				var themes = ${JSON.stringify(THEME_PRESETS)};
				
				if (themes[theme]) {
					var colors = themes[theme];
					var root = document.documentElement;
					
					root.setAttribute('data-theme', theme);
					root.style.setProperty('--theme-primary', colors.primary);
					root.style.setProperty('--theme-color', colors.primary);
					root.style.setProperty('--theme-background', colors.background);
					
					var themeColorMeta = document.querySelector('meta[name="theme-color"]');
					if (themeColorMeta) {
						themeColorMeta.setAttribute('content', colors.background_color);
					}
				}
			} catch (e) {
				console.warn('Theme script error:', e);
			}
		})();
	`;
}
