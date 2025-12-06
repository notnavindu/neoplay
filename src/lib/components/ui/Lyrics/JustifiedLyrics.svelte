<script lang="ts">
	import { spotifyPlaybackState } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { fetchLyrics, findCurrentLyricIndex, type LyricLine } from '$lib/utils/lyrics.util';
	import { onDestroy, onMount } from 'svelte';

	let lyrics: LyricLine[] = [];
	let currentIndex = -1;
	let loading = true;
	let error: string | null = null;
	let positionInterval: number;
	let currentPosition = 0;
	let lastTrackId = '';

	const LYRICS_DELAY = 0.3; // Small delay for better sync feel

	async function loadLyrics() {
		if (!$currentTrack) return;

		loading = true;
		error = null;
		lyrics = [];
		currentIndex = -1;

		const result = await fetchLyrics(
			$currentTrack.name,
			$currentTrack.artists?.[0]?.name || '',
			$currentTrack.album?.name,
			$currentTrack.duration_ms ? $currentTrack.duration_ms / 1000 : undefined
		);

		lyrics = result.lyrics;
		error = result.error;
		loading = false;
	}

	function updatePosition() {
		const newIndex = findCurrentLyricIndex(lyrics, currentPosition / 1000, LYRICS_DELAY);
		if (newIndex !== currentIndex) {
			currentIndex = newIndex;
		}
	}

	$: if ($spotifyPlaybackState) {
		currentPosition = $spotifyPlaybackState.position ?? 0;
		updatePosition();
	}

	$: if ($currentTrack?.id && $currentTrack.id !== lastTrackId) {
		lastTrackId = $currentTrack.id;
		loadLyrics();
	}

	onMount(() => {
		positionInterval = setInterval(() => {
			if ($spotifyPlaybackState && !$spotifyPlaybackState.paused) {
				currentPosition += 100;
				updatePosition();
			}
		}, 100);
	});

	onDestroy(() => {
		if (positionInterval) clearInterval(positionInterval);
	});

	$: currentLyric = currentIndex >= 0 ? lyrics[currentIndex]?.text : null;
	$: nextLyric =
		currentIndex >= 0 && currentIndex < lyrics.length - 1 ? lyrics[currentIndex + 1]?.text : null;

	// Split lyric into words for staggered animation
	$: words = currentLyric ? currentLyric.split(/\s+/) : [];

	// Dynamic font size based on text length
	$: textSizeClass = !currentLyric
		? 'text-5xl'
		: currentLyric.length < 20
			? 'text-5xl'
			: currentLyric.length < 40
				? 'text-4xl'
				: currentLyric.length < 60
					? 'text-3xl'
					: 'text-2xl';
</script>

<div class="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
	{#if loading}
		<div class="text-white/40 text-lg animate-pulse">Loading lyrics...</div>
	{:else if error || lyrics.length === 0}
		<div class="text-white/30 text-lg">No lyrics available</div>
	{:else}
		<!-- Current lyric -->
		<div class="flex-1 flex items-center justify-center w-full px-8 overflow-hidden">
			{#key currentIndex}
				<p
					class="font-medium text-white w-[20rem] md:w-[26rem] leading-relaxed lyric-text {textSizeClass}"
				>
					{#if words.length > 0}
						{#each words as word, i}
							<span class="word-fade" style="animation-delay: {i * 60}ms"
								>{word}{i < words.length - 1 ? ' ' : ''}</span
							>
						{/each}
					{:else}
						<span class="word-fade">♪</span>
					{/if}
				</p>
			{/key}
		</div>

		<!-- Next lyric preview -->
		<div class="absolute bottom-6 left-0 right-0 flex justify-center px-8">
			{#key currentIndex}
				<p class="text-sm text-white/40 truncate max-w-md text-center animate-next-in">
					{nextLyric || ''}
				</p>
			{/key}
		</div>
	{/if}
</div>

<style>
	@keyframes word-fade {
		0% {
			opacity: 0;
			transform: translateY(8px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes next-in {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes word-fade {
		0% {
			opacity: 0;
			transform: translateY(8px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.word-fade {
		display: inline;
		opacity: 0;
		animation: word-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.animate-next-in {
		animation: next-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
		opacity: 0;
	}

	.lyric-text {
		text-align: justify;
		text-align-last: justify;
		text-justify: inter-word;
	}
</style>
