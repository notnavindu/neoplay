<script lang="ts">
	import { spotifyPlaybackState } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { fetchLyrics, findCurrentLyricIndex, type LyricLine } from '$lib/utils/lyrics.util';
	import { onDestroy, onMount } from 'svelte';

	let lyrics: LyricLine[] = [];
	let currentLineIndex = 0;
	let loading = true;
	let error: string | null = null;
	let positionInterval: number;
	let currentPosition = 0;
	let lastTrackId = '';

	const CENTER_RADIUS = 50;
	const DISC_SIZE = 500;
	const TEXT_START_RADIUS = 65;
	const TEXT_END_RADIUS = 240;
	const SPIRAL_TURNS = 14;
	const LYRICS_DELAY = 0;

	async function loadLyrics(
		trackName: string,
		artistName: string,
		albumName?: string,
		duration?: number
	) {
		loading = true;
		error = null;
		lyrics = [];

		const result = await fetchLyrics(trackName, artistName, albumName, duration);
		lyrics = result.lyrics;
		error = result.error;
		loading = false;
	}

	function updatePosition() {
		const newIndex = findCurrentLyricIndex(lyrics, currentPosition / 1000, LYRICS_DELAY);
		if (newIndex !== currentLineIndex && lyrics.length > 0) {
			currentLineIndex = newIndex;
		}
	}

	$: if ($spotifyPlaybackState) {
		currentPosition = $spotifyPlaybackState.position ?? 0;
		updatePosition();
	}

	function startPositionTracking() {
		positionInterval = setInterval(() => {
			if ($spotifyPlaybackState && !$spotifyPlaybackState.paused) {
				currentPosition += 100;
				updatePosition();
			}
		}, 100);
	}

	$: if ($currentTrack && $currentTrack.id && $currentTrack.id !== lastTrackId) {
		lastTrackId = $currentTrack.id;
		loadLyrics(
			$currentTrack.name,
			$currentTrack.artists?.[0]?.name || '',
			$currentTrack.album?.name,
			$currentTrack.duration_ms ? $currentTrack.duration_ms / 1000 : undefined
		);
		currentLineIndex = 0;
	}

	onMount(() => startPositionTracking());
	onDestroy(() => {
		if (positionInterval) clearInterval(positionInterval);
	});

	function generateSpiralPath(): string {
		const cx = DISC_SIZE / 2;
		const cy = DISC_SIZE / 2;
		const steps = 2000;
		let path = '';

		for (let i = 0; i <= steps; i++) {
			const t = i / steps;
			const radius = TEXT_START_RADIUS + t * (TEXT_END_RADIUS - TEXT_START_RADIUS);
			const angle = t * SPIRAL_TURNS * 2 * Math.PI - Math.PI / 2;
			const x = cx + radius * Math.cos(angle);
			const y = cy + radius * Math.sin(angle);
			path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
		}
		return path;
	}

	$: spiralPath = generateSpiralPath();
</script>

<div class="w-full h-full flex items-center justify-center p-4">
	<div class="relative" style="width: {DISC_SIZE}px; height: {DISC_SIZE}px;">
		<!-- Vinyl disc -->
		<div class="absolute inset-0 rounded-full bg-[#1a1a1a] shadow-2xl overflow-hidden vinyl-spin">
			<!-- Grooves -->
			{#each Array(35) as _, i}
				<div
					class="absolute rounded-full border border-white/[0.025]"
					style="
						left: {50 - (i + 1) * 1.4}%;
						top: {50 - (i + 1) * 1.4}%;
						width: {(i + 1) * 2.8}%;
						height: {(i + 1) * 2.8}%;
					"
				></div>
			{/each}

			<!-- Spiral lyrics SVG -->
			<svg
				viewBox="0 0 {DISC_SIZE} {DISC_SIZE}"
				class="absolute inset-0 w-full h-full"
				style="overflow: visible;"
			>
				<defs>
					<path id="spiral" d={spiralPath} fill="none" />
				</defs>

				{#if lyrics.length > 0}
					<!-- All lyrics on spiral with varying opacity -->
					<text fill="#c9a227" font-size="10" font-family="'Geist Mono', monospace">
						<textPath href="#spiral">
							{#each lyrics as lyric, i}
								<tspan
									class="lyric-line"
									opacity={i === currentLineIndex ? 1 : i < currentLineIndex ? 0.2 : 0.5}
									>{lyric.text}</tspan
								>
								{#if i < lyrics.length - 1}<tspan opacity="0.3"> • </tspan>{/if}
							{/each}
						</textPath>
					</text>
				{:else if loading}
					<text fill="#c9a227" font-size="10" font-family="'Geist Mono', monospace" opacity="0.5">
						<textPath href="#spiral" startOffset="0"
							>Loading lyrics • Loading lyrics • Loading lyrics • Loading lyrics • Loading lyrics •
							Loading lyrics • Loading lyrics • Loading lyrics • Loading lyrics • Loading lyrics •
							Loading lyrics • Loading lyrics • Loading lyrics • Loading lyrics • Loading lyrics •
							Loading lyrics • Loading lyrics • Loading lyrics</textPath
						>
					</text>
				{:else if error}
					<text fill="#c9a227" font-size="10" font-family="'Geist Mono', monospace" opacity="0.5">
						<textPath href="#spiral" startOffset="0"
							>{error} • {error} • {error} • {error} • {error} • {error} • {error} • {error} • {error}
							• {error} • {error} • {error} • {error} • {error} • {error} • {error} • {error} • {error}</textPath
						>
					</text>
				{/if}
			</svg>
		</div>

		<!-- Center label -->
		<div
			class="absolute rounded-full bg-[#c9a227] flex items-center justify-center"
			style="
				width: {CENTER_RADIUS * 2}px;
				height: {CENTER_RADIUS * 2}px;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			"
		>
			{#if lyrics.length > 0}
				{#key currentLineIndex}
					<div
						class="absolute inset-2 flex items-center justify-center text-center overflow-hidden"
					>
						<p
							class="text-[#12122a] text-[8px] font-bold leading-tight px-1 animate-fade-in"
							style="font-family: 'Geist Mono', monospace;"
						>
							{lyrics[currentLineIndex]?.text || ''}
						</p>
					</div>
				{/key}
			{:else if loading}
				<div class="absolute inset-2 flex items-center justify-center">
					<div
						class="w-5 h-5 border-2 border-[#12122a] border-t-transparent rounded-full animate-spin"
					></div>
				</div>
			{:else if error}
				<div class="absolute inset-2 flex items-center justify-center text-center">
					<p class="text-[#12122a] text-[7px] font-bold px-1">{error}</p>
				</div>
			{/if}
		</div>

		<!-- Song title (top) -->
		<svg
			viewBox="0 0 {DISC_SIZE} {DISC_SIZE}"
			class="absolute inset-0 w-full h-full pointer-events-none"
		>
			<defs>
				<path id="titleArc" d="M 60 250 A 190 190 0 0 1 440 250" fill="none" />
			</defs>
			{#if $currentTrack}
				<text
					fill="#c9a227"
					font-size="13"
					font-family="'Geist Mono', monospace"
					font-weight="bold"
					letter-spacing="4"
				>
					<textPath href="#titleArc" startOffset="50%" text-anchor="middle">
						{$currentTrack.name.toUpperCase().slice(0, 20)}
					</textPath>
				</text>
			{/if}
		</svg>

		<!-- Artist name (bottom) -->
		<svg
			viewBox="0 0 {DISC_SIZE} {DISC_SIZE}"
			class="absolute inset-0 w-full h-full pointer-events-none"
		>
			<defs>
				<path id="artistArc" d="M 440 250 A 190 190 0 0 1 60 250" fill="none" />
			</defs>
			{#if $currentTrack}
				<text
					fill="#c9a227"
					font-size="10"
					font-family="'Geist Mono', monospace"
					letter-spacing="3"
				>
					<textPath href="#artistArc" startOffset="50%" text-anchor="middle">
						{$currentTrack.artists?.[0]?.name?.toUpperCase() || ''}
					</textPath>
				</text>
			{/if}
		</svg>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.25s ease-out;
	}

	@keyframes vinyl-rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}

	.vinyl-spin {
		animation: vinyl-rotate 240s linear infinite;
	}

	.lyric-line {
		transition: opacity 0.5s ease-in-out;
	}
</style>
