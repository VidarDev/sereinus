import { Suspense } from "react";

import { get } from "@/app/test/list/actions";

export const dynamic = "force-dynamic";

async function CrisisListContent() {
	try {
		const response = await get("1");

		if (typeof response === "string") {
			return (
				<div className="rounded-md border border-red-200 bg-red-50 p-4">
					<p className="text-red-800">Erreur lors du chargement des données : {response}</p>
				</div>
			);
		}

		if (!Array.isArray(response)) {
			return (
				<div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
					<p className="text-yellow-800">Aucune donnée disponible</p>
				</div>
			);
		}

		if (response.length === 0) {
			return (
				<div className="rounded-md border border-gray-200 bg-gray-50 p-4">
					<p className="text-gray-600">Aucune crise trouvée</p>
				</div>
			);
		}

		return (
			<ul className="space-y-2">
				{response.map((crisis, index) => (
					<li key={index} className="rounded border p-2">
						{crisis.date} à {crisis.time} - {crisis.duration}
					</li>
				))}
			</ul>
		);
	} catch (error) {
		console.error("Erreur lors du chargement des crises:", error);

		return (
			<div className="rounded-md border border-red-200 bg-red-50 p-4">
				<p className="text-red-800">Erreur système : Impossible de charger les données</p>
				<p className="mt-2 text-sm text-red-600">
					Veuillez réessayer plus tard ou contacter le support si le problème persiste.
				</p>
			</div>
		);
	}
}

function LoadingSpinner() {
	return (
		<div className="p-4 text-center">
			<div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
			<p className="mt-2 text-sm text-gray-600">Chargement des crises...</p>
		</div>
	);
}

const List = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 text-2xl font-bold">Liste des Crises</h1>
			<Suspense fallback={<LoadingSpinner />}>
				<CrisisListContent />
			</Suspense>
		</div>
	);
};

export default List;
