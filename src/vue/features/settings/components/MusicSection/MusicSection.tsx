"use client";

import { Switch } from "@/vue/components/ui/switch";
import { useBackgroundMusic } from "@/vue/hooks/useBackgroundMusic";
import { cn } from "@/vue/lib/utils";

interface MusicSectionProps {
	className?: string;
}

export function MusicSection({ className }: MusicSectionProps) {
	const { isPlaying, toggle, volume, changeVolume, isLoading, hasAudio, trackName } = useBackgroundMusic();

	if (isLoading) {
		return (
			<div className={cn("space-y-4", className)}>
				<h3 className="text-lg font-medium">Musique de fond</h3>
				<div className="text-muted-foreground text-sm">Chargement...</div>
			</div>
		);
	}

	if (!hasAudio) {
		return (
			<div className={cn("space-y-4", className)}>
				<h3 className="text-lg font-medium">Musique de fond</h3>
				<div className="text-muted-foreground text-sm">Aucune musique disponible</div>
			</div>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			<h3 className="text-lg font-medium">Musique de fond</h3>

			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="font-medium">{trackName}</div>
					<div className="text-muted-foreground text-sm">{isPlaying ? "En cours de lecture" : "Arrêtée"}</div>
				</div>
				<Switch checked={isPlaying} onCheckedChange={toggle} className="data-[state=checked]:bg-primary" />
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">Volume</span>
					<span className="text-muted-foreground text-sm">{Math.round(volume * 100)}%</span>
				</div>
				<div className="space-y-2">
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={volume}
						onChange={(e) => changeVolume(parseFloat(e.target.value))}
						className={cn(
							"h-2 w-full cursor-pointer appearance-none rounded-lg",
							"bg-muted",
							"[&::-webkit-slider-thumb]:appearance-none",
							"[&::-webkit-slider-thumb]:h-4",
							"[&::-webkit-slider-thumb]:w-4",
							"[&::-webkit-slider-thumb]:rounded-full",
							"[&::-webkit-slider-thumb]:bg-primary",
							"[&::-webkit-slider-thumb]:cursor-pointer",
							"[&::-moz-range-thumb]:h-4",
							"[&::-moz-range-thumb]:w-4",
							"[&::-moz-range-thumb]:rounded-full",
							"[&::-moz-range-thumb]:bg-primary",
							"[&::-moz-range-thumb]:cursor-pointer",
							"[&::-moz-range-thumb]:border-none"
						)}
						disabled={!isPlaying}
					/>
					<div className="text-muted-foreground text-xs">
						{!isPlaying && "Activez la musique pour ajuster le volume"}
					</div>
				</div>
			</div>
		</div>
	);
}
