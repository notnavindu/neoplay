<script lang="ts">
	import { QUERY_KEYS } from '$lib/constants/query.const';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { fly } from 'svelte/transition';

	export let id: string;
	export let open: boolean;

	const limit = 30;

	const tracksInPlaylistQuery = createInfiniteQuery({
		queryKey: [QUERY_KEYS.USER_PLAYLISTS, id],
		initialPageParam: { limit: limit, offset: 0 },
		queryFn: ({ pageParam }) =>
			$spotifySdk?.playlists.getPlaylistItems(
				id,
				undefined,
				'next,href,items(track(id,name))',
				pageParam.limit as 50,
				pageParam.offset
			),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.next) {
				return { limit: limit, offset: allPages.length * limit };
			}
		},

		enabled: open
	});
</script>

<div class="ml-[14px] text-white/60 mt-1">
	{#if $tracksInPlaylistQuery.isLoading}
		<div>Loading</div>
	{:else if $tracksInPlaylistQuery.isError}
		<p>Error: {$tracksInPlaylistQuery.error.message}</p>
	{:else if $tracksInPlaylistQuery.isSuccess && $tracksInPlaylistQuery.data}
		{#if $tracksInPlaylistQuery.data.pages[0]?.items}
			{#each $tracksInPlaylistQuery.data.pages as page}
				{#if page?.items}
					{#each page.items as item, i (item.track.id)}
						<div
							in:fly|global={{ y: 10, delay: 10 * i }}
							class="overflow-hidden whitespace-nowrap text-ellipsis"
						>
							♪ {item.track.name}
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
