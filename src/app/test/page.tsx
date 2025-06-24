import Link from "next/link";

import { CrisisVisualizer } from "@/vue/components";

const Test = () => {
	return (
		<main className="flex h-screen w-screen flex-col items-center justify-center">
			<CrisisVisualizer />
			<Link href={"/test/list"}>Liste des crises</Link>
		</main>
	);
};

export default Test;
