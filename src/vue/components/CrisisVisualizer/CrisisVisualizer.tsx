"use client";

import { useState } from "react";
import { toast } from "sonner";

import { save } from "@/vue/components/CrisisVisualizer/actions";
import { Button } from "@/vue/components/ui/button";
import { Toaster } from "@/vue/components/ui/sonner";

import "./CrisisVisualizer.css";

const CrisisVisualizer = () => {
	const [timer, setTimer] = useState<number>(0);
	const [isCrisisActive, setIsCrisisActive] = useState<boolean>(false);
	const [crisisInterval, setCrisisInterval] = useState<NodeJS.Timeout | null>(null);

	const toggleCrisis = () => {
		if (!isCrisisActive) {
			startCrisis();
		} else {
			stopCrisis();
		}
	};

	const startCrisis = () => {
		setCrisisInterval(
			setInterval(() => {
				setTimer((prev) => prev + 1);
			}, 1000)
		);

		setIsCrisisActive(true);
	};

	const stopCrisis = async () => {
		if (crisisInterval) {
			clearInterval(crisisInterval);
			setCrisisInterval(null);
		}

		const savedCrisis = await save(timer, "1");

		if (savedCrisis) {
			toast("Crise terminée !");
		}

		setTimer(0);
		setIsCrisisActive(false);
	};

	const getFormattedTime = (time: number): string => {
		const hours = Math.floor(time / 3600);
		time -= hours * 3600;
		const minutes = Math.floor(time / 60);
		const seconds = time - minutes * 60;

		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="crisis-visualizer-container">
			<Toaster closeButton />

			<div className="crisis-visualizer"></div>

			<Button onClick={toggleCrisis}>{isCrisisActive ? "Arrêter la crise" : "Démarrer la crise"}</Button>

			{isCrisisActive && (
				<div className="crisis-timer">
					<span className="text-black">Temps de crise : {getFormattedTime(timer)}</span>
				</div>
			)}
		</div>
	);
};

export default CrisisVisualizer;
