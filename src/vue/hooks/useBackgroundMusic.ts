"use client";

import { useEffect, useRef, useState } from "react";

const MUSIC_CONFIG = {
	name: "Musique par défaut",
	filename: "music-default.mp3",
	blobUrl: null as string | null,
	localUrl: "/audio/music-default.mp3"
};

interface AudioTrack {
	filename: string;
	url: string;
}

interface AudioConfig {
	tracks: AudioTrack[];
}

export function useBackgroundMusic() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.3);
	const [isLoading, setIsLoading] = useState(true);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);

	useEffect(() => {
		async function loadAudioUrl() {
			try {
				const response = await fetch("/api/audio-config");
				if (response.ok) {
					const config: AudioConfig = await response.json();

					const defaultTrack = config.tracks?.find(
						(track: AudioTrack) => track.filename === MUSIC_CONFIG.filename
					);

					if (defaultTrack?.url) {
						setAudioUrl(defaultTrack.url);
					} else {
						// Fallback
						setAudioUrl(MUSIC_CONFIG.localUrl);
					}
				} else {
					setAudioUrl(MUSIC_CONFIG.localUrl);
				}
			} catch (error) {
				console.warn("Erreur lors du chargement de la configuration audio:", error);
				setAudioUrl(MUSIC_CONFIG.localUrl);
			} finally {
				setIsLoading(false);
			}
		}

		loadAudioUrl();
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined" && audioUrl) {
			audioRef.current = new Audio(audioUrl);
			audioRef.current.loop = true;
			audioRef.current.volume = volume;

			const audio = audioRef.current;

			const handleEnded = () => setIsPlaying(false);
			const handleError = (e: Event) => {
				console.error("Erreur audio:", e);
				setIsPlaying(false);
			};

			audio.addEventListener("ended", handleEnded);
			audio.addEventListener("error", handleError);

			return () => {
				audio.removeEventListener("ended", handleEnded);
				audio.removeEventListener("error", handleError);
				audio.pause();
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioUrl]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	const play = async () => {
		if (!audioRef.current || isPlaying) return;

		try {
			await audioRef.current.play();
			setIsPlaying(true);
			console.log("🎵 Lecture de la musique de fond");
		} catch (error) {
			console.error("Erreur lors de la lecture:", error);
			setIsPlaying(false);
		}
	};

	const pause = () => {
		if (audioRef.current && isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	};

	const toggle = async () => {
		if (isPlaying) {
			pause();
		} else {
			await play();
		}
	};

	const stop = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setIsPlaying(false);
		}
	};

	const changeVolume = (newVolume: number) => {
		const clampedVolume = Math.max(0, Math.min(1, newVolume));
		setVolume(clampedVolume);

		if (audioRef.current) {
			audioRef.current.volume = clampedVolume;
		}
	};

	return {
		// State
		isPlaying,
		volume,
		isLoading,
		audioUrl,

		// Actions
		play,
		pause,
		toggle,
		stop,
		changeVolume,
		// Utilities
		hasAudio: audioUrl !== null,
		isReady: !isLoading && audioRef.current !== null,
		trackName: MUSIC_CONFIG.name
	};
}
