import { Suspense } from "react";

import { CrisisListContent } from "@/vue/components/CrisisListContent/CrisisListContent";

export const dynamic = "force-dynamic";

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
