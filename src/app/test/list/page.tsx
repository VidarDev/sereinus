import { get } from "@/app/test/list/actions";

const List = async () => {
	const response = await get("1");

	const crises = response.data;

	return (
		<ul>
			{crises?.map((crisis, index) => (
				<li key={index}>
					{crisis.date} à {crisis.time} - {crisis.duration}
				</li>
			))}
		</ul>
	);
};

export default List;
