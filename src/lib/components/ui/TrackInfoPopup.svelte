<script lang="ts">
	import { QUERY_KEYS } from '$lib/constants/query.const';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { trackInfoWindow } from '$lib/stores/track-info-window.store';
	import { createQuery } from '@tanstack/svelte-query';

	const handleMouseEnter = () => {
		trackInfoWindow.keepOpen();
	};

	const handleMouseLeave = () => {
		trackInfoWindow.close($trackInfoWindow?.track?.id);
	};

	const handleAddToQueue = async () => {
		await $spotifySdk?.player.addItemToPlaybackQueue($trackInfoWindow.track!.uri);
	};

	$: songInfoQuery = createQuery({
		queryKey: [QUERY_KEYS.TRACK_INFO, $trackInfoWindow.track?.id],
		queryFn: () => {
			if ($trackInfoWindow.track?.artists) {
				return $trackInfoWindow.track;
			} else {
				return $spotifySdk?.tracks.get($trackInfoWindow.track!.id);
			}
		},
		enabled: !!$trackInfoWindow.track?.id
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	class="w-56 fixed text-white/70 p-2 z-50 bg-neo-gray-1/50 backdrop-blur-md border border-neo-gray-1"
	style="top: {$trackInfoWindow.y + 6}px; left: {$trackInfoWindow.x + 20}px"
>
	<span class="mb-2">// TRACK</span>

	{#if $songInfoQuery.isLoading}
		<div class="flex flex-col gap-2">
			<div class="bg-white/5 aspect-square w-full shimmer-bg"></div>
			<div class="bg-white/5 h-6 w-full shimmer-bg"></div>
			<div class="bg-white/5 h-6 w-full shimmer-bg"></div>
		</div>
	{:else if $songInfoQuery.data}
		<div class="flex flex-col gap-1">
			<div class="bg-white/5 aspect-square">
				{#if $songInfoQuery.data.album?.images?.[0]?.url}
					<img
						src={$songInfoQuery.data.album.images[0].url}
						alt="Album art for {$songInfoQuery.data.name}"
					/>
				{/if}
			</div>
			<div class=" text-white text-base">{$songInfoQuery.data.name}</div>
			<div>{$songInfoQuery.data.artists[0].name}</div>
			<div class="text-white/40 mt-1">({$songInfoQuery.data.album.name})</div>
			<div class="w-full flex justify-between">
				<button on:click={handleAddToQueue}>add to queue</button>
			</div>
		</div>
	{/if}
</div>
