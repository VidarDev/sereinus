export const getServerUrl = () => {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	// In production
	if (process.env.VERCEL_ENV === "production") {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}

	// In "stage" environment
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// In development
	return "http://localhost:3000";
};
