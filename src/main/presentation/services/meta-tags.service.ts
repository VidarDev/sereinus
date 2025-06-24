import type { ThemeConfig } from "@/vue/lib/theme";

export class MetaTagsService {
	private static instance: MetaTagsService;
	private updateQueue: (() => void)[] = [];
	private isUpdating = false;

	static getInstance(): MetaTagsService {
		if (!MetaTagsService.instance) {
			MetaTagsService.instance = new MetaTagsService();
		}
		return MetaTagsService.instance;
	}

	updateThemeMetaTags(theme: ThemeConfig, isDark: boolean): void {
		if (typeof document === "undefined") return;

		const themeColor = isDark ? theme.metaThemeColor.dark : theme.metaThemeColor.light;

		this.queueUpdate(() => {
			const updates = [
				{ name: "theme-color", content: themeColor },
				{ name: "msapplication-navbutton-color", content: themeColor },
				{ name: "apple-mobile-web-app-status-bar-style", content: isDark ? "black-translucent" : "default" },
				{ name: "apple-mobile-web-app-capable", content: "yes" }
			];

			this.batchUpdateMetaTags(updates);
		});
	}

	private batchUpdateMetaTags(updates: { name: string; content: string }[]): void {
		const fragment = document.createDocumentFragment();

		updates.forEach(({ name, content }) => {
			let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

			if (!meta) {
				meta = document.createElement("meta");
				meta.name = name;
				fragment.appendChild(meta);
			}

			meta.content = content;
		});

		if (fragment.hasChildNodes()) {
			document.head.appendChild(fragment);
		}
	}

	private queueUpdate(updateFn: () => void): void {
		this.updateQueue.push(updateFn);

		if (!this.isUpdating) {
			this.isUpdating = true;
			requestAnimationFrame(() => {
				this.flushUpdates();
			});
		}
	}

	private flushUpdates(): void {
		while (this.updateQueue.length > 0) {
			const update = this.updateQueue.shift();
			update?.();
		}
		this.isUpdating = false;
	}

	destroy(): void {
		this.updateQueue = [];
		this.isUpdating = false;
	}
}

export const metaTagsService = MetaTagsService.getInstance();
