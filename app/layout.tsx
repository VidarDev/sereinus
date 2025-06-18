import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { InstallPrompt } from "@/vue/components/pwa/install-prompt";
import { PushNotificationManager } from "@/vue/components/pwa/push-notification-manager";
import { getCurrentPWAConfig } from "@/vue/lib/pwa-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

const pwaConfig = getCurrentPWAConfig();

export const metadata: Metadata = {
	title: pwaConfig.name,
	description: pwaConfig.description,
	applicationName: pwaConfig.shortName,
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: pwaConfig.shortName
	},
	formatDetection: {
		telephone: false
	},
	openGraph: {
		type: "website",
		siteName: pwaConfig.name,
		title: pwaConfig.shortName,
		description: pwaConfig.description
	},
	twitter: {
		card: "summary",
		title: pwaConfig.shortName,
		description: pwaConfig.description
	},
	icons: {
		icon: [
			{
				url: `/icons/${pwaConfig.iconFolder}/icon-192x192.png`,
				sizes: "192x192",
				type: "image/png"
			},
			{
				url: `/icons/${pwaConfig.iconFolder}/icon-512x512.png`,
				sizes: "512x512",
				type: "image/png"
			}
		],
		apple: [
			{
				url: `/icons/${pwaConfig.iconFolder}/icon-152x152.png`,
				sizes: "152x152",
				type: "image/png"
			},
			{
				url: `/icons/${pwaConfig.iconFolder}/icon-192x192.png`,
				sizes: "192x192",
				type: "image/png"
			}
		]
	},
	manifest: "/manifest.json"
};

export const viewport: Viewport = {
	themeColor: pwaConfig.themeColor,
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
			<head>
				<meta name="application-name" content={pwaConfig.shortName} />
				<meta name="apple-mobile-web-app-title" content={pwaConfig.shortName} />
				<meta name="msapplication-TileColor" content={pwaConfig.backgroundColor} />
				<meta name="msapplication-TileImage" content={`/icons/${pwaConfig.iconFolder}/icon-152x152.png`} />
				<link rel="manifest" href={`/manifest.json?config=${pwaConfig.iconFolder}`} />
			</head>
			<body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
					<InstallPrompt />
					<PushNotificationManager />
					{children}
				</main>
			</body>
		</html>
	);
}
