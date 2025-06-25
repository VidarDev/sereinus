import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isPWAInstalled =
		request.cookies.get("pwa-installed")?.value === "true" || request.headers.get("X-PWA-Installed") === "true";

	const isHomePage = pathname === "/";
	if (isHomePage && isPWAInstalled) {
		const appUrl = new URL("/app", request.url);
		return NextResponse.redirect(appUrl);
	}
	return NextResponse.next();
}
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - manifest.webmanifest (PWA manifest)
		 * - sw.js (service worker)
		 * - *.png, *.jpg, *.jpeg, *.gif, *.svg (images)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:png|jpg|jpeg|gif|svg)$).*)"
	]
};
