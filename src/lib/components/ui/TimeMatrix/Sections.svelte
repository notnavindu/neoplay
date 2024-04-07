<script lang="ts">
	import { SECTION_COLORS } from '$lib/constants/colors.const';
	import { QUERY_KEYS } from '$lib/constants/query.const';
	import { spotifyPlaybackState, spotifySdk } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import type { Section } from '@spotify/web-api-ts-sdk';
	import { createQuery } from '@tanstack/svelte-query';
	import { fly } from 'svelte/transition';

	let container: HTMLDivElement | undefined;
	let normalizedLoudness: number[] = [];

	const analysisQuery = createQuery({
		queryKey: [QUERY_KEYS.TRACK_ANALYSIS, $currentTrack!.id],
		queryFn: () => $spotifySdk?.tracks.audioAnalysis($currentTrack!.id as string)
	});

	const getSectionColor = (index: number) => {
		return SECTION_COLORS[index % SECTION_COLORS.length!];
	};

	const getWidth = (sectionDurationMs: number) => {
		if (!container) return 0;
		const { width } = container.getBoundingClientRect();
		const percent = sectionDurationMs / duration;
		const sectionWidth = width * percent;
		return sectionWidth;
	};

	const normalizeLoudness = (sections: Section[]) => {
		// Extract loudness values
		const loudnessValues: number[] = sections.map((section) => section.loudness);

		// Calculate the number of sections
		const n = loudnessValues.length;

		// Sort the loudness values to calculate percentiles
		const sortedLoudnessValues = loudnessValues.slice().sort((a, b) => a - b);

		// Create a mapping from loudness values to their normalized counterparts
		const loudnessToNormalizedMap: Record<number, number> = {};

		// Calculate percentiles for each loudness value
		sections.forEach((section, index) => {
			const loudness = section.loudness;
			const rank = sortedLoudnessValues.findIndex((val) => val === loudness);
			const percentile = rank / (n - 1);
			const normalizedValue = 0.1 + 0.9 * percentile;
			loudnessToNormalizedMap[loudness] = normalizedValue;
		});

		// Map original loudness values to their corresponding normalized values
		const result: number[] = loudnessValues.map((loudness) => loudnessToNormalizedMap[loudness]);

		return result;
	};

	$: duration = $spotifyPlaybackState?.duration ?? 1;
	$: {
		if ($analysisQuery.data?.sections) {
			normalizedLoudness = normalizeLoudness($analysisQuery.data?.sections);
		}
	}
</script>

<div
	class="w-full h-full absolute inset-0 z-10 flex divide-x divide-neo-blue/70"
	bind:this={container}
>
	{#if container}
		{#if $analysisQuery.isLoading}
			<p>Loading...</p>
		{:else if $analysisQuery.isError}
			<p>Error: {$analysisQuery.error.message}</p>
		{:else if $analysisQuery.isSuccess}
			{#if $analysisQuery.data?.sections}
				{#each $analysisQuery.data?.sections as section, i (i)}
					<div
						in:fly|global={{ x: 30, delay: 50 * i }}
						class="h-full dots"
						style="width: {getWidth(section.duration * 1000)}px;
                                opacity: {normalizedLoudness[i]};"
					></div>
				{/each}
			{/if}
		{/if}
	{/if}
</div>

<style>
	.dots {
		--dot-bg: #02060d;
		--dot-color: #4891ff;
		--dot-size: 1px;
		--dot-space: 8px;
		background:
			linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%)
				center / var(--dot-space) var(--dot-space),
			linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center /
				var(--dot-space) var(--dot-space),
			var(--dot-color);
	}
</style>
