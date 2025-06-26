import { NextResponse } from "next/server";

export async function GET() {
	try {
		const BLOB_URL = process.env.MUSIC_DEFAULT_BLOB_URL || null;

		if (BLOB_URL) {
			const config = {
				tracks: [
					{
						filename: "music-default.mp3",
						url: BLOB_URL
					}
				]
			};

			return NextResponse.json(config);
		} else {
			return NextResponse.json({ error: "Blob configuration not available" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error retrieving audio configuration:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
