<script lang="ts">
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { trackInfoWindow } from '$lib/stores/track-info-window.store';

	const handleMouseEnter = () => {
		trackInfoWindow.keepOpen();
	};

	const handleMouseLeave = () => {
		trackInfoWindow.close($trackInfoWindow?.track?.id);
	};

	const handleAddToQueue = async () => {
		await $spotifySdk?.player.addItemToPlaybackQueue($trackInfoWindow.track!.uri);
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	class="w-56 fixed text-white/70 p-2 z-50 bg-neo-gray-1/50 backdrop-blur-md border border-neo-gray-1"
	style="top: {$trackInfoWindow.y + 6}px; left: {$trackInfoWindow.x + 20}px"
>
	<span class="mb-2">// TRACK</span>

	{#if $trackInfoWindow.track}
		<div class="flx flex-col gap-2">
			<div class="bg-white/5 aspect-square">
				<img
					src={$trackInfoWindow.track.album.images[0].url}
					alt="Album art for {$trackInfoWindow.track.name}"
				/>
			</div>
			<div class=" text-white text-base">{$trackInfoWindow.track.name}</div>
			<div>{$trackInfoWindow.track.artists[0].name}</div>
			<div class="text-white/40 mt-1">({$trackInfoWindow.track.album.name})</div>
			<div class="w-full flex justify-between">
				<button on:click={handleAddToQueue}>add to queue</button>
			</div>
		</div>
	{/if}
</div>
