"use server";

import webpush from "web-push";

import { getInjection } from "@/di/container";

export const login = async (username: string, password: string) => {
	const authenticationController = getInjection("AuthenticationController");

	return await authenticationController.login(username, password);
};

// Notifications push
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
	throw new Error("VAPID keys are not configured in the environment variables");
}

webpush.setVapidDetails("mailto:your-email@example.com", publicKey, privateKey);

let subscription: webpush.PushSubscription | null = null;

export async function subscribeUser(sub: webpush.PushSubscription) {
	subscription = sub;
	return { success: true };
}

export async function unsubscribeUser() {
	subscription = null;
	return { success: true };
}

export async function sendNotification(message: string) {
	if (!subscription) {
		throw new Error("No subscription available");
	}

	try {
		await webpush.sendNotification(
			subscription,
			JSON.stringify({
				title: "Test Notification",
				body: message,
				icon: "/icon.png"
			})
		);
		return { success: true };
	} catch (error) {
		console.error("Error sending push notification:", error);
		return { success: false, error: "Failed to send notification" };
	}
}
