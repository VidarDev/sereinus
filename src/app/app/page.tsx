"use client";

import { BreathingProtocol } from "@/main/domain/BreathingProtocol";
import { BreathingSessionContainer } from "@/vue/features/breathing-session";
import { useBreathingProtocolsClean } from "@/vue/hooks/useBreathingProtocols";
import { useBreathingSVGShape } from "@/vue/hooks/useBreathingSVGShape";
import { SiteConfig } from "@/vue/site-config";

export default function AppPage() {
	const { selectedProtocol, isLoading } = useBreathingProtocolsClean();
	const { shape } = useBreathingSVGShape();

	const sessionProtocol: BreathingProtocol | null = selectedProtocol
		? new BreathingProtocol(
				selectedProtocol.id,
				selectedProtocol.name,
				selectedProtocol.description,
				{
					inhale: selectedProtocol.phases.inhale || 4,
					hold1: selectedProtocol.phases.hold1 || 0,
					exhale: selectedProtocol.phases.exhale || 4,
					hold2: selectedProtocol.phases.hold2 || 0
				},
				selectedProtocol.isScientificallyValidated
			)
		: null;

	if (isLoading) {
		return (
			<div className="relative flex w-full flex-1 flex-col gap-6">
				<div className="flex w-full items-center justify-between">
					<h1 className="sr-only text-lg font-medium">{SiteConfig.title}</h1>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex w-full flex-1 flex-col gap-6">
			<div className="flex w-full items-center justify-between">
				<h1 className="sr-only text-lg font-medium">{SiteConfig.title}</h1>
			</div>
			<div className="flex flex-1 flex-col gap-6">
				<BreathingSessionContainer protocol={sessionProtocol} shape={shape} className="flex-1" />
			</div>
		</div>
	);
}
