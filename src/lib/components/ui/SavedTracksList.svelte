<script lang="ts">
	import { switchPlaylist } from '$lib/actions/player.actions';
	import { QUERY_KEYS } from '$lib/constants/query.const';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { trackInfoWindow } from '$lib/stores/track-info-window.store';
	import type { Track } from '@spotify/web-api-ts-sdk';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let open: boolean;

	let userUri: string;

	const limit = 30;

	const tracksInPlaylistQuery = createInfiniteQuery({
		queryKey: [QUERY_KEYS.USER_SAVED_TRACKS],
		initialPageParam: { limit: limit, offset: 0 },
		queryFn: ({ pageParam }) =>
			$spotifySdk?.currentUser.tracks.savedTracks(pageParam.limit as 30, pageParam.offset),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.next) {
				return { limit: limit, offset: allPages.length * limit };
			}
		},

		enabled: open
	});

	const handleMouseEnter = (e: MouseEvent, track: Track) => {
		const element = e.target as HTMLElement;

		const boundingBox = element.getBoundingClientRect();
		trackInfoWindow.open({
			source: 'trigger',
			track: track,
			triggeredTrackId: track.id,
			x: boundingBox.left,
			y: boundingBox.top
		});
	};

	const handleMouseLeave = (track: Track) => {
		trackInfoWindow.close(track.id);
	};

	onMount(async () => {
		await $spotifySdk?.currentUser.profile().then((data) => {
			userUri = data.uri;
		});
	});
</script>

<div class="ml-[14px] text-white/60 mt-1 relative">
	{#if $tracksInPlaylistQuery.isLoading}
		<div>Loading</div>
	{:else if $tracksInPlaylistQuery.isError}
		<p>Error: {$tracksInPlaylistQuery.error.message}</p>
	{:else if $tracksInPlaylistQuery.isSuccess && $tracksInPlaylistQuery.data}
		{#if $tracksInPlaylistQuery.data.pages[0]?.items}
			{#each $tracksInPlaylistQuery.data.pages as page}
				{#if page?.items}
					{#each page.items as item, i (item.track.id)}
						<div class="w-full flex justify-between" in:fly|global={{ y: 10, delay: 10 * i }}>
							<button
								on:click={() => switchPlaylist(`${userUri}:collection`, item.track.uri)}
								class="overflow-hidden whitespace-nowrap text-ellipsis text-left block w-full"
							>
								♪ {item.track.name}
							</button>

							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								on:mouseenter={(e) => handleMouseEnter(e, item.track)}
								on:mouseleave={() => handleMouseLeave(item.track)}
								class="px-1 cursor-pointer"
							>
								▹
							</div>
						</div>
					{/each}
				{/if}
			{/each}

			{#if $tracksInPlaylistQuery.hasNextPage}
				<button
					class="text-neo-blue/80 mb-2"
					on:click={() => $tracksInPlaylistQuery.fetchNextPage()}
				>
					Load more
				</button>
			{/if}
		{:else}
			<div>Playlist Empty</div>
		{/if}
	{/if}
</div>
