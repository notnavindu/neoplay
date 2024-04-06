<script lang="ts">
	import { spotifyPlaybackState, spotifySdk } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import type { Queue, TrackItem } from '@spotify/web-api-ts-sdk';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let current: TrackItem | null | undefined;
	let queue: TrackItem[] = [];

	const getQueue = async () => {
		let res = await $spotifySdk?.player.getUsersQueue();
		current = res?.currently_playing;
		queue = res?.queue ?? [];
	};

	$: {
		if ($spotifyPlaybackState) getQueue();
	}
</script>

<div class="relative">
	<div
		class="absolute w-full h-1/4 bottom-px bg-gradient-to-b from-transparent to-neo-black overflow-auto"
	></div>
	<div class="h-44 border-b border-neo-gray-1 p-4 overflow-scroll">
		<div class="text-white/70">// QUEUE</div>

		<div class="overflow-scroll">
			{#if current}
				<div class="text-neo-blue">
					{current.name}
				</div>
			{/if}
			{#each queue as track, i (track.id)}
				<div in:fly={{ y: 10, delay: 100 * i }}>
					{track.name}
				</div>
			{:else}
				<div class="w-full h-3 shimmer"></div>
				<div class="w-full h-3 shimmer"></div>
				<div class="w-full h-3 shimmer"></div>
				<div class="w-full h-3 shimmer"></div>
				<div class="w-full h-3 shimmer"></div>
			{/each}
		</div>
	</div>
</div>
