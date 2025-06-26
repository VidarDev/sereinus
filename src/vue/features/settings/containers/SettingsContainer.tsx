"use client";

import { useCallback } from "react";

import { MusicSection } from "../components/MusicSection/MusicSection";
import { PreferencesSection } from "../components/PreferencesSection/PreferencesSection";
import { ShapeSection } from "../components/ShapeSection/ShapeSection";
import { ThemeSection } from "../components/ThemeSection/ThemeSection";
import { useSettings } from "../hooks/useSettings";

interface SettingsContainerProps {
	className?: string;
}

export const SettingsContainer = ({ className }: SettingsContainerProps) => {
	const { settings, isLoading, errors, updateSettings, resetSettings, exportSettings, importSettings } =
		useSettings();

	const handlePreferencesChange = useCallback(
		(preferences: Partial<typeof settings.preferences>) => {
			updateSettings({ preferences });
		},
		[updateSettings, settings]
	);

	const handleResetSettings = useCallback(async () => {
		await resetSettings();
	}, [resetSettings]);

	if (isLoading) {
		return (
			<div className={className}>
				<div className="space-y-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="bg-muted animate-pulse rounded-lg p-6">
							<div className="bg-muted-foreground/20 mb-4 h-4 w-1/3 rounded"></div>
							<div className="space-y-2">
								<div className="bg-muted-foreground/20 h-3 w-full rounded"></div>
								<div className="bg-muted-foreground/20 h-3 w-2/3 rounded"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="space-y-8">
				<ThemeSection
					currentTheme={settings.theme}
					{...(errors.theme && { error: errors.theme })}
					className="border-b pb-6"
				/>

				<ShapeSection
					currentShape={settings.shape}
					{...(errors.shape && { error: errors.shape })}
					className="border-b pb-6"
				/>

				<MusicSection className="border-b pb-6" />

				<PreferencesSection
					preferences={settings.preferences}
					onPreferencesChange={handlePreferencesChange}
					onExportSettings={exportSettings}
					onImportSettings={importSettings}
					onResetSettings={handleResetSettings}
					{...(errors.preferences && { errors: errors.preferences })}
				/>
			</div>
		</div>
	);
};
