import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";

import { Toaster } from "@/vue/components/toaster";
import { ThemeProvider } from "@/vue/providers/theme.provider";
import { SiteConfig } from "@/vue/site-config";

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
	manifest: "/manifest.json"
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
		<html lang="fr" suppressHydrationWarning>
			<body
				suppressHydrationWarning
				className={`${montserratSans.variable} ${geistMono.variable} relative min-h-[100dvh] antialiased`}
			>
				<ThemeProvider>
					<Toaster />
					<main className="bg-theme-color relative min-h-[100dvh] p-4">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
