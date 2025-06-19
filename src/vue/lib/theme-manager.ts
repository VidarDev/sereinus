export interface ThemeColors {
	primary: string;
	themeColor: string;
	backgroundColor: string;
}

export const THEME_PRESETS = {
	default: {
		primary: "#f7c2ff",
		themeColor: "#f7c2ff",
		backgroundColor: "#2d0036"
	},
	dark: {
		primary: "#1f2937",
		themeColor: "#1f2937",
		backgroundColor: "#111827"
	},
	blue: {
		primary: "#3b82f6",
		themeColor: "#3b82f6",
		backgroundColor: "#1e40af"
	},
	green: {
		primary: "#10b981",
		themeColor: "#10b981",
		backgroundColor: "#065f46"
	},
	red: {
		primary: "#ef4444",
		themeColor: "#ef4444",
		backgroundColor: "#991b1b"
	},
	purple: {
		primary: "#8b5cf6",
		themeColor: "#8b5cf6",
		backgroundColor: "#5b21b6"
	}
} as const;

export const THEME_ROUTES: Record<string, ThemePreset> = {
	"/": "default",
	"/profile": "purple",
	"/settings": "dark",
	"/notifications": "blue",
	"/admin": "red",
	"/dashboard": "green"
};

export type ThemePreset = keyof typeof THEME_PRESETS;

class ThemeManager {
	private currentTheme: ThemeColors = THEME_PRESETS.default;

	private updateThemeMetaTags(colors: ThemeColors): void {
		let themeColorMeta = document.querySelector('meta[name="theme-color"]');
		if (!themeColorMeta) {
			themeColorMeta = document.createElement("meta");
			themeColorMeta.setAttribute("name", "theme-color");
			document.head.appendChild(themeColorMeta);
		}
		themeColorMeta.setAttribute("content", colors.themeColor);

		let appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
		if (!appleStatusBarMeta) {
			appleStatusBarMeta = document.createElement("meta");
			appleStatusBarMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
			document.head.appendChild(appleStatusBarMeta);
		}
		appleStatusBarMeta.setAttribute("content", "default");

		let msApplicationMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
		if (!msApplicationMeta) {
			msApplicationMeta = document.createElement("meta");
			msApplicationMeta.setAttribute("name", "msapplication-navbutton-color");
			document.head.appendChild(msApplicationMeta);
		}
		msApplicationMeta.setAttribute("content", colors.themeColor);
	}

	public applyTheme(preset: ThemePreset): void {
		this.currentTheme = THEME_PRESETS[preset];
		this.updateThemeMetaTags(this.currentTheme);

		// Mettre à jour les variables CSS personnalisées
		document.documentElement.style.setProperty("--theme-primary", this.currentTheme.primary);
		document.documentElement.style.setProperty("--theme-color", this.currentTheme.themeColor);
		document.documentElement.style.setProperty("--theme-background", this.currentTheme.backgroundColor);

		// Déclencher un événement personnalisé pour notifier les composants
		window.dispatchEvent(
			new CustomEvent("themeChanged", {
				detail: { preset, colors: this.currentTheme }
			})
		);
	}

	public applyCustomTheme(colors: ThemeColors): void {
		this.currentTheme = colors;
		this.updateThemeMetaTags(this.currentTheme);

		document.documentElement.style.setProperty("--theme-primary", this.currentTheme.primary);
		document.documentElement.style.setProperty("--theme-color", this.currentTheme.themeColor);
		document.documentElement.style.setProperty("--theme-background", this.currentTheme.backgroundColor);

		window.dispatchEvent(
			new CustomEvent("themeChanged", {
				detail: { preset: "custom", colors: this.currentTheme }
			})
		);
	}

	public getCurrentTheme(): ThemeColors {
		return this.currentTheme;
	}

	public initialize(initialPreset: ThemePreset = "default"): void {
		if (typeof window !== "undefined") {
			this.applyTheme(initialPreset);
		}
	}

	public applyThemeForRoute(pathname: string): void {
		const themeForRoute = THEME_ROUTES[pathname] || "default";
		this.applyTheme(themeForRoute);
	}
}

// Instance singleton
export const themeManager = new ThemeManager();

// Hook
export function useThemeManager() {
	return {
		applyTheme: themeManager.applyTheme.bind(themeManager),
		applyCustomTheme: themeManager.applyCustomTheme.bind(themeManager),
		getCurrentTheme: themeManager.getCurrentTheme.bind(themeManager),
		applyThemeForRoute: themeManager.applyThemeForRoute.bind(themeManager),
		presets: THEME_PRESETS
	};
}
