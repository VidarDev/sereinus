"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const RefreshPage = () => {
	const router = useRouter();

	useEffect(() => {
		window.location.reload();
	}, [router]);

	return null;
};
