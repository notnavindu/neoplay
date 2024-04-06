<script>
	import { spotifyPlaybackState, spotifySdk } from '$lib/stores/spotify.store';
</script>

<div class="p-4">
	{#if $spotifyPlaybackState}
		<div>// PLAYING ON: <span class="text-neo-blue">This Device</span></div>
	{:else}
		{#await $spotifySdk?.player.getAvailableDevices()}
			<div class="h-full w-full shimmer"></div>
		{:then devices}
			{@const activeDevice = devices?.devices.find((d) => d.is_active)}
			<div>// PLAYING ON: <span class="text-neo-blue">{activeDevice?.name}</span></div>
		{/await}
	{/if}
</div>
