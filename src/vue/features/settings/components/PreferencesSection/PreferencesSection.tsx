"use client";

import { memo, useCallback } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { Switch } from "@/vue/components/ui/switch";
import { SiteConfig } from "@/vue/site-config";
import type { UserPreferences } from "../../types/settings.types";

interface PreferencesSectionProps {
	preferences: UserPreferences;
	onPreferencesChange: (preferences: Partial<UserPreferences>) => void;
	onExportSettings: () => string;
	onImportSettings: (data: string) => Promise<boolean>;
	onResetSettings: () => Promise<void>;
	errors?: Record<string, string>;
	className?: string;
}

export const PreferencesSection = memo<PreferencesSectionProps>(
	({
		preferences,
		onPreferencesChange,
		onExportSettings,
		onImportSettings,
		onResetSettings,
		errors = {},
		className
	}) => {
		const handleSwitchChange = useCallback(
			(key: keyof UserPreferences) => (checked: boolean) => {
				onPreferencesChange({ [key]: checked });
			},
			[onPreferencesChange]
		);

		const handleExport = useCallback(() => {
			const data = onExportSettings();
			const blob = new Blob([data], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${SiteConfig.appId}-settings-${new Date().toISOString().split("T")[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, [onExportSettings]);

		const handleImport = useCallback(() => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = ".json";
			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) {
					const text = await file.text();
					await onImportSettings(text);
				}
			};
			input.click();
		}, [onImportSettings]);

		return (
			<div className={className}>
				<div className="space-y-6">
					<div>
						<h3 className="mb-3 text-sm font-medium">Préférences</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<label className="text-sm font-medium">Vibrations</label>
									<p className="text-muted-foreground text-xs">
										Activer les vibrations pendant les exercices
									</p>
								</div>
								<Switch
									checked={preferences.hapticEnabled}
									onCheckedChange={handleSwitchChange("hapticEnabled")}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<label className="text-sm font-medium">Sons</label>
									<p className="text-muted-foreground text-xs">
										Activer les sons d&apos;accompagnement
									</p>
								</div>
								<Switch
									checked={preferences.soundEnabled}
									onCheckedChange={handleSwitchChange("soundEnabled")}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<label className="text-sm font-medium">Verrouillage écran</label>
									<p className="text-muted-foreground text-xs">
										Empêcher l&apos;écran de se verrouiller
									</p>
								</div>
								<Switch
									checked={preferences.wakeLockEnabled}
									onCheckedChange={handleSwitchChange("wakeLockEnabled")}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<label className="text-sm font-medium">Sauvegarde auto</label>
									<p className="text-muted-foreground text-xs">
										Sauvegarder automatiquement les modifications
									</p>
								</div>
								<Switch
									checked={preferences.autoSave}
									onCheckedChange={handleSwitchChange("autoSave")}
								/>
							</div>
						</div>
					</div>

					<div className="border-t pt-4">
						<h3 className="mb-3 text-sm font-medium">Gestion des données</h3>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
							<Button variant="outline" size="sm" onClick={handleExport} className="justify-start">
								<Download className="mr-2 h-4 w-4" />
								Exporter
							</Button>

							<Button variant="outline" size="sm" onClick={handleImport} className="justify-start">
								<Upload className="mr-2 h-4 w-4" />
								Importer
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={onResetSettings}
								className="text-destructive hover:text-destructive justify-start"
							>
								<RotateCcw className="mr-2 h-4 w-4" />
								Réinitialiser
							</Button>
						</div>
					</div>

					{Object.keys(errors).length > 0 && (
						<div className="space-y-1">
							{Object.entries(errors).map(([key, error]) => (
								<p key={key} className="text-destructive text-xs" role="alert">
									{error}
								</p>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
);

PreferencesSection.displayName = "PreferencesSection";
