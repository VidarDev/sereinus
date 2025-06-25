"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { get, update } from "@/app/test/list/actions";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { Button } from "@/vue/components/ui/button";

export function CrisisListContent() {
	const [crises, setCrises] = useState<CrisisViewModel[]>([]);

	useEffect(() => {
		const getCrises = async () => {
			const response = await get("1");
			if (typeof response === "string") {
				toast.error(response);
			} else {
				setCrises(response);
			}
		};

		getCrises();
	}, []);

	const handleClick = (crisis: CrisisViewModel) => async () => {
		const response = await update("1", crisis.datetime, "fasdfasdfadgalkdsjhflakjdshf");

		if (typeof response === "string") {
			toast.error(response);
		} else {
			toast.success("Crise mise à jour avec succès !");
		}
	};

	try {
		if (crises.length === 0) {
			return (
				<div className="rounded-md border border-gray-200 bg-gray-50 p-4">
					<p className="text-gray-600">Aucune crise trouvée</p>
				</div>
			);
		}

		return (
			<ul className="space-y-2">
				{crises.map((crisis, index) => (
					<li key={index} className="flex flex-col items-center justify-between rounded border p-2">
						<p>
							{crisis.formatedDate} à {crisis.time} - {crisis.duration}
						</p>
						{crisis.note && <p>{crisis.note}</p>}
						<Button onClick={handleClick(crisis)}>Mettre a jour</Button>
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
