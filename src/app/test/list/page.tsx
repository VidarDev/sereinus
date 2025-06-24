import { toast } from "sonner";

import { get } from "@/app/test/list/actions";

const List = async () => {
	const response = await get("1");

	if (typeof response === "string") {
		toast(response);
	} else {
		return (
			<ul>
				{response.map((crisis, index) => (
					<li key={index}>
						{crisis.date} à {crisis.time} - {crisis.duration}
					</li>
				))}
			</ul>
		);
	}
};

export default List;
