<script lang="ts">
	import { QUERY_KEYS } from '$lib/constants/query.const';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { fly } from 'svelte/transition';
	import PlaylistRow from './PlaylistRow.svelte';
	import SavedTracksRow from './SavedTracksRow.svelte';

	const limit = 50;
	const userPlaylistsQuery = createInfiniteQuery({
		queryKey: [QUERY_KEYS.USER_PLAYLISTS],
		initialPageParam: { limit: limit, offset: 0 },
		queryFn: ({ pageParam }) =>
			$spotifySdk?.currentUser.playlists.playlists(pageParam.limit as 50, pageParam.offset),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.next) {
				return { limit: limit, offset: allPages.length * limit };
			}
		},
		enabled: !!$spotifySdk
	});
</script>

<div>
	<div class="text-white/70 mb-2">// PLAYLISTS</div>

	{#if $userPlaylistsQuery.isLoading}
		<p>Loading...</p>
	{:else if $userPlaylistsQuery.isError}
		<p>Error: {$userPlaylistsQuery.error.message}</p>
	{:else if $userPlaylistsQuery.isSuccess && $userPlaylistsQuery.data}
		<!-- Saved tracks -->
		<div class="w-full" in:fly|global={{ y: 10 }}>
			<SavedTracksRow />
		</div>

		{#each $userPlaylistsQuery.data.pages as page}
			{#if page}
				{#each page.items as playlist, i (playlist.id)}
					<div in:fly|global={{ y: 10, delay: 10 * (i + 1) }}>
						<PlaylistRow id={playlist.id} name={playlist.name} playlistContextUri={playlist.uri} />
					</div>
				{/each}
			{/if}
		{/each}

		{#if $userPlaylistsQuery.hasNextPage}
			<button class="text-neo-blue/80 mt-2" on:click={() => $userPlaylistsQuery.fetchNextPage()}>
				Load more
			</button>
		{/if}
	{/if}
</div>
