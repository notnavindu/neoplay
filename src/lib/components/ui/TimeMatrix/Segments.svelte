<script lang="ts">
	import { SECTION_COLORS } from '$lib/constants/colors.const';
	import { QUERY_KEYS } from '$lib/constants/query.const';
	import { spotifyPlaybackState, spotifySdk } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import type { Segment } from '@spotify/web-api-ts-sdk';
	import { createQuery } from '@tanstack/svelte-query';

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

	const normalizeLoudness = (sections: Segment[]) => {
		// Find the minimum and maximum loudness values
		const minLoudness = Math.min(...sections.map((section) => section.loudness_start));
		const maxLoudness = Math.max(...sections.map((section) => section.loudness_start));

		const minRange = 0.2;
		const maxRange = 1;

		// Normalize loudness values between the defined range
		const normalizedSections: number[] = sections.map((section) => {
			return (
				minRange +
				((section.loudness_start - minLoudness) / (maxLoudness - minLoudness)) *
					(maxRange - minRange)
			);
		});

		// Normalize loudness values between 0 and 1

		return normalizedSections;
	};

	$: duration = $spotifyPlaybackState?.duration ?? 1;
	$: {
		if ($analysisQuery.data?.segments) {
			normalizedLoudness = normalizeLoudness($analysisQuery.data?.segments);
			console.log('🚀 ~ normalizedLoudness:', normalizedLoudness);
		}
	}
</script>

<div class="w-full h-full absolute inset-0 z-10 flex" bind:this={container}>
	{#if container}
		{#if $analysisQuery.isLoading}
			<p>Loading...</p>
		{:else if $analysisQuery.isError}
			<p>Error: {$analysisQuery.error.message}</p>
		{:else if $analysisQuery.isSuccess}
			{#if $analysisQuery.data?.segments}
				{#each $analysisQuery.data?.segments as segment, i}
					<div
						class="h-full"
						style="background-color: #4891ff; 
                            width: {getWidth(segment.duration * 1000)}px;
                            opacity: {normalizedLoudness[i]};"
					></div>
				{/each}
			{/if}
		{/if}
	{/if}
</div>
