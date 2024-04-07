<script>
	import { spotifyDeviceId, spotifyPlaybackState, spotifySdk } from '$lib/stores/spotify.store';
	import DeviceDisconnectedModal from '../modals/DeviceDisconnectedModal.svelte';
</script>

<div class="p-4">
	{#if $spotifyPlaybackState}
		<div>// PLAYING ON: <span class="text-neo-blue">This Device</span></div>
	{:else}
		{#await $spotifySdk?.player.getAvailableDevices()}
			<div class="h-full w-full shimmer-bg"></div>
		{:then devices}
			{@const activeDevice = devices?.devices.find((d) => d.is_active)}
			{#if activeDevice}
				<div class="line-clamp-1">
					// PLAYING ON: <span class="text-neo-blue">{activeDevice?.name}</span>
				</div>
			{:else}
				<div>// NO ACTIVE DEVICE</div>
			{/if}

			{activeDevice?.id}
			{#if $spotifyDeviceId !== activeDevice?.id}
				<DeviceDisconnectedModal />
			{/if}
		{/await}
	{/if}
</div>
