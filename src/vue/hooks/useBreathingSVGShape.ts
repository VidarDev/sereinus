import { useEffect, useState } from "react";

export type SVGShape = "circle" | "drop";

export function useBreathingSVGShape() {
	const [shape, setShape] = useState<SVGShape>("circle");

	useEffect(() => {
		const savedShape = localStorage.getItem("breathing-svg-shape") as SVGShape;
		if (savedShape && (savedShape === "circle" || savedShape === "drop")) {
			setShape(savedShape);
		}
	}, []);

	const updateShape = (newShape: SVGShape) => {
		setShape(newShape);
		localStorage.setItem("breathing-svg-shape", newShape);
	};

	return {
		shape,
		setShape: updateShape
	};
}
