import { useEffect, useState } from "react";

export type SVGShape = "circle" | "drop";

const STORAGE_KEY = "breathing-svg-shape";

export function useBreathingSVGShape() {
	const [shape, setShape] = useState<SVGShape>("circle");

	useEffect(() => {
		const savedShape = localStorage.getItem(STORAGE_KEY) as SVGShape;
		if (savedShape && (savedShape === "circle" || savedShape === "drop")) {
			setShape(savedShape);
		}
	}, []);

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === STORAGE_KEY && e.newValue) {
				const newShape = e.newValue as SVGShape;
				if (newShape === "circle" || newShape === "drop") {
					setShape(newShape);
				}
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const updateShape = (newShape: SVGShape) => {
		setShape(newShape);
		localStorage.setItem(STORAGE_KEY, newShape);

		// Trigger a custom event to force update
		window.dispatchEvent(new CustomEvent("shape-changed", { detail: newShape }));
	};

	// Listen to the custom event to force update
	useEffect(() => {
		const handleShapeChange = (e: CustomEvent<SVGShape>) => {
			setShape(e.detail);
		};

		window.addEventListener("shape-changed", handleShapeChange as EventListener);
		return () => window.removeEventListener("shape-changed", handleShapeChange as EventListener);
	}, []);

	return {
		shape,
		setShape: updateShape
	};
}
