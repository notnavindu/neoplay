<script lang="ts">
	import CurrentTrack from '$lib/components/web-player/CurrentTrack.svelte';
	import { spotifyPlayer, spotifySdk } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { onMount } from 'svelte';

	let data: any;
	onMount(async () => {
		data = await $spotifySdk?.currentUser.profile();
	});
</script>

<div class="w-full">
	<CurrentTrack />
</div>
<button on:click={() => $spotifyPlayer?.togglePlay()}>Play</button>
