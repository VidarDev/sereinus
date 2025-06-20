import { generateThemeScript } from "@/vue/lib/theme/utils";

export function ThemeScript() {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: generateThemeScript()
			}}
		/>
	);
}
