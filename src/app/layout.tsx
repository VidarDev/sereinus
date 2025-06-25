import type { Metadata, Viewport } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";

import { AutoInstallPrompt } from "@/vue/components/PWA/install-prompt";
import { Toaster } from "@/vue/components/toaster";
import { NoFOUC } from "@/vue/components/utils/no-fouc";
import { PWAProvider } from "@/vue/providers/pwa.provider";
import { ThemeProvider } from "@/vue/providers/theme.provider";
import { SiteConfig } from "@/vue/site-config";

import "./globals.css";

const montserratSans = Montserrat({
	variable: "--font-montserrat-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: SiteConfig.title,
	description: SiteConfig.description,
	applicationName: SiteConfig.short_name,
	manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
	themeColor: SiteConfig.brand.theme_color,
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" className="dark" suppressHydrationWarning>
			<head>
				<meta
					name="viewport"
					content="initial-scale=1, viewport-fit=cover, width=device-width, maximum-scale=1, user-scalable=no"
				></meta>
				<meta name="mobile-web-app-capable" content="yes"></meta>
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
				<meta name="apple-mobile-web-app-capable" content="yes"></meta>
				<meta name="theme-color" content={SiteConfig.brand.theme_color}></meta>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									const storedTheme = localStorage.getItem('app-theme');
									const validThemes = ['blue', 'purple', 'brown'];
									const theme = validThemes.includes(storedTheme) ? storedTheme : 'blue';
									document.documentElement.setAttribute('data-theme', theme);
								} catch (e) {
									document.documentElement.setAttribute('data-theme', 'blue');
								}
							})();
						`
					}}
				/>
			</head>
			<body
				suppressHydrationWarning
				className={`${montserratSans.variable} ${geistMono.variable} bg-background relative flex flex-col antialiased`}
			>
				<NoFOUC>
					<PWAProvider>
						<ThemeProvider>
							<main className="flex flex-1 flex-col px-4 py-4">{children}</main>
							<Toaster />
							{/* <TailwindIndicator />
							<PWAIndicator /> */}
							<AutoInstallPrompt />
						</ThemeProvider>
					</PWAProvider>
				</NoFOUC>
			</body>
		</html>
	);
}
