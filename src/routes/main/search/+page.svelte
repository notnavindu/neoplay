<script lang="ts">
	import { searchTerm } from '$lib/stores/search.store';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { createQuery } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

	let tempSearchTerm = $searchTerm;

	const handleKeyUp = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === 'Return') {
			searchTerm.set(tempSearchTerm);
		}
	};

	const handleTrackClick = async (trackUri: string) => {
		if (!$searchQuery.data) return;
		const otherResults = $searchQuery.data.tracks.items
			.filter((track) => track.uri !== trackUri)
			.map((track) => track.uri);

		const devices = await $spotifySdk!.player.getAvailableDevices();
		if (!devices) return;
		const activeDevice = devices.devices.find((device) => device.is_active);
		await $spotifySdk!.player.startResumePlayback(activeDevice?.id!, undefined, [
			trackUri,
			...otherResults
		]);
	};

	$: searchQuery = createQuery({
		queryKey: ['search', $searchTerm],
		queryFn: async () => $spotifySdk?.search($searchTerm, ['artist', 'track'], undefined, 9),

		enabled: $searchTerm.length > 0
	});
</script>

<div class="pt-6 overflow-scroll">
	<input
		bind:value={tempSearchTerm}
		on:keyup={handleKeyUp}
		class="py-1 px-2 w-full border-b border-neo-blue bg-transparent outline-none"
		placeholder="Type and press enter to search"
	/>

	<div class="mt-4 h-full overflow-auto">
		{#if $searchTerm.length > 0}
			{#if $searchQuery.isFetching}
				<div>Loading...</div>
			{:else if $searchQuery.data}
				<div>
					<div class="text-white/70">// TRACKS</div>

					<div class="grid grid-cols-3 msd:bg-red-400 gap-1 mt-1">
						{#each $searchQuery.data.tracks.items as track, i (track.id)}
							<button
								in:fly|global={{ y: 10, delay: i * 50 }}
								on:click={() => handleTrackClick(track.uri)}
								class="flex gap-2 items-center hover:bg-white/10 text-left p-1"
							>
								<div class="aspect-square flex-shrink-0 bg-white/30 size-10">
									{#if track.album.images.length > 0}
										<img src={track.album.images[0].url} alt={track.name} class="size-10" />
									{/if}
								</div>
								<div class="flex flex-col">
									<div class="line-clamp-2">{track.name}</div>
									<div class="opacity-50">
										{track.artists.map((artist) => artist.name).join(', ')}
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>

				<div class="mt-6">
					<div class="text-white/70">// ARTISTS</div>

					<div class="grid grid-cols-3 msd:bg-red-400 gap-1 mt-1">
						{#each $searchQuery.data.artists.items as artist, i (artist.id)}
							<button
								in:fly|global={{ y: 10, delay: i * 50 }}
								on:click={() => toast.error('Not implemented yet')}
								class="flex gap-2 items-center hover:bg-white/10 text-left p-1"
							>
								<div class="aspect-square flex-shrink-0 bg-white/30 size-10">
									{#if artist.images.length > 0}
										<img src={artist.images[0].url} alt={artist.name} class="size-10" />
									{/if}
								</div>
								<div class="flex flex-col">
									<div class="line-clamp-2">{artist.name}</div>
									<div class="opacity-50">
										{artist.followers.total} followers
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
